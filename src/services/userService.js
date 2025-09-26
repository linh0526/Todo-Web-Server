require("dotenv").config();

const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const createUserService = async (name, email, password, ggid, picture) => {
    try {
        //check user exist
        const user = await User.findOne({ email });

        if (user) {
            console.log(`>>> user exist, chọn 1 email khác: ${email}`);
            return null;
        }

        //hash user password
        if (password) {
            const hashPassword = await bcrypt.hash(password, saltRounds);
            password = hashPassword; // update password with hashed value
        } else {
            password = null; // nếu không có password (ví dụ đăng nhập bằng Google)
        }
        //save user to database
        let result = await User.create({
            name: name,
            email: email,
            password: password,
            ggid: ggid,
            picture: picture
        })
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

const loginService = async (email, password) => {
    try {
        //fetch user by email
        const user = await User.findOne({ email});
        if (user) {
            //compare password
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return {
                    EC: 2,
                    EM: "Email/Password không hợp lệ"
                }
            } else {
                //create an access token
                const payload = {
                    email: user.email,
                    name: user.name
                }

                const access_token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRE
                    }
                )
                return {
                    EC: 0,
                    access_token,
                    user: {
                        email: user.email,
                        name: user.name
                    }
                };
            }
        } else {
            return {
                EC: 1,
                EM: "Email/Password không hợp lệ"
            }
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getUserService = async () => {
    try {

        let result = await User.find({}).select("-password");
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

const googleLoginService = async (email, name, ggid, picture) => {
    try {
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, email, ggid, picture, password: null });
        } else {
            // update profile info if changed
            const needUpdate = (user.name !== name) || (user.picture !== picture) || (user.ggid !== ggid);
            if (needUpdate) {
                user.name = name || user.name;
                user.picture = picture || user.picture;
                user.ggid = ggid || user.ggid;
                await user.save();
            }
        }

        const payload = { email: user.email, name: user.name };
        const access_token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
        return {
            EC: 0,
            access_token,
            user: {
                email: user.email,
                name: user.name
            }
        };
    } catch (error) {
        console.log(error);
        return { EC: 1, EM: 'Google login failed' };
    }
}
module.exports = {
    createUserService, loginService, getUserService, googleLoginService
}
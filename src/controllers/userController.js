const { createUserService, loginService, getUserService, googleLoginService } = require("../services/userService");

const createUser = async (req, res) => {
    const { name, email, password, ggid, picture } = req.body;
    const data = await createUserService(name, email, password, ggid, picture);
    return res.status(200).json(data)
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const data = await loginService(email, password);

    return res.status(200).json(data)
}

const getUser = async (req, res) => {
    const data = await getUserService();
    return res.status(200).json(data)
}

const getAccount = async (req, res) => {

    return res.status(200).json(req.user)
}

const googleLogin = async (req, res) => {
    const { email, name, ggid, picture } = req.body;
    const data = await googleLoginService(email, name, ggid, picture);
    return res.status(200).json(data);
}

module.exports = {
    createUser, handleLogin, getUser, getAccount, googleLogin

}
const express = require('express');
const { createUser, handleLogin, getUser,
    getAccount, googleLogin
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');
const { createTask, getTasks, updateTask, deleteTask, reorderTasks } = require('../controllers/taskController');

const routerAPI = express.Router();

routerAPI.all("*", auth);

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api")
})

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/login-google", googleLogin);

routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

routerAPI.post("/task", createTask);
routerAPI.get("/task", getTasks);
routerAPI.put("/task/:id", updateTask);
routerAPI.delete("/task/:id", deleteTask);
routerAPI.post("/task/reorder", reorderTasks);



module.exports = routerAPI; //export default
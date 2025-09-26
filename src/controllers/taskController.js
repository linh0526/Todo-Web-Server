const {createTaskService, getAllTasksService, updateTaskService, deleteTaskService, reorderTasksService} = require("../services/taskService");

const createTask = async (req, res) => {
    const taskData = req.body;
    const email = req.user.email;
    const data = await createTaskService(taskData, email);
    return res.status(200).json(data);
}

const getTasks = async (req, res) => {
    const email = req.user.email;
    const data = await getAllTasksService(email);
    return res.status(200).json(data);
}

const updateTask = async (req, res) => {
    const email = req.user.email;
    const { id } = req.params;
    const data = await updateTaskService(id, req.body, email);
    return res.status(200).json(data);
}

const deleteTask = async (req, res) => {
    const email = req.user.email;
    const { id } = req.params;
    const data = await deleteTaskService(id, email);
    return res.status(200).json(data);
}

const reorderTasks = async (req, res) => {
    const email = req.user.email;
    const { orders } = req.body;
    const data = await reorderTasksService(orders || [], email);
    return res.status(200).json(data);
}

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    reorderTasks
}
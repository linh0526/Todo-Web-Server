require("dotenv").config();

const Task = require("../models/task");
const User = require('../models/user');

const createTaskService = async (taskData, email) => {
    try {
        // Create a new task
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");
        const taskCount = await Task.countDocuments({ userId: user._id });
        const newTask = await Task.create({ ...taskData, userId: user._id, order: taskCount });
        return {
            EC: 0,
            EM: "Task created successfully",
            data: newTask
        };
    } catch (error) {
        console.error("Error creating task:", error);
        return {
            EC: 1,
            EM: "Failed to create task",
            data: null
        };
    }
};

const getAllTasksService = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return {
                EC: 1,
                EM: "User not found",
                data: null
            };
        }

        const tasks = await Task.find({ userId: user._id }).sort({ order: 1, createdAt: 1 });

        if (!tasks || tasks.length === 0) {
            return {
                EC: 1,
                EM: "No tasks found for this user",
                data: []
            };
        }
        return {
            EC: 0,
            EM: "Tasks retrieved successfully",
            data: tasks
        };
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return {
            EC: 1,
            EM: "Failed to retrieve tasks",
            data: null
        };
    }
};

const updateTaskService = async (taskId, updates, email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");
        const task = await Task.findOneAndUpdate(
            { _id: taskId, userId: user._id },
            { ...updates, updatedAt: new Date() },
            { new: true }
        );
        if (!task) throw new Error("Task not found");
        return { EC: 0, EM: "Task updated", data: task };
    } catch (error) {
        return { EC: 1, EM: error.message, data: null };
    }
};

const deleteTaskService = async (taskId, email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");
        await Task.deleteOne({ _id: taskId, userId: user._id });
        return { EC: 0, EM: "Task deleted", data: null };
    } catch (error) {
        return { EC: 1, EM: error.message, data: null };
    }
};

const reorderTasksService = async (orders, email) => {
    // orders: Array<{id: string, order: number}>
    try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");
        const bulk = orders.map(({ id, order }) => ({
            updateOne: {
                filter: { _id: id, userId: user._id },
                update: { order, updatedAt: new Date() }
            }
        }));
        if (bulk.length > 0) await Task.bulkWrite(bulk);
        const tasks = await Task.find({ userId: user._id }).sort({ order: 1, createdAt: 1 });
        return { EC: 0, EM: "Order updated", data: tasks };
    } catch (error) {
        return { EC: 1, EM: error.message, data: null };
    }
};

module.exports = {
    createTaskService,
    getAllTasksService,
    updateTaskService,
    deleteTaskService,
    reorderTasksService
}
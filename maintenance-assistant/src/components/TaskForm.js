import React, { useState } from 'react';

const TaskForm = ({ onSubmit, initialData }) => {
    const [taskName, setTaskName] = useState(initialData ? initialData.taskName : '');
    const [description, setDescription] = useState(initialData ? initialData.description : '');
    const [dueDate, setDueDate] = useState(initialData ? initialData.dueDate : '');
    const [priority, setPriority] = useState(initialData ? initialData.priority : 'normal');

    const handleSubmit = (e) => {
        e.preventDefault();
        const taskData = {
            taskName,
            description,
            dueDate,
            priority,
        };
        onSubmit(taskData);
        resetForm();
    };

    const resetForm = () => {
        setTaskName('');
        setDescription('');
        setDueDate('');
        setPriority('normal');
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <div>
                <label htmlFor="taskName">Task Name</label>
                <input
                    type="text"
                    id="taskName"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="dueDate">Due Date</label>
                <input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="priority">Priority</label>
                <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                </select>
            </div>
            <button type="submit">Save Task</button>
        </form>
    );
};

export default TaskForm;
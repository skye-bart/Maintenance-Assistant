import React, { useState } from 'react';

const TaskForm = ({ onSubmit = () => {}, initialData = null }) => {
    const [taskName, setTaskName] = useState(initialData ? initialData.taskName : '');
    const [description, setDescription] = useState(initialData ? initialData.description : '');
    const [dueDate, setDueDate] = useState(initialData ? initialData.dueDate : '');
    const [priority, setPriority] = useState(initialData ? initialData.priority : 'normal');

    const resetForm = () => {
        setTaskName('');
        setDescription('');
        setDueDate('');
        setPriority('normal');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const taskData = {
            taskName,
            description,
            dueDate,
            priority
        };

        onSubmit(taskData);
        resetForm();
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <div className="field-group">
                <label htmlFor="taskName">Task Name</label>
                <input
                    type="text"
                    id="taskName"
                    value={taskName}
                    onChange={(event) => setTaskName(event.target.value)}
                    required
                />
            </div>

            <div className="field-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />
            </div>

            <div className="field-row">
                <div className="field-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                        type="date"
                        id="dueDate"
                        value={dueDate}
                        onChange={(event) => setDueDate(event.target.value)}
                    />
                </div>

                <div className="field-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(event) => setPriority(event.target.value)}
                    >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            <button type="submit" className="primary-button small">Save Task</button>
        </form>
    );
};

export default TaskForm;

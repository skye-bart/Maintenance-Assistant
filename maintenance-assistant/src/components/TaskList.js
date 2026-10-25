import React, { useEffect, useState } from 'react';
import { getFromLocalStorage } from '../services/localStorageService';

const getTasks = () => getFromLocalStorage('tasks') || [];

const TaskList = () => {
    const [tasks, setTasks] = useState(getTasks);

    useEffect(() => {
        const refreshTasks = () => setTasks(getTasks());

        refreshTasks();
        window.addEventListener('tasks-updated', refreshTasks);

        return () => {
            window.removeEventListener('tasks-updated', refreshTasks);
        };
    }, []);

    return (
        <div className="task-list-wrapper">
            <h3>Ongoing maintenance tasks</h3>
            <ul className="task-list">
                {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                        <li key={task.id || index} className="task-item-card">
                            <div>
                                <h4>{task.title}</h4>
                                <p>{task.description}</p>
                            </div>
                            <div className="task-meta">
                                <span className="task-status">{task.status}</span>
                                <small>{task.priority} priority</small>
                                {task.dueDate ? <small>Due {task.dueDate}</small> : null}
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="empty-state">No tasks available.</li>
                )}
            </ul>
        </div>
    );
};

export default TaskList;

import React, { useEffect, useState } from 'react';
import { getTasks } from '../services/localStorageService';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = () => {
            const storedTasks = getTasks();
            setTasks(storedTasks);
        };

        fetchTasks();
    }, []);

    return (
        <div className="task-list">
            <h2>Ongoing Maintenance Tasks</h2>
            <ul>
                {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                        <li key={index}>
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            <p>Status: {task.status}</p>
                        </li>
                    ))
                ) : (
                    <p>No tasks available.</p>
                )}
            </ul>
        </div>
    );
};

export default TaskList;
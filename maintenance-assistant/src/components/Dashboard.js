import React from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <h1>Maintenance Dashboard</h1>
            <div className="metrics">
                <h2>Key Metrics</h2>
                {/* Add key metrics display here */}
            </div>
            <TaskForm />
            <TaskList />
        </div>
    );
};

export default Dashboard;
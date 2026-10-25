import React, { useMemo, useState } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { getFromLocalStorage, saveToLocalStorage } from '../services/localStorageService';

const initialMessages = [
    {
        id: 1,
        sender: 'assistant',
        text: 'Hi! I am your maintenance AI assistant. I can help prioritize work orders, flag downtime risks, and suggest the next action on the floor.'
    }
];

const quickPrompts = [
    'Check machine uptime',
    'Prioritize urgent work orders',
    'Suggest missing parts',
    'Review maintenance schedule'
];

const buildAssistantReply = (prompt) => {
    const value = prompt.toLowerCase();

    if (value.includes('downtime') || value.includes('machine') || value.includes('uptime')) {
        return 'I recommend checking the most recent downtime events first. Prioritize machines with repeated failure codes and validate whether the issue is tied to lubrication, heat, or wear before assigning the next maintenance crew.';
    }

    if (value.includes('urgent') || value.includes('priority') || value.includes('critical')) {
        return 'Urgent work should be sequenced by safety risk and production impact. I suggest escalating any issue that blocks output, risks injury, or affects a bottleneck machine before scheduling routine tasks.';
    }

    if (value.includes('parts') || value.includes('inventory') || value.includes('stock')) {
        return 'Check the on-hand inventory for seals, filters, and conveyor components first. If a critical spare is below the minimum threshold, create a replenishment request and flag the affected asset to maintenance supervision.';
    }

    if (value.includes('schedule') || value.includes('planner') || value.includes('next')) {
        return 'I would schedule preventive checks around the highest-risk equipment and align them with the production calendar. Keep the next planned maintenance window on the bottleneck line and defer low-impact tasks until after the peak run.';
    }

    return 'I can help with machine uptime, work order priority, parts planning, and daily maintenance scheduling. Tell me what issue or machine needs attention and I will suggest the next best step.';
};

const Dashboard = () => {
    const [messages, setMessages] = useState(initialMessages);
    const [inputValue, setInputValue] = useState('');

    const metrics = useMemo(() => [
        { label: 'Open work orders', value: '18' },
        { label: 'Critical alerts', value: '3' },
        { label: 'Uptime', value: '94.6%' },
        { label: 'Parts needed', value: '7' }
    ], []);

    const handleTaskSave = (taskData) => {
        const currentTasks = getFromLocalStorage('tasks') || [];
        const newTask = {
            id: Date.now(),
            title: taskData.taskName,
            description: taskData.description,
            dueDate: taskData.dueDate,
            priority: taskData.priority,
            status: 'Open'
        };

        saveToLocalStorage('tasks', [newTask, ...currentTasks]);
        window.dispatchEvent(new Event('tasks-updated'));
    };

    const handleSend = (event) => {
        event.preventDefault();

        const trimmed = inputValue.trim();
        if (!trimmed) {
            return;
        }

        const userMessage = {
            id: Date.now(),
            sender: 'user',
            text: trimmed
        };

        const assistantMessage = {
            id: Date.now() + 1,
            sender: 'assistant',
            text: buildAssistantReply(trimmed)
        };

        setMessages((current) => [...current, userMessage, assistantMessage]);
        setInputValue('');
    };

    return (
        <div className="dashboard-shell">
            <aside className="sidebar-panel">
                <div className="brand-block">
                    <div className="brand-icon">AI</div>
                    <div>
                        <p className="eyebrow">Factory Ops</p>
                        <h2>Maintenance AI</h2>
                    </div>
                </div>

                <nav className="nav-list">
                    <button className="nav-button active">Overview</button>
                    <button className="nav-button">Work orders</button>
                    <button className="nav-button">Equipment</button>
                    <button className="nav-button">Parts</button>
                    <button className="nav-button">Reports</button>
                </nav>

                <div className="sidebar-card">
                    <p className="card-title">Live status</p>
                    <div className="status-row">
                        <span className="status-dot online" />
                        <span>Assembly line stable</span>
                    </div>
                    <div className="status-row">
                        <span className="status-dot warn" />
                        <span>Hydraulic press check due</span>
                    </div>
                </div>
            </aside>

            <main className="main-panel">
                <header className="topbar">
                    <div>
                        <p className="eyebrow">Operations dashboard</p>
                        <h1>Maintenance Assistant</h1>
                    </div>
                    <button className="primary-button">+ New ticket</button>
                </header>

                <section className="hero-panel">
                    <div>
                        <p className="eyebrow accent">AI recommendation</p>
                        <h2>Schedule the hydraulic press inspection before the next shift change.</h2>
                    </div>
                    <div className="hero-score">
                        <strong>91%</strong>
                        <span>task confidence</span>
                    </div>
                </section>

                <section className="metrics-grid">
                    {metrics.map((metric) => (
                        <div className="metric-card" key={metric.label}>
                            <span>{metric.label}</span>
                            <strong>{metric.value}</strong>
                        </div>
                    ))}
                </section>

                <section className="workspace-grid">
                    <div className="panel chat-panel">
                        <div className="panel-header">
                            <h3>AI support</h3>
                            <span className="online-pill">Online</span>
                        </div>

                        <div className="chat-log">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`chat-bubble ${message.sender === 'user' ? 'user' : 'assistant'}`}
                                >
                                    {message.text}
                                </div>
                            ))}
                        </div>

                        <div className="prompt-row">
                            {quickPrompts.map((prompt) => (
                                <button
                                    key={prompt}
                                    className="quick-prompt"
                                    onClick={() => setInputValue(prompt)}
                                    type="button"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>

                        <form className="composer" onSubmit={handleSend}>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(event) => setInputValue(event.target.value)}
                                placeholder="Ask the assistant about downtime, parts, or priorities..."
                            />
                            <button type="submit" className="primary-button">Send</button>
                        </form>
                    </div>

                    <div className="panel">
                        <div className="panel-header">
                            <h3>Maintenance board</h3>
                            <span className="muted-pill">Today</span>
                        </div>

                        <TaskForm onSubmit={handleTaskSave} />
                        <TaskList />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;

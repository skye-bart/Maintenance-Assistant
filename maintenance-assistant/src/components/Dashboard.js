import React, { useEffect, useMemo, useState } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import ShiftHandoverPanel from './ShiftHandoverPanel';
import DowntimePanel from './DowntimePanel';
import PMSchedulerPanel from './PMSchedulerPanel';
import { getFromLocalStorage, saveToLocalStorage } from '../services/localStorageService';
import { getDashboardData } from '../services/apiService';

const initialMessages = [
  {
    id: 1,
    sender: 'assistant',
    text: 'Good morning. I am your maintenance AI co-pilot. I can help triage downtime, prioritize work orders, and keep the line moving.'
  }
];

const quickPrompts = [
  'Check machine uptime',
  'Prioritize urgent work',
  'Review parts inventory',
  'Plan next shift tasks'
];

const fallbackQueue = [
  { title: 'Hydraulic press', owner: 'Team A', priority: 'Critical', eta: '08:45' },
  { title: 'Conveyor line 2', owner: 'Team B', priority: 'High', eta: '10:15' },
  { title: 'Boiler feed pump', owner: 'Team C', priority: 'Medium', eta: '14:00' }
];

const fallbackAlerts = [
  'Bearing temperature above threshold on Line 3',
  'Filter replacement due within 2 shifts',
  'Safety inspection delayed in compressor room'
];

const buildAssistantReply = (prompt) => {
  const value = prompt.toLowerCase();

  if (value.includes('uptime') || value.includes('machine') || value.includes('downtime')) {
    return 'I would review the top downtime events first and rank them by production impact. Focus on repeat failures, bottleneck equipment, and any issue linked to safety or line stoppage.';
  }

  if (value.includes('urgent') || value.includes('priority') || value.includes('critical')) {
    return 'Escalate safety-critical and bottleneck-driven work before routine tasks. Assign the highest-priority repair to the crew with the shortest response time and best spares coverage.';
  }

  if (value.includes('parts') || value.includes('inventory') || value.includes('stock')) {
    return 'Check spare seal kits, filters, and conveyor components first. If any critical part is below threshold, raise a replenish request before the next planned shutdown window.';
  }

  if (value.includes('schedule') || value.includes('shift') || value.includes('next')) {
    return 'Schedule the highest-risk inspections during the first window of the next shift. Keep routine tasks aligned with production demand and leave room for unplanned safety calls.';
  }

  return 'I can help with downtime triage, work-order prioritization, PM planning, and parts readiness. Tell me the machine, shift, or issue and I will suggest the next best action.';
};

const Dashboard = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Unable to load dashboard data from API:', error);
      }
    };

    loadDashboard();
  }, []);

  const metrics = useMemo(() => {
    const overview = dashboardData?.overview || {};

    return [
      { label: 'Open work orders', value: String(overview.open_work_orders ?? 18), detail: '+4 this week' },
      { label: 'Critical alerts', value: String(overview.critical_alerts ?? 3), detail: 'Live from API' },
      { label: 'Uptime', value: '94.6%', detail: '+1.4% vs last week' },
      { label: 'Parts needed', value: String(dashboardData?.alerts?.length ?? 7), detail: '3 urgent' }
    ];
  }, [dashboardData]);

  const queue = useMemo(() => {
    const workOrders = dashboardData?.work_orders || [];

    if (workOrders.length === 0) {
      return fallbackQueue;
    }

    return workOrders.slice(0, 3).map((item) => ({
      title: item.equipment_name || item.title || 'Work order',
      owner: item.assignee || 'Team',
      priority: item.priority || 'Medium',
      eta: item.due_date ? new Date(item.due_date).toLocaleDateString() : 'TBD'
    }));
  }, [dashboardData]);

  const alerts = useMemo(() => {
    const apiAlerts = dashboardData?.alerts || [];

    if (apiAlerts.length === 0) {
      return fallbackAlerts;
    }

    return apiAlerts.slice(0, 3).map((alert) => alert.message || alert);
  }, [dashboardData]);

  const getModuleContent = () => {
    switch (activeTab) {
      case 'handover':
        return <ShiftHandoverPanel />;
      case 'downtime':
        return <DowntimePanel />;
      case 'pm':
        return <PMSchedulerPanel />;
      default:
        return (
          <>
            <section className="info-grid">
              <div className="panel">
                <div className="panel-header">
                  <h3>Priority queue</h3>
                  <span className="muted-pill">Live</span>
                </div>

                <div className="queue-list">
                  {queue.map((item) => (
                    <div key={`${item.title}-${item.owner}`} className="queue-item">
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.owner}</span>
                      </div>
                      <div className="queue-meta">
                        <span className={`priority-badge ${item.priority.toLowerCase()}`}>{item.priority}</span>
                        <small>{item.eta}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <h3>Recent alerts</h3>
                  <span className="muted-pill">Updated</span>
                </div>

                <ul className="alerts-list">
                  {alerts.map((alert) => (
                    <li key={alert}>{alert}</li>
                  ))}
                </ul>
              </div>
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
                    placeholder="Ask the AI about equipment, parts, or work order priority..."
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
          </>
        );
    }
  };

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
    if (!trimmed) return;

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
          <div className="brand-icon">N</div>
          <div>
            <p className="eyebrow">Factory Ops</p>
            <h2>Nexus Dashboard</h2>
          </div>
        </div>

        <nav className="nav-list">
          <button className={`nav-button ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')} type="button">Overview</button>
          <button className={`nav-button ${activeTab === 'handover' ? 'active' : ''}`} onClick={() => setActiveTab('handover')} type="button">Shift Handover</button>
          <button className={`nav-button ${activeTab === 'downtime' ? 'active' : ''}`} onClick={() => setActiveTab('downtime')} type="button">Downtime</button>
          <button className={`nav-button ${activeTab === 'pm' ? 'active' : ''}`} onClick={() => setActiveTab('pm')} type="button">PM Tasks</button>
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
            <span>Hydraulic press due inspection</span>
          </div>
          <div className="status-row">
            <span className="status-dot danger" />
            <span>Compressor room alert</span>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Operations command center</p>
            <h1>Maintenance AI Hub</h1>
          </div>
          <button className="primary-button">+ Create work order</button>
        </header>

        <section className="hero-panel">
          <div>
            <p className="eyebrow accent">AI recommendation</p>
            <h2>Schedule the hydraulic press inspection before the next shift change.</h2>
          </div>
          <div className="hero-score">
            <strong>91%</strong>
            <span>risk confidence</span>
          </div>
        </section>

        <section className="metrics-grid">
          {metrics.map((metric) => (
            <div className="metric-card" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.detail}</small>
            </div>
          ))}
        </section>

        {getModuleContent()}
      </main>
    </div>
  );
};

export default Dashboard;

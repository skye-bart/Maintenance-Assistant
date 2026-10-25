import React from 'react';

const DowntimePanel = () => {
  const downtime = [
    { reason: 'Mechanical jam', minutes: 42, count: 6 },
    { reason: 'Sensor fault', minutes: 28, count: 4 },
    { reason: 'Power fluctuation', minutes: 19, count: 3 },
    { reason: 'Operator delay', minutes: 15, count: 2 }
  ];

  return (
    <div className="panel module-panel">
      <div className="panel-header">
        <h3>Downtime analyzer</h3>
        <span className="muted-pill">Pareto view</span>
      </div>

      <div className="downtime-grid">
        {downtime.map((item) => (
          <div className="module-card" key={item.reason}>
            <div className="module-card-header">
              <strong>{item.reason}</strong>
              <span>{item.minutes} min</span>
            </div>
            <div className="bar-wrapper">
              <div className="bar" style={{ width: `${Math.min(item.minutes * 2, 100)}%` }} />
            </div>
            <small>{item.count} incidents this week</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DowntimePanel;

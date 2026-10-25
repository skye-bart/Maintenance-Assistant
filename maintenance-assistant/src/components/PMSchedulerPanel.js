import React from 'react';

const PMData = [
  { asset: 'Hydraulic press', task: 'Inspect seals and line pressure', due: 'Today', status: 'Due now' },
  { asset: 'Air compressor', task: 'Change inlet filters', due: 'Tomorrow', status: 'Scheduled' },
  { asset: 'Conveyor line 2', task: 'Lubricate bearings and verify tension', due: 'Thu', status: 'Planned' },
  { asset: 'Boiler feed pump', task: 'Check vibration baseline', due: 'Fri', status: 'Upcoming' }
];

const PMSchedulerPanel = () => (
  <div className="panel module-panel">
    <div className="panel-header">
      <h3>Preventive maintenance scheduler</h3>
      <span className="muted-pill">Calendar view</span>
    </div>

    <div className="module-list">
      {PMData.map((item) => (
        <div className="module-card" key={item.asset}>
          <div className="module-card-header">
            <strong>{item.asset}</strong>
            <span className="pm-status">{item.status}</span>
          </div>
          <p>{item.task}</p>
          <small>Due: {item.due}</small>
        </div>
      ))}
    </div>
  </div>
);

export default PMSchedulerPanel;

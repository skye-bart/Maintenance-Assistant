import React from 'react';

const ShiftHandoverPanel = () => {
  const handovers = [
    { shift: 'Night', owner: 'A. Morris', update: 'Conveyor drive belt replaced on Line 2; inspection completed.' },
    { shift: 'Day', owner: 'T. Brooks', update: 'Valve pressure check passed; no safety issues noted.' },
    { shift: 'Swing', owner: 'M. Reed', update: 'Boiler feed pump vibration higher than target; monitor through next cycle.' }
  ];

  return (
    <div className="panel module-panel">
      <div className="panel-header">
        <h3>Shift handover log</h3>
        <span className="muted-pill">Updated</span>
      </div>

      <div className="module-list">
        {handovers.map((handover) => (
          <div className="module-card" key={handover.shift}>
            <div className="module-card-header">
              <strong>{handover.shift} shift</strong>
              <span>{handover.owner}</span>
            </div>
            <p>{handover.update}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShiftHandoverPanel;

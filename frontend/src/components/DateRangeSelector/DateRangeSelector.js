import React from 'react';
import './DateRangeSelector.css';

function DateRangeSelector({ setStartDate, setEndDate }) {
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  return (
    <div className="label-container">
      <label className="start-date-label">
        Start Date:
        <input type="date" className="date-input" onChange={handleStartDateChange} />
      </label>
      <label className="end-date-label">
        End Date:
        <input type="date" className="date-input" onChange={handleEndDateChange} />
      </label>
    </div>
  );
}

export default DateRangeSelector;

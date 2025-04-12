import React from 'react';

function DateRangeSelector({ setStartDate, setEndDate }) {
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  return (
    <div>
      <label>
        Start Date:
        <input type="date" onChange={handleStartDateChange} />
      </label>
      <label>
        End Date:
        <input type="date" onChange={handleEndDateChange} />
      </label>
    </div>
  );
}

export default DateRangeSelector;

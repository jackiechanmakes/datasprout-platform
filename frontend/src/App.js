import React, { useState, useEffect } from 'react';
import DateRangeSelector from './DateRangeSelector';
import D3Chart from './D3Chart';

function App() {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (startDate && endDate) {
      fetch(`http://localhost:8080/data?startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error('Error fetching data:', error))
    }
  }, [startDate, endDate]);

  return (
    <div>
      <h1>Sensor Data</h1>
      <DateRangeSelector setStartDate={setStartDate} setEndDate={setEndDate} />
      <D3Chart data={data} />
    </div>
  );
}

export default App;

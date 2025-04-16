import React, { useState, useEffect } from 'react';
import DateRangeSelector from './DateRangeSelector';
import D3Chart from './D3Chart';
import './DarkTheme.css'
import './App.css'

function App() {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (startDate && endDate) {
      fetch(`http://localhost:8080/data?startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          setData(data)
        })
        .catch(error => console.error('Error fetching data:', error))
    }
  }, [startDate, endDate]);

  return (
    <div className="dashboard">
      <h1>Sensor Data</h1>
      <DateRangeSelector setStartDate={setStartDate} setEndDate={setEndDate} />
      {data.length > 0 && (
        <>
        <h2>Temperature</h2>
        <D3Chart key={`temperature-${startDate}-${endDate}`} data={data} type="temperature" />
        <h2>Humidity</h2>
        <D3Chart key={`humidity-${startDate}-${endDate}`} data={data} type="humidity" />
        </>
      )}
      
    </div>
  );
}

export default App;

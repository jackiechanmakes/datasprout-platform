import React, { useState, useEffect } from 'react';
import DateRangeSelector from './DateRangeSelector';
import D3Chart from './D3Chart';
import './DarkTheme.css'
import './App.css'

function App() {
  const [data, setData] = useState([]);
  const [stats_data, setStatsData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (startDate && endDate) {
      fetch(`http://localhost:8080/api/data?startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          setData(data)
        })
        .catch(error => console.error('Error fetching data:', error))
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (startDate && endDate) {
      fetch(`http://localhost:8080/api/stats?startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json())
        .then(stats_data => {
          console.log(stats_data)
          setStatsData(stats_data)
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
        <p>Min: {stats_data.temp_min}&deg;C</p>
        <p>Max: {stats_data.temp_max}&deg;C</p>
        <p>Avg: {stats_data.temp_avg}&deg;C</p>

        <h2>Humidity</h2>
        <D3Chart key={`humidity-${startDate}-${endDate}`} data={data} type="humidity" />
        <p>Min: {stats_data.hum_min}%</p>
        <p>Max: {stats_data.hum_max}%</p>
        <p>Avg: {stats_data.hum_avg}%</p>
        </>
      )}
      
    </div>
  );
}

export default App;

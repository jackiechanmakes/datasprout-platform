const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const db = require('./Database');
const { start } = require('repl');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.get('/api/stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const conn = await db.getConnection();
    const result = await conn.query(`
      SELECT 
      MIN(temperature) AS temp_min,
      MAX(temperature) AS temp_max,
      ROUND(AVG(temperature), 1) AS temp_avg,
      MIN(humidity) AS hum_min,
      MAX(humidity) AS hum_max,
      ROUND(AVG(humidity), 1) AS hum_avg
      FROM sensor_data WHERE timestamp BETWEEN ? AND ?`, [startDate, endDate]);
    conn.release();
    res.json(result[0]);
  } catch (err) {
    console.log('DB error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/data', (req, res) => {
  console.log('Request query parameters:', req.query);
  const { startDate, endDate } = req.query;
  console.log(startDate);
  console.log(endDate);
  const command = `../data-service/fetch_data ${startDate} ${endDate}`;

  exec(command, (error, stdout, stderr) => {
  const output = stdout.split("\n");
  const data = [];
  for (let i = 0; i < output.length - 2; i++) {
    if (output[i].includes("Temperature") && output[i + 1].includes("Humidity") && output[i + 2].includes("Timestamp")) {
      const temperature = parseFloat(output[i].split(":")[1].trim());
      const humidity = parseFloat(output[i+1].split(":")[1].trim());
      const time = output[i+2].substring(11); 

      data.push( {
        temperature, 
        humidity, 
        time
      });
  
      i += 2;
    } 
  }

  res.json(data); 
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

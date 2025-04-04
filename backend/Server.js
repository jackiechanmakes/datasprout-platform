const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// API endpoint to fetch data
// app.get('/data', (req, res) => {
//   const { startDate, endDate } = req.query;

//   // Pass startDate and endDate to the C program
//   const command = `.data/fetch_data ${startDate} ${endDate}`;

//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`exec error: ${error}`);
//       return res.status(500).send('Error executing C program');
//     }

//     if (stderr) {
//       console.error(`stderr: ${stderr}`);
//       return res.status(500).send('Error in C program');
//     }

//     // Parse the output from C program and send it as JSON
//     const data = JSON.parse(stdout);
//     res.json(data);
//   });
// });

// app.get('/data', (req, res) => {
//   res.json({ message: 'Data is here' });
// });

app.get('/data', (req, res) => {
  console.log('Request query parameters:', req.query);
  const { startDate, endDate } = req.query;
  const command = `../data-service/fetch_data ${startDate} ${endDate}`;

  exec(command, (error, stdout, stderr) => {
  const output = stdout.split("\n");
  const data = [];
  for (let i = 0; i < output.length - 2; i++) {
    if (output[i].includes("Temperature") && output[i + 1].includes("Humidity") && output[i + 2].includes("Timestamp")) {
      const temperature = parseFloat(output[i].split(":")[1].trim());
      const humidity = parseFloat(output[i+1].split(":")[1].trim());
      const timestamp = output[i+2].split(":")[1].trim();

      data.push( {
        temperature, 
        humidity, 
        timestamp
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

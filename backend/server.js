const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 8080;

app.use(express.json());

// API endpoint to fetch data
app.get('/data', (req, res) => {
  const { startDate, endDate } = req.query;

  // Pass startDate and endDate to the C program
  const command = `.data/fetch_data ${startDate} ${endDate}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Error executing C program');
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send('Error in C program');
    }

    // Parse the output from C program and send it as JSON
    const data = JSON.parse(stdout);
    res.json(data);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

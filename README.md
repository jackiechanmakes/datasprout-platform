# DataSprout Platform - IoT Environmental Monitoring System with Web Dashboard

**DataSprout** is a full-stack, end-to-end IoT sensor monitoring solution that collects, processes, and visualizes real-time environmental data. Originally built for smart garden use, it's adaptable to a wide range of telemetry applications from greenhouse automation to general-purpose sensor networks. This platform implements a modular system design across embedded hardware, backend services, frontend visualization, and deployment automation built to grow with the addition of new sensors, devices, and frontend enhancements. At its core, DataSprout integrates a **Raspberry Pi 5** with a **DHT11 temperature/humidity sensor** and a **16x2 I2C LCD panel** for local display. A web-based dashboard powered by modern JavaScript frameworks presents the data in real-time while a custom backend handles data flow and persistence. **Shell scripts** are included to automate environment setup, app lifecycle management, and data collection.

### Features

1. **Real-Time Data Collection**
Polls temperature and humidity data from a DHT11 sensor using GPIO via C programming language.
2. **LCD Display Output**
Displays current readings on a 16x2 I2C LCD panel for on-device monitoring.
3. **Interactive Web Dashboard**
React + D3.js frontend with dynamic visualizations of live and historical data.
4. **RESTful API**
Node.js and Express.js backend serves sensor data through structured API endpoints.
5. **Automation Scripts**
Bash scripts manage starting/stopping the server and data collection as services.
6. **Lightweight & Modular**
Clean separation of backend, frontend, and device logic for maintainability and scalability.

### Tech Stack

* **Backend**: **Node.js** with **Express.js** for API management and data handling.
* **Database**: **MariaDB** for structured storage of sensor data.
* **Frontend**: **React.js** for dynamic, real-time data display with **D3.js** for interactive visualizations.
* **Data Communication**: RESTful APIs for device-to-server communication and data transmission.
* **Hardware**: **Raspberry Pi 5** as the central hub; **DHT11** sensor for environmental data; **16x2 I2C LCD** for local display feedback.
* **Automation and DevOps**: **Bash scripts** for automated service management (starting/stopping data collection, backend, and frontend with logs) and system-level orchestration.
* **Deployment**: Docker-compatible for easy deployment and scalability.

### Use Cases

* **Smart Garden Monitoring**: Track environmental conditions (temperature, humidity) in real-time for plant health in a controlled environment.
* **Server Room or Equipment Monitoring**: Monitor environmental conditions in server rooms, labs, or industrial enclosures where temperature/humidity control is critical.
* **General Purpose IoT Sensor Networks**: Serve as a proof of concept for larger sensor networks or smart city components such as air quality monitoring or climate data aggregration.
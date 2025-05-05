# 🌱 Data Service - DataSprout

This is the data service layer for the **DataSprout** IoT environmental monitoring system. It's responsible for reading sensor data, writing it to a database, and retrieving that data on request.

### 🌟 Features
* **Sensor data collection** from a Raspberry Pi and DHT11 sensor via GPIO using C. 
* **Local display output** of temperature, humidity, and time on a 16x2 I2C LCD.
* **Data persistence** by inserting readings into a MariaDB database every 30 minutes.
* **Data Retrieval** by fetching historical data from MariaDB within a given data range.

### 🗄️ General Folder Structure
```
data-service/
├── collect_data.c            # Reads sensor data, displays it, and writes to the database
├── fetch_data.c              # Fetches data from the database by date range
```

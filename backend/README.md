# 🌱 Backend - DataSprout

This is the backend for the **DataSprout** IoT environmental monitoring system which collects, stores, and serves temperature and humidity data from sensors. It is built using **Node.js** and **Express.js** with data stored in a **MariaDB** database. The backend exposes **RESTful APIs** for fetching real-time and historical data. 

### 🗄️ General Folder Structure
```
backend/
├── database.js                    # Database connection
├── server.js                      # Main express server
├── package.json                   # NPM dependencies and scripts
├── node_modules/                  # NPM packages
```
### 📝 API Endpoints

```/api/data```
Fetches raw sensor data (temperature, humidity, and timestamp) for a given date range.

**Query Parameters**:
* ```startDate``` (required): The start date in ```YYYY-MM-DD``` format.
* ```endDate``` (required): The end date in ```YYYY-MM-DD``` format. 

**Example Request:**
```GET http://localhost:8080/api/data?startDate=2025-04-28&endDate=2025-04-30```

**Example Response:**
```
[
  {
    "temperature": 21.9,
    "humidity": 55,
    "time": "2025-04-28 00:34:55"
  },
  {
    "temperature": 22.8,
    "humidity": 50.1,
    "time": "2025-04-29 01:04:55"
  }
]
```

```/api/data```
Fetches statistical data (minimum, maximum, and average) for temperature and humidity within a given date range.

**Query Parameters**:
* ```startDate``` (required): The start date in ```YYYY-MM-DD``` format.
* ```endDate``` (required): The end date in ```YYYY-MM-DD``` format. 

**Example Request:**
```GET http://localhost:8080/api/stats?startDate=2025-04-28&endDate=2025-04-30```

**Example Response:**
```
{
  "temp_min": 19.4,
  "temp_max": 24.3,
  "temp_avg": 21.2,
  "hum_min": 46,
  "hum_max": 62,
  "hum_avg": 55.1
}
```



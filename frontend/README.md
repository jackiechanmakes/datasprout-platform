# 🌱 Frontend - DataSprout

This is the frontend for the **DataSprout** IoT environmental monitoring system built with **React** and **D3.js** for dynamic, real-time data visualization and interactive charts. This app communicates with the backend through RESTful API endpoints to display sensor data on an interactive web dashboard.

### 🌟 Features
* **Real-time data visualizaiton** using D3.js.
* **Interactive charts** with support for dynamic updates.
* **Date range selection** with date picker UI to filter data for custom visualizations.
* **Dark theme** for a modern user interface.

### 🗄️ General Folder Structure
```
frontend/
├── public/                                 # Static files
│	 └── index.html
│	 └── favicon.ico
├── src/                                    # Source code
│    ├── components/                        # React components
│    │   ├── D3Chart/                       # D3.js chart component
|    │   │   └── D3Chart.js
|    │   │   └── D3Chart.css
│    │   ├── DateRangeSelector/             # Date range picker component
|    │   │   └── DateRangeSelector.js
│    │   │   └── DateRangeSelector.css
│    ├── themes/                            # Theme styles
│    │   └── DarkTheme.css
│    ├── App.js                             # Main app component
│    ├── App.css                            # App-wide styles
│    ├── index.js                           # React entry point
│    ├── index.css                          # Global styles
```
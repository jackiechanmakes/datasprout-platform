// src/PlotlyChart.js
import React from 'react';
import Plot from 'react-plotly.js';

const PlotlyChart = ({ chartData }) => {
  if (!chartData || chartData.length === 0) {
    return <div>Loading chart...</div>;
  }

  return (
    <Plot
      data={chartData}
      layout={{ width: 700, height: 500, title: 'Sensor Data Plot' }}
    />
  );
};

export default PlotlyChart;

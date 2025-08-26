import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart3 = ({ data }) => {
  const chartData = {
    labels: ['Court Case', 'Defaulter', 'Clean'],
    datasets: [
      {
        data: [data.courtCase, data.defaulter, data.clean],
        backgroundColor: ['#f87171', '#fbbf24', '#60a5fa'],
        hoverBackgroundColor: ['#ef4444', '#f59e42', '#3b82f6'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw || 0;
            const label = tooltipItem.label || '';
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '225px', height: '225px' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart3;

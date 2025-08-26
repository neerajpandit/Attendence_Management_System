import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ rentedUnits, vacantUnits }) => {
  const data = {
    labels: ['Rented Units', 'Vacant Units'],
    datasets: [
      {
        data: [rentedUnits, vacantUnits],
        backgroundColor: ['#60a5fa', '#fb7185'], // Blue and Red
        hoverBackgroundColor: ['#3b82f6', '#f43f5e'], // Darker shades for hover
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
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;

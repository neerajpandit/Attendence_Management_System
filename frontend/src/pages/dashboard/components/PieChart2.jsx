import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart2 = ({ paidBill, pendingBill }) => {
  const data = {
    labels: ['Collected Amount', 'Pending Amount'],
    datasets: [
      {
        data: [paidBill, pendingBill],
        backgroundColor: ['#4ade80', '#fb923c'],
        hoverBackgroundColor: ['#22c55e', '#f97316'],
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

export default PieChart2;

import React from 'react';
import { Bar } from 'react-chartjs-2';

const ProfileChart = ({ wordsCognates, wordsNonCognates }) => {
  const baselines = {
    TOP100_C: 12,
    TOP100_NC: 88,
    TOP500_C: 200,
    TOP500_NC: 300,
    TOP1000_C: 518,
    TOP1000_NC: 482,
    TOP5000_C: 3176,
    TOP5000_NC: 1824,
  };

  const percentages = {
    top100: [
      (wordsCognates.top100/baselines.TOP100_C*100).toFixed(2),
      (wordsNonCognates.top100/baselines.TOP100_NC*100).toFixed(2),
    ],
    top500: [
      (wordsCognates.top500/baselines.TOP500_C*100).toFixed(2),
      (wordsNonCognates.top500/baselines.TOP500_NC*100).toFixed(2),
    ],
    top1000: [
      (wordsCognates.top1000/baselines.TOP1000_C*100).toFixed(2),
      (wordsNonCognates.top1000/baselines.TOP1000_NC*100).toFixed(2),
    ],
    top5000: [
      (wordsCognates.top5000/baselines.TOP5000_C*100).toFixed(2),
      (wordsNonCognates.top5000/baselines.TOP5000_NC*100).toFixed(2),
    ],
  };

  const chartData = {
    labels: ['Top 100', 'Top 500', 'Top 1000', 'Top 5000'],
    datasets: [
      {
        label: 'Cognates',
        backgroundColor: '#45A29E',
        data: [
          percentages.top100[0],
          percentages.top500[0],
          percentages.top1000[0],
          percentages.top5000[0]
        ]
      },
      {
        label: 'Non-Cognates',
        backgroundColor: '#0B0C10',
        data: [
          percentages.top100[1],
          percentages.top500[1],
          percentages.top1000[1],
          percentages.top5000[1]
        ]
      }
    ],
  };

  const chartProps = {
    color: '#C5C6C7',
    family: 'Raleway',
    size: 14
  };

  const chartOptions = { 
    maintainAspectRatio: false,
    responsive: false,
    legend: {
      labels: {
        fontColor: chartProps.color,
        fontFamily: chartProps.family,
        fontSize: chartProps.size
      }
    },
    scales: {
      xAxes: [
        {
          ticks: {
            fontColor: chartProps.color,
            fontFamily: chartProps.family,
            fontSize: chartProps.size
          },
          gridLines: {
            color: chartProps.color
          }
        }
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Familiarity (%)',
            fontColor: chartProps.color,
            fontFamily: chartProps.family,
            fontSize: chartProps.size
          },
          ticks: {
            min: 0,
            max: 100,
            stepSize: 25,
            fontColor: chartProps.color,
            fontFamily: chartProps.family,
            fontSize: chartProps.size
          },
          gridLines: {
            color: chartProps.color
          }
        },
      ],
    },
  };

  return (
    <div className="profile-card view-chart">
        <h2>Familiarity by Percentages</h2>
        <Bar
            data={chartData}
            width={300}
            height={250}
            options={chartOptions}
        />
    </div>
  );
}

export default ProfileChart;

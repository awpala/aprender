import React from 'react';
import { Bar } from 'react-chartjs-2';

const ProfileChart = ({ words, wordsCognates, wordsNonCognates }) => {
    const calculateBaseline = (threshold, areCognates) => {
        return (areCognates)
        ? words.filter(word => word.frequency_id <= threshold && word.is_cognate).length
        : words.filter(word => word.frequency_id <= threshold && !word.is_cognate).length;
    }
    
    const baselines = {
        top100: [
            calculateBaseline(100, true),
            calculateBaseline(100, false)
        ],
        top500: [
            calculateBaseline(500, true),
            calculateBaseline(500, false)
        ],
        top1000: [
            calculateBaseline(1000, true),
            calculateBaseline(1000, false)
        ],
        top5000: [
            calculateBaseline(5000, true),
            calculateBaseline(5000, false)
        ],
    }

    const percentages = {
        top100: [
            (wordsCognates.top100/baselines.top100[0]*100).toFixed(2),
            (wordsNonCognates.top100/baselines.top100[1]*100).toFixed(2)
        ],
        top500: [
            (wordsCognates.top500/baselines.top500[0]*100).toFixed(2),
            (wordsNonCognates.top500/baselines.top500[1]*100).toFixed(2)
        ],
        top1000: [
            (wordsCognates.top1000/baselines.top1000[0]*100).toFixed(2),
            (wordsNonCognates.top1000/baselines.top1000[1]*100).toFixed(2)
        ],
        top5000: [
            (wordsCognates.top5000/baselines.top5000[0]*100).toFixed(2),
            (wordsNonCognates.top5000/baselines.top5000[1]*100).toFixed(2)
        ],
    }

    const chartData = {
        labels: ['Top 100', 'Top 500', 'Top 1000', 'Top 5000'],
        datasets: [
            {
                label: 'Cognates',
                backgroundColor: 'red',
                data: [
                    percentages.top100[0],
                    percentages.top500[0],
                    percentages.top1000[0],
                    percentages.top5000[0]
                ]
            },
            {
                label: 'Non-Cognates',
                backgroundColor: 'blue',
                data: [
                    percentages.top100[1],
                    percentages.top500[1],
                    percentages.top1000[1],
                    percentages.top5000[1]
                ]
            }
        ]
    }

    const chartOptions = { 
        maintainAspectRatio: false,
        responsive: false,
        scales: {
            yAxes: [
                {
                    scaleLabel: {
                        display: true,
                        labelString: 'Familiarity (%)'
                    },
                    ticks: {
                        min: 0,
                        max: 100
                    }
                }
            ]
        } 
    }

    return(
        <div className="profile-chart">
            <h2>Familiarity by Percentages</h2>
            <Bar
                data={chartData}
                width={400}
                height={250}
                options={chartOptions}
            />
        </div>
    )
}

export default ProfileChart;
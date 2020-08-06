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
        ]
    }

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
                }
            ]
        }
    }

    return(
        <div className="profile-card">
            <h1>Familiarity by Percentages</h1>
            <Bar
                data={chartData}
                width={300}
                height={250}
                options={chartOptions}
            />
        </div>
    )
}

export default ProfileChart;
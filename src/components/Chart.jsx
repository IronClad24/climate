import { CategoryScale, Chart as ChartJS, Legend, LineController, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';

import { Line } from 'react-chartjs-2';
import React from 'react';
import { motion } from 'framer-motion';

// Register ChartJS components
ChartJS.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const Chart = () => {
    // Sample data for CO2 levels (ppm) and Ocean levels (mm)
    const co2Data = {
        labels: ['2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024'],
        datasets: [{
            label: 'CO2 Levels (ppm)',
            data: [389.9, 393.8, 397.7, 404.2, 408.5, 412.5, 416.7, 420.9],
            borderColor: '#FF6B6B',
            backgroundColor: 'rgba(255, 107, 107, 0.2)',
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: false,
        }]
    };

    const oceanData = {
        labels: ['2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024'],
        datasets: [{
            label: 'Ocean Level Rise (mm)',
            data: [60, 65, 70, 76, 82, 88, 94, 100],
            borderColor: '#4ECDC4',
            backgroundColor: 'rgba(78, 205, 196, 0.2)',
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: false,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 2000,
            easing: 'easeInOutQuart',
        },
        scales: {
            x: {
                type: 'category', // Use category scale instead of time for simplicity
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#A9A9A9',
                },
            },
            y: {
                grid: {
                    color: 'rgba(169, 169, 169, 0.1)',
                },
                ticks: {
                    color: '#A9A9A9',
                },
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: '#FFFFFF',
                    font: {
                        size: 14,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#FFFFFF',
                bodyColor: '#FFFFFF',
            },
        },
    };

    // Animation variants for Framer Motion
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                ease: 'easeOut',
                staggerChildren: 0.3,
            },
        },
    };

    const chartVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: 'easeOut',
            },
        },
    };

    return (
        <div className="min-h-screen bg-black text-white py-12">
            <motion.div
                className="container mx-auto px-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Climate Change Insights
                    </h1>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                        Visualize the impact: CO2 levels and rising oceans over time
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
                    {/* CO2 Levels Chart */}
                    <motion.div
                        className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800"
                        variants={chartVariants}
                    >
                        <div className="h-80">
                            <Line data={co2Data} options={chartOptions} />
                        </div>
                    </motion.div>

                    {/* Ocean Levels Chart */}
                    <motion.div
                        className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800"
                        variants={chartVariants}
                    >
                        <div className="h-80">
                            <Line data={oceanData} options={chartOptions} />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Chart;
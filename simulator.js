class PropFirmSimulator {
    constructor() {
        this.chart = null;
        this.heatmapChart = null;
        this.currentMode = 'single';
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('runSimulation').addEventListener('click', () => {
            if (this.currentMode === 'single') {
                this.runSimulation();
            } else {
                this.runHeatmapAnalysis();
            }
        });

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentMode = e.target.dataset.mode;
                this.switchMode(this.currentMode);
            });
        });
    }

    switchMode(mode) {
        const chartContainer = document.querySelector('.chart-container');
        const heatmapContainer = document.querySelector('.heatmap-container');
        const winRateInput = document.getElementById('winRate').closest('.input-group');
        const riskInput = document.getElementById('riskPerTrade').closest('.input-group');
        const statsContainer = document.getElementById('statsContainer');

        if (mode === 'heatmap') {
            chartContainer.style.display = 'none';
            heatmapContainer.style.display = 'block';
            winRateInput.style.opacity = '0.5';
            riskInput.style.opacity = '0.5';
            winRateInput.style.pointerEvents = 'none';
            riskInput.style.pointerEvents = 'none';
            statsContainer.style.display = 'none';
        } else {
            chartContainer.style.display = 'block';
            heatmapContainer.style.display = 'none';
            winRateInput.style.opacity = '1';
            riskInput.style.opacity = '1';
            winRateInput.style.pointerEvents = 'auto';
            riskInput.style.pointerEvents = 'auto';
        }
    }

    getInputValues() {
        return {
            startingBalance: parseFloat(document.getElementById('startingBalance').value),
            winRate: parseFloat(document.getElementById('winRate').value) / 100,
            riskPerTrade: parseFloat(document.getElementById('riskPerTrade').value) / 100,
            rewardRiskRatio: parseFloat(document.getElementById('rewardRiskRatio').value),
            maxDrawdown: parseFloat(document.getElementById('maxDrawdown').value) / 100,
            numSimulations: parseInt(document.getElementById('numSimulations').value),
            enableTilt: document.getElementById('enableTilt').checked,
            tiltMultiplier: parseFloat(document.getElementById('tiltMultiplier').value)
        };
    }

    simulateSingleRun(params) {
        const { startingBalance, winRate, riskPerTrade, rewardRiskRatio, maxDrawdown, enableTilt, tiltMultiplier } = params;
        const numTrades = 100;
        const equityCurve = [startingBalance];
        let currentBalance = startingBalance;
        let failed = false;
        const drawdownThreshold = startingBalance * (1 - maxDrawdown);
        let currentRiskPercent = riskPerTrade;

        for (let trade = 0; trade < numTrades; trade++) {
            const isWin = Math.random() < winRate;
            
            const effectiveRisk = Math.min(currentRiskPercent, 1.0);
            const riskAmount = currentBalance * effectiveRisk;

            if (isWin) {
                currentBalance += riskAmount * rewardRiskRatio;
                if (enableTilt) {
                    currentRiskPercent = riskPerTrade;
                }
            } else {
                currentBalance -= riskAmount;
                if (enableTilt) {
                    currentRiskPercent *= tiltMultiplier;
                }
            }

            equityCurve.push(currentBalance);

            if (currentBalance <= drawdownThreshold) {
                failed = true;
                break;
            }

            if (currentBalance <= 0) {
                currentBalance = 0;
                failed = true;
                break;
            }
        }

        return {
            equityCurve,
            failed,
            finalBalance: currentBalance
        };
    }

    runSimulation() {
        const params = this.getInputValues();
        const results = [];
        let failedCount = 0;
        const finalBalances = [];

        for (let i = 0; i < params.numSimulations; i++) {
            const result = this.simulateSingleRun(params);
            results.push(result);
            
            if (result.failed) {
                failedCount++;
            }
            
            finalBalances.push(result.finalBalance);
        }

        const successRate = ((params.numSimulations - failedCount) / params.numSimulations) * 100;
        const ruinRate = (failedCount / params.numSimulations) * 100;
        const medianBalance = this.calculateMedian(finalBalances);

        this.displayStats({
            survivalRate: successRate.toFixed(1) + '%',
            probabilityOfRuin: ruinRate.toFixed(1) + '%',
            medianBalance: '$' + medianBalance.toLocaleString('en-US', { maximumFractionDigits: 0 }),
            totalSimulations: params.numSimulations
        });

        this.displayCTA(ruinRate);
        this.renderChart(results, params);
    }

    calculateMedian(arr) {
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    displayStats(stats) {
        document.getElementById('survivalRate').textContent = stats.survivalRate;
        document.getElementById('probabilityOfRuin').textContent = stats.probabilityOfRuin;
        document.getElementById('medianBalance').textContent = stats.medianBalance;
        document.getElementById('totalSimulations').textContent = stats.totalSimulations;
        document.getElementById('statsContainer').style.display = 'block';
    }

    displayCTA(ruinRate) {
        const ctaContainer = document.getElementById('ctaContainer');
        
        if (ruinRate > 30) {
            ctaContainer.className = 'cta-container warning';
            ctaContainer.innerHTML = `
                <h3>⚠️ High Risk Detected!</h3>
                <p>Your strategy has a ${ruinRate.toFixed(1)}% chance of hitting max drawdown. Consider improving your risk management.</p>
                <a href="#" class="cta-btn">Learn Risk Management Strategies</a>
            `;
        } else if (ruinRate < 15) {
            ctaContainer.className = 'cta-container success';
            ctaContainer.innerHTML = `
                <h3>✅ Strong Strategy!</h3>
                <p>Your strategy shows a ${(100 - ruinRate).toFixed(1)}% survival rate. You're ready for a prop firm challenge!</p>
                <a href="#" class="cta-btn">Get Funded Now</a>
            `;
        } else {
            ctaContainer.className = 'cta-container';
            ctaContainer.innerHTML = `
                <h3>📊 Moderate Risk</h3>
                <p>Your strategy has room for improvement. Fine-tune your parameters for better results.</p>
                <a href="#" class="cta-btn">Optimize Your Strategy</a>
            `;
        }
    }

    renderChart(results, params) {
        const ctx = document.getElementById('equityChart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }

        const datasets = results.map((result, index) => {
            const color = result.failed ? 'rgba(236, 72, 153, 0.4)' : 'rgba(99, 102, 241, 0.4)';
            const borderColor = result.failed ? 'rgba(236, 72, 153, 0.8)' : 'rgba(99, 102, 241, 0.8)';
            const lineWidth = result.failed && params.enableTilt ? 2 : 1.5;
            
            return {
                label: `Sim ${index + 1}`,
                data: result.equityCurve,
                borderColor: borderColor,
                backgroundColor: color,
                borderWidth: lineWidth,
                pointRadius: 0,
                tension: 0.2,
                fill: false
            };
        });

        const drawdownLine = {
            label: 'Max Drawdown Threshold',
            data: Array(101).fill(params.startingBalance * (1 - params.maxDrawdown)),
            borderColor: 'rgba(239, 68, 68, 0.9)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
            borderDash: [8, 4],
            pointRadius: 0,
            fill: true
        };

        datasets.push(drawdownLine);

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: 101 }, (_, i) => i),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: params.enableTilt ? 'EQUITY CURVES - EMOTIONAL TILT ACTIVE ⚠️' : 'EQUITY CURVES - MONTE CARLO SIMULATION',
                        color: params.enableTilt ? '#ec4899' : '#f8fafc',
                        font: {
                            size: 14,
                            weight: '700',
                            family: 'Space Grotesk'
                        },
                        padding: {
                            bottom: 20
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        titleColor: '#f8fafc',
                        bodyColor: '#cbd5e1',
                        borderColor: 'rgba(99, 102, 241, 0.5)',
                        borderWidth: 1,
                        padding: 12,
                        titleFont: {
                            size: 13,
                            family: 'Space Grotesk',
                            weight: '600'
                        },
                        bodyFont: {
                            size: 12,
                            family: 'JetBrains Mono'
                        },
                        callbacks: {
                            label: function(context) {
                                if (context.dataset.label === 'Max Drawdown Threshold') {
                                    return 'Max Drawdown: $' + context.parsed.y.toLocaleString();
                                }
                                return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'TRADE NUMBER',
                            color: '#94a3b8',
                            font: {
                                size: 11,
                                family: 'Space Grotesk',
                                weight: '700'
                            }
                        },
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                family: 'JetBrains Mono',
                                size: 10
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'ACCOUNT BALANCE ($)',
                            color: '#94a3b8',
                            font: {
                                size: 11,
                                family: 'Space Grotesk',
                                weight: '700'
                            }
                        },
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                family: 'JetBrains Mono',
                                size: 10
                            },
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    async runHeatmapAnalysis() {
        const params = this.getInputValues();
        const winRateRange = { min: 30, max: 70, step: 2 };
        const riskRange = { min: 0.25, max: 3.0, step: 0.15 };
        
        const winRates = [];
        const risks = [];
        
        for (let wr = winRateRange.min; wr <= winRateRange.max; wr += winRateRange.step) {
            winRates.push(wr);
        }
        
        for (let r = riskRange.min; r <= riskRange.max; r += riskRange.step) {
            risks.push(r);
        }

        const heatmapData = [];
        const totalCalculations = winRates.length * risks.length;
        let completed = 0;

        for (let i = 0; i < winRates.length; i++) {
            for (let j = 0; j < risks.length; j++) {
                const testParams = {
                    ...params,
                    winRate: winRates[i] / 100,
                    riskPerTrade: risks[j] / 100,
                    numSimulations: 30
                };

                let failedCount = 0;
                for (let sim = 0; sim < testParams.numSimulations; sim++) {
                    const result = this.simulateSingleRun(testParams);
                    if (result.failed) failedCount++;
                }

                const survivalRate = ((testParams.numSimulations - failedCount) / testParams.numSimulations) * 100;
                
                heatmapData.push({
                    x: winRates[i],
                    y: risks[j],
                    survival: survivalRate
                });

                completed++;
                if (completed % 10 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
            }
        }

        this.renderHeatmap(heatmapData, winRates, risks);
    }

    renderHeatmap(data, winRates, risks) {
        const canvas = document.getElementById('heatmapChart');
        const ctx = canvas.getContext('2d');
        
        if (this.heatmapChart) {
            this.heatmapChart.destroy();
        }

        const datasets = data.map(point => ({
            x: point.x,
            y: point.y,
            v: point.survival
        }));

        this.heatmapChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Survival Rate',
                    data: datasets,
                    backgroundColor: (context) => {
                        const value = context.raw.v;
                        if (value >= 85) return 'rgba(16, 185, 129, 0.8)';
                        if (value >= 70) return 'rgba(132, 204, 22, 0.8)';
                        if (value >= 50) return 'rgba(234, 179, 8, 0.8)';
                        if (value >= 30) return 'rgba(249, 115, 22, 0.8)';
                        return 'rgba(236, 72, 153, 0.8)';
                    },
                    pointRadius: 8,
                    pointHoverRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'GOLDEN ZONE ANALYSIS - RISK OPTIMIZATION HEATMAP',
                        color: '#10b981',
                        font: {
                            size: 14,
                            weight: '700',
                            family: 'Space Grotesk'
                        },
                        padding: {
                            bottom: 20
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        titleColor: '#f8fafc',
                        bodyColor: '#cbd5e1',
                        borderColor: 'rgba(99, 102, 241, 0.5)',
                        borderWidth: 1,
                        padding: 12,
                        titleFont: {
                            size: 13,
                            family: 'Space Grotesk',
                            weight: '600'
                        },
                        bodyFont: {
                            size: 12,
                            family: 'JetBrains Mono'
                        },
                        callbacks: {
                            title: function(context) {
                                return 'Strategy Combination';
                            },
                            label: function(context) {
                                const point = context.raw;
                                return [
                                    `Win Rate: ${point.x}%`,
                                    `Risk/Trade: ${point.y.toFixed(2)}%`,
                                    `Survival: ${point.v.toFixed(1)}%`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'WIN RATE (%)',
                            color: '#94a3b8',
                            font: {
                                size: 11,
                                family: 'Space Grotesk',
                                weight: '700'
                            }
                        },
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                family: 'JetBrains Mono',
                                size: 10
                            },
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    y: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'RISK PER TRADE (%)',
                            color: '#94a3b8',
                            font: {
                                size: 11,
                                family: 'Space Grotesk',
                                weight: '700'
                            }
                        },
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                family: 'JetBrains Mono',
                                size: 10
                            },
                            callback: function(value) {
                                return value.toFixed(2) + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PropFirmSimulator();
});

let allData = [];
let filteredData = [];

// Utility functions
function parseTime(timeStr) {
    if (!timeStr) return null;
    if (typeof timeStr === 'number') return timeStr;
    
    const parts = timeStr.toString().split(':');
    if (parts.length === 2) {
        const [min, sec] = parts;
        return parseInt(min) * 60 + parseFloat(sec);
    }
    return parseFloat(timeStr);
}

function formatTime(seconds) {
    if (!seconds && seconds !== 0) return '--';
    const min = Math.floor(seconds / 60);
    const sec = (seconds % 60).toFixed(2);
    return `${min}:${sec.padStart(5, '0')}`;
}

function calculateStats(data) {
    if (!data || data.length === 0) return null;

    const times = data.map(d => d.timeSeconds).filter(t => t !== null);
    const sorted = [...times].sort((a, b) => a - b);
    
    const sum = times.reduce((a, b) => a + b, 0);
    const avg = sum / times.length;
    const variance = times.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / times.length;
    const stdDev = Math.sqrt(variance);
    
    return {
        best: sorted[0],
        worst: sorted[sorted.length - 1],
        average: avg,
        median: sorted[Math.floor(sorted.length / 2)],
        stdDev: stdDev,
        coefficient: (stdDev / avg) * 100,
        total: times.length
    };
}

function calculateRollingAverage(data, window = 5) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
        const start = Math.max(0, i - window + 1);
        const subset = data.slice(start, i + 1);
        const avg = subset.reduce((sum, d) => sum + d.timeSeconds, 0) / subset.length;
        result.push(avg);
    }
    return result;
}

function detectOutliers(data) {
    const times = data.map(d => d.timeSeconds);
    const sorted = [...times].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    return data.map(d => ({
        ...d,
        isOutlier: d.timeSeconds < lowerBound || d.timeSeconds > upperBound
    }));
}

function generateInsights(data) {
    const stats = calculateStats(data);
    if (!stats) return '<div class="insight-item">No data available for analysis.</div>';

    const insights = [];
    
    // Performance level
    if (stats.average < 20) {
        insights.push(`<div class="insight-item"><strong>Elite Performance:</strong> Your average solve time of ${formatTime(stats.average)} places you in the advanced category. Exceptional cube mastery detected.</div>`);
    } else if (stats.average < 30) {
        insights.push(`<div class="insight-item"><strong>Strong Performance:</strong> Average time of ${formatTime(stats.average)} shows solid intermediate skills. Continue practicing for sub-20 times.</div>`);
    } else {
        insights.push(`<div class="insight-item"><strong>Building Foundation:</strong> Average of ${formatTime(stats.average)}. Focus on algorithm memorization and lookahead to improve efficiency.</div>`);
    }

    // Consistency analysis
    if (stats.coefficient < 10) {
        insights.push(`<div class="insight-item"><strong>Exceptional Consistency:</strong> Coefficient of variation at ${stats.coefficient.toFixed(1)}% indicates highly reliable performance across solves.</div>`);
    } else if (stats.coefficient < 20) {
        insights.push(`<div class="insight-item"><strong>Good Consistency:</strong> CV of ${stats.coefficient.toFixed(1)}% shows decent reliability. Work on maintaining focus throughout sessions.</div>`);
    } else {
        insights.push(`<div class="insight-item"><strong>Consistency Opportunity:</strong> CV of ${stats.coefficient.toFixed(1)}% suggests variable performance. Practice deliberate, controlled solves to reduce variance.</div>`);
    }

    // Progress analysis
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    const firstHalfAvg = calculateStats(firstHalf)?.average || 0;
    const secondHalfAvg = calculateStats(secondHalf)?.average || 0;
    const improvement = ((firstHalfAvg - secondHalfAvg) / firstHalfAvg) * 100;

    if (improvement > 5) {
        insights.push(`<div class="insight-item"><strong>Positive Trajectory:</strong> ${improvement.toFixed(1)}% improvement detected from early to recent solves. Your practice regimen is effective.</div>`);
    } else if (improvement < -5) {
        insights.push(`<div class="insight-item"><strong>Performance Plateau:</strong> Times increased by ${Math.abs(improvement).toFixed(1)}%. Consider analyzing weak algorithms or taking a practice break to reset.</div>`);
    } else {
        insights.push(`<div class="insight-item"><strong>Stable Performance:</strong> Times remain consistent. To break through plateaus, try learning new methods or finger trick optimizations.</div>`);
    }

    // Best time analysis
    const bestImprovement = ((stats.average - stats.best) / stats.average) * 100;
    insights.push(`<div class="insight-item"><strong>Peak Performance:</strong> Your best solve of ${formatTime(stats.best)} is ${bestImprovement.toFixed(1)}% faster than average, showing your optimal capability under ideal conditions.</div>`);

    // Session analysis
    const sessions = [...new Set(data.map(d => d.sessionId))];
    if (sessions.length > 1) {
        insights.push(`<div class="insight-item"><strong>Training Volume:</strong> ${sessions.length} practice sessions logged with ${stats.total} total solves. Consistent practice is key to skill retention and improvement.</div>`);
    }

    return insights.join('');
}

// File handling
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        Papa.parse(text, {
            header: true,
            dynamicTyping: false,
            skipEmptyLines: true,
            complete: function(results) {
                processData(results.data);
                document.getElementById('fileName').textContent = file.name;
                document.getElementById('recordCount').textContent = results.data.length;
                document.getElementById('fileInfo').classList.remove('hidden');
                document.getElementById('mainContent').classList.remove('hidden');
            }
        });
    };
    reader.readAsText(file);
});

function processData(rawData) {
    // Process and clean data
    allData = rawData.map((row, index) => {
        const timeSeconds = parseTime(row['Time (s)'] || row['Time (mm:ss)']);
        
        return {
            date: row['Date'] || '',
            cubeType: row['Cube Type'] || '3×3',
            solveNumber: parseInt(row['Solve Number']) || index + 1,
            timeStr: row['Time (mm:ss)'] || '',
            timeSeconds: timeSeconds,
            sessionId: row['Session ID'] || 'Session 1',
            sessionAverage: parseFloat(row['Session Averages']) || null
        };
    }).filter(d => d.timeSeconds !== null);

    // Detect outliers
    allData = detectOutliers(allData);

    // Populate cube type filter
    const cubeTypes = [...new Set(allData.map(d => d.cubeType))];
    const cubeTypeSelect = document.getElementById('cubeType');
    cubeTypeSelect.innerHTML = '<option value="all">All Types</option>';
    cubeTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        cubeTypeSelect.appendChild(option);
    });

    // Populate session filter **numerically**
    const sessions = [...new Set(allData.map(d => d.sessionId))].sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)); // extract number from "Session 1"
        const numB = parseInt(b.match(/\d+/));
        return numA - numB;
    });
    const sessionSelect = document.getElementById('sessionFilter');
    sessionSelect.innerHTML = '<option value="all">All Sessions</option>';
    sessions.forEach(session => {
        const option = document.createElement('option');
        option.value = session;
        option.textContent = session;
        sessionSelect.appendChild(option);
    });

    // Set date range
    const dates = allData.map(d => new Date(d.date)).filter(d => !isNaN(d));
    if (dates.length > 0) {
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        document.getElementById('startDate').value = minDate.toISOString().split('T')[0];
        document.getElementById('endDate').value = maxDate.toISOString().split('T')[0];
    }

    // Set up event listeners
    document.getElementById('startDate').addEventListener('change', applyFilters);
    document.getElementById('endDate').addEventListener('change', applyFilters);
    document.getElementById('cubeType').addEventListener('change', applyFilters);
    document.getElementById('sessionFilter').addEventListener('change', applyFilters);

    // Initial render
    applyFilters();
}


function applyFilters() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const cubeType = document.getElementById('cubeType').value;
    const session = document.getElementById('sessionFilter').value;

    filteredData = allData.filter(d => {
        let include = true;
        
        if (startDate && d.date && new Date(d.date) < new Date(startDate)) include = false;
        if (endDate && d.date && new Date(d.date) > new Date(endDate)) include = false;
        if (cubeType !== 'all' && d.cubeType !== cubeType) include = false;
        if (session !== 'all' && d.sessionId !== session) include = false;
        
        return include;
    });

    updateDashboard();
}

function updateDashboard() {
    updateStats();
    renderProgressionChart();
    renderRollingAverageChart();
    renderSessionBoxPlot();
    renderHistogram();
    renderHeatmap();
    updateInsights();
}

function updateStats() {
    const stats = calculateStats(filteredData);
    if (!stats) return;

    document.getElementById('bestTime').textContent = formatTime(stats.best);
    document.getElementById('avgTime').textContent = formatTime(stats.average);
    document.getElementById('totalSolves').textContent = stats.total;
    document.getElementById('consistency').textContent = stats.coefficient.toFixed(1) + '%';

    // Calculate changes (comparing first 30% to last 30% of data)
    const splitPoint = Math.floor(filteredData.length * 0.3);
    const earlyData = filteredData.slice(0, splitPoint);
    const recentData = filteredData.slice(-splitPoint);
    
    const earlyStats = calculateStats(earlyData);
    const recentStats = calculateStats(recentData);

    if (earlyStats && recentStats) {
        const avgChange = ((earlyStats.average - recentStats.average) / earlyStats.average) * 100;
        const avgChangeEl = document.getElementById('avgTimeChange');
        avgChangeEl.textContent = `${avgChange > 0 ? '↓' : '↑'} ${Math.abs(avgChange).toFixed(1)}% vs early`;
        avgChangeEl.className = avgChange > 0 ? 'stat-change positive' : 'stat-change negative';

        const consistencyChange = recentStats.coefficient - earlyStats.coefficient;
        const consistencyEl = document.getElementById('consistencyChange');
        consistencyEl.textContent = `${consistencyChange < 0 ? '↓' : '↑'} ${Math.abs(consistencyChange).toFixed(1)}% vs early`;
        consistencyEl.className = consistencyChange < 0 ? 'stat-change positive' : 'stat-change negative';
    }

    document.getElementById('bestTimeChange').textContent = `Session: ${stats.best < stats.average ? 'Peak performance' : 'Within range'}`;
    document.getElementById('totalSolvesInfo').textContent = `${filteredData.length === allData.length ? 'All data' : 'Filtered view'}`;
}

function renderProgressionChart() {
    const trace1 = {
        x: filteredData.map((d, i) => i + 1),
        y: filteredData.map(d => d.timeSeconds),
        mode: 'markers+lines',
        name: 'Solve Time',
        marker: {
            color: filteredData.map(d => d.isOutlier ? '#ff00ff' : '#00ffff'),
            size: filteredData.map(d => d.isOutlier ? 10 : 6),
            line: {
                color: '#000',
                width: 1
            }
        },
        line: {
            color: 'rgba(0, 255, 255, 0.3)',
            width: 1
        }
    };

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(10, 0, 20, 0.8)',
        font: {
            family: 'Share Tech Mono, monospace',
            color: '#e0e0ff'
        },
        xaxis: {
            title: 'Solve Number',
            gridcolor: 'rgba(0, 255, 255, 0.1)',
            zerolinecolor: 'rgba(0, 255, 255, 0.2)'
        },
        yaxis: {
            title: 'Time (seconds)',
            gridcolor: 'rgba(0, 255, 255, 0.1)',
            zerolinecolor: 'rgba(0, 255, 255, 0.2)'
        },
        hovermode: 'closest',
        margin: {
            l: 60,
            r: 40,
            t: 40,
            b: 60
        },
        height: 450,
        autosize: true
    };

    Plotly.newPlot('progressionChart', [trace1], layout, {
        responsive: true, 
        displayModeBar: false
    });
}

function renderRollingAverageChart() {
    const rollingAvg5 = calculateRollingAverage(filteredData, 5);
    const rollingAvg10 = calculateRollingAverage(filteredData, 10);
    const rollingAvg20 = calculateRollingAverage(filteredData, 20);

    const trace1 = {
        x: filteredData.map((d, i) => i + 1),
        y: rollingAvg5,
        mode: 'lines',
        name: 'MA-5',
        line: { color: '#00ffff', width: 2 }
    };

    const trace2 = {
        x: filteredData.map((d, i) => i + 1),
        y: rollingAvg10,
        mode: 'lines',
        name: 'MA-10',
        line: { color: '#ff00ff', width: 2 }
    };

    const trace3 = {
        x: filteredData.map((d, i) => i + 1),
        y: rollingAvg20,
        mode: 'lines',
        name: 'MA-20',
        line: { color: '#ffff00', width: 2 }
    };

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(10, 0, 20, 0.8)',
        font: {
            family: 'Share Tech Mono, monospace',
            color: '#e0e0ff'
        },
        xaxis: {
            title: 'Solve Number',
            gridcolor: 'rgba(0, 255, 255, 0.1)',
            zerolinecolor: 'rgba(0, 255, 255, 0.2)'
        },
        yaxis: {
            title: 'Average Time (seconds)',
            gridcolor: 'rgba(0, 255, 255, 0.1)',
            zerolinecolor: 'rgba(0, 255, 255, 0.2)'
        },
        hovermode: 'x unified',
        margin: {
            l: 60,
            r: 40,
            t: 40,
            b: 60
        },
        height: 450,
        autosize: true
    };

    Plotly.newPlot('rollingAvgChart', [trace1, trace2, trace3], layout, {
        responsive: true, 
        displayModeBar: false
    });
}

function renderSessionBoxPlot() {
    const sessions = [...new Set(filteredData.map(d => d.sessionId))].sort();
    const traces = sessions.map(session => {
        const sessionData = filteredData.filter(d => d.sessionId === session);
        return {
            y: sessionData.map(d => d.timeSeconds),
            name: session,
            type: 'box',
            marker: {
                color: 'rgba(0, 255, 255, 0.6)'
            },
            line: {
                color: '#00ffff'
            }
        };
    });

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(10, 0, 20, 0.8)',
        font: {
            family: 'Share Tech Mono, monospace',
            color: '#e0e0ff'
        },
        xaxis: {
            title: 'Session',
            gridcolor: 'rgba(0, 255, 255, 0.1)',
            automargin: true
        },
        yaxis: {
            title: 'Time (seconds)',
            gridcolor: 'rgba(0, 255, 255, 0.1)',
            zerolinecolor: 'rgba(0, 255, 255, 0.2)'
        },
        showlegend: false,
        margin: {
            l: 60,
            r: 40,
            t: 40,
            b: 100
        },
        height: 450,
        autosize: true
    };

    Plotly.newPlot('sessionBoxPlot', traces, layout, {
        responsive: true, 
        displayModeBar: false
    });
}

function renderHistogram() {
    const trace = {
        x: filteredData.map(d => d.timeSeconds),
        type: 'histogram',
        nbinsx: 20,
        marker: {
            color: 'rgba(255, 0, 255, 0.6)',
            line: {
                color: '#ff00ff',
                width: 1
            }
        }
    };

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(10, 0, 20, 0.8)',
        font: {
            family: 'Share Tech Mono, monospace',
            color: '#e0e0ff'
        },
        xaxis: {
            title: 'Time (seconds)',
            gridcolor: 'rgba(0, 255, 255, 0.1)',
            zerolinecolor: 'rgba(0, 255, 255, 0.2)'
        },
        yaxis: {
            title: 'Frequency',
            gridcolor: 'rgba(0, 255, 255, 0.1)',
            zerolinecolor: 'rgba(0, 255, 255, 0.2)'
        },
        margin: {
            l: 60,
            r: 40,
            t: 40,
            b: 60
        },
        height: 450,
        autosize: true
    };

    Plotly.newPlot('histogramChart', [trace], layout, {
        responsive: true, 
        displayModeBar: false
    });
}

function renderHeatmap() {
    // Create a heatmap of session vs solve number
    const sessions = [...new Set(filteredData.map(d => d.sessionId))].sort();
    const maxSolves = Math.max(...filteredData.map(d => d.solveNumber));
    
    const z = sessions.map(session => {
        const row = [];
        for (let i = 1; i <= maxSolves; i++) {
            const solve = filteredData.find(d => d.sessionId === session && d.solveNumber === i);
            row.push(solve ? solve.timeSeconds : null);
        }
        return row;
    });

    const trace = {
        z: z,
        x: Array.from({length: maxSolves}, (_, i) => i + 1),
        y: sessions,
        type: 'heatmap',
        colorscale: [
            [0, '#0a0014'],
            [0.3, '#00ffff'],
            [0.6, '#ff00ff'],
            [1, '#ffff00']
        ],
        hoverongaps: false
    };

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(10, 0, 20, 0.8)',
        font: {
            family: 'Share Tech Mono, monospace',
            color: '#e0e0ff'
        },
        xaxis: {
            title: 'Solve Number',
            gridcolor: 'rgba(0, 255, 255, 0.1)',
            side: 'bottom'
        },
        yaxis: {
            title: 'Session',
            gridcolor: 'rgba(0, 255, 255, 0.1)',
            automargin: true
        },
        margin: {
            l: 100,
            r: 50,
            t: 50,
            b: 80
        },
        height: 450,
        autosize: true
    };

    Plotly.newPlot('heatmapChart', [trace], layout, {
        responsive: true, 
        displayModeBar: false
    });
}

function updateInsights() {
    document.getElementById('insightsContent').innerHTML = generateInsights(filteredData);
}

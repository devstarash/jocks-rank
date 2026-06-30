const Charts = {
    defaults: {
        primaryColor: '#2563eb',
        textColor: '#64748b',
        gridColor: '#e2e8f0'
    },

    renderBarChart(containerId, data, unit = '') {
        const container = document.getElementById(containerId);
        if (!container || !data || data.length === 0) return;

        const trace = {
            x: data.map(d => d.name),
            y: data.map(d => d.value),
            type: 'bar',
            marker: { color: this.defaults.primaryColor },
            text: data.map(d => unit ? `${d.value} ${unit}` : d.value),
            textposition: 'auto'
        };

        const layout = {
            margin: { t: 20, b: 60, l: 50, r: 20 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            xaxis: { tickangle: data.length > 5 ? -30 : 0 },
            yaxis: { gridcolor: this.defaults.gridColor },
            showlegend: false
        };

        Plotly.newPlot(container, [trace], layout, { responsive: true, displayModeBar: false });
    },

    renderProgressChart(containerId, data, unit = '') {
        const container = document.getElementById(containerId);
        if (!container || !data || data.length === 0) return;

        const trace = {
            x: data.map(d => d.date),
            y: data.map(d => d.value),
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: this.defaults.primaryColor, width: 3, shape: 'spline' },
            marker: { color: this.defaults.primaryColor, size: 8 }
        };

        const layout = {
            margin: { t: 10, b: 40, l: 50, r: 20 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            xaxis: { tickformat: '%d.%m' },
            yaxis: { title: unit, gridcolor: this.defaults.gridColor },
            showlegend: false
        };

        Plotly.newPlot(container, [trace], layout, { responsive: true, displayModeBar: false });
    }
};

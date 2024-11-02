// Utility functions
function showError(message) {
    const errorContainer = document.getElementById('error-container');
    errorContainer.innerHTML = `
        <div class="error">${message}</div>
    `;
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

// Event handling for tooltip
let tooltip = document.querySelector('.tooltip');

function showTooltip(event, content) {
    tooltip.style.display = 'block';
    tooltip.innerHTML = content;
    tooltip.style.left = (event.pageX + 10) + 'px';
    tooltip.style.top = (event.pageY - 28) + 'px';
}

function hideTooltip() {
    tooltip.style.display = 'none';
}

// Canvas rendering
function drawHistogram(canvas, data) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate scales
    const maxCount = Math.max(...data.map(d => d.count));
    const barWidth = (width - padding * 2) / data.length;

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = '#6b7280';
    ctx.stroke();

    // Draw bars
    data.forEach((d, i) => {
        const barHeight = ((height - padding * 2) * d.count) / maxCount;
        const x = padding + i * barWidth;
        const y = height - padding - barHeight;

        ctx.fillStyle = '#4f46e5';
        ctx.fillRect(x, y, barWidth * 0.8, barHeight);

        // Draw month/year label
        ctx.save();
        ctx.translate(x + barWidth / 2, height - padding + 15);
        ctx.rotate(-Math.PI / 4);
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${d.month}/${d.year}`, 0, 0);
        ctx.restore();
    });

    // Add Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = Math.round((maxCount * i) / 5);
        const y = height - padding - ((height - padding * 2) * i) / 5;
        ctx.fillText(value, padding - 5, y + 4);
    }
}

function drawPieChart(canvas, data) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const total = data.reduce((sum, d) => sum + d.count, 0);
    let startAngle = 0;

    const colors = {
        true: '#4f46e5',  // Marketing
        false: '#e11d48'  // Non-marketing
    };

    // Draw pie segments
    data.forEach(d => {
        const angle = (2 * Math.PI * d.count) / total;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + angle);
        ctx.fillStyle = colors[d.marketing];
        ctx.fill();

        startAngle += angle;
    });

    // Draw center circle (donut style)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Draw total in center
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(total.toString(), centerX, centerY);
    ctx.font = '12px sans-serif';
    ctx.fillText('Total', centerX, centerY + 20);

    // Update legend
    const legend = document.getElementById('pie-legend');
    legend.innerHTML = '';
    data.forEach(d => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
            <div class="legend-color" style="background-color: ${colors[d.marketing]}"></div>
            <span>${d.marketing ? 'Marketing' : 'Non-Marketing'} (${d.count})</span>
        `;
        legend.appendChild(item);
    });
}

// Data fetching and initialization
async function getMonthlyData() {
    try {
        const response = await fetch("/getMonthlyOrderData", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();
        hideLoading();

        if (response.ok) {
            const canvas = document.getElementById('histogram-canvas');
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight || 400;
            drawHistogram(canvas, result.result);
        } else {
            showError(result.message || "Failed to load data");
        }
    } catch (error) {
        hideLoading();
        showError("Failed to fetch data. Please try again later.");
        console.error("Failed to fetch data:", error);
    }
}

async function getMarketingData() {
    try {
        const response = await fetch("/getMarketingData", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (response.ok) {
            const canvas = document.getElementById('pie-canvas');
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight || 400;
            drawPieChart(canvas, result.result);
        } else {
            showError(result.message || "Failed to load marketing data");
        }
    } catch (error) {
        showError("Failed to fetch marketing data. Please try again later.");
        console.error("Failed to fetch marketing data:", error);
    }
}

// Initialize
window.onload = () => {
    getMonthlyData();
    getMarketingData();
};

// Handle window resize
window.addEventListener('resize', () => {
    const histogramCanvas = document.getElementById('histogram-canvas');
    const pieCanvas = document.getElementById('pie-canvas');
    
    // Update histogram
    histogramCanvas.width = histogramCanvas.offsetWidth;
    histogramCanvas.height = histogramCanvas.offsetHeight || 400;
    getMonthlyData();

    // Update pie chart
    pieCanvas.width = pieCanvas.offsetWidth;
    pieCanvas.height = pieCanvas.offsetHeight || 400;
    getMarketingData();
});
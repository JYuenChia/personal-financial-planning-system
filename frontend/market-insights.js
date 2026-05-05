// --- 1. GLOBAL DATA ---
const marketData = {
    sp500: { label: 'S&P 500', data: [4200, 4250, 4100, 4350, 4400, 4380, 4500], color: '#1a53bd' },
    btc: { label: 'Bitcoin', data: [62000, 64000, 63000, 67000, 65000, 66000, 68000], color: '#f7931a' },
    eth: { label: 'Ethereum', data: [3100, 3200, 3150, 3450, 3300, 3400, 3500], color: '#627eea' },
    gold: { label: 'Gold', data: [2100, 2150, 2140, 2180, 2200, 2190, 2250], color: '#ffca2c' },
    aapl: { label: 'Apple', data: [170, 175, 172, 180, 185, 183, 190], color: '#555555' }
};

const mockNews = [
    { 
        category: "STOCKS", 
        title: "Investing in Index Funds: Key Benefits and Drawbacks Revealed", 
        author: "Adam Hayes", 
        img: "images/news-stock-index.jpg",
        content: "Index funds have become a staple for long-term investors. By tracking a specific market index, they offer instant diversification and lower fees..."
    },
    { 
        category: "STOCKS", 
        title: "The Top 25 Stocks in the S&P 500", 
        author: "Nathan Reiff", 
        img: "images/image2.jpg",
        content: "The S&P 500 remains the benchmark for American equity performance. Tech giants continue to drive market sentiment..."
    },
    { 
        category: "CRYPTO", 
        title: "Bitcoin Halving 2024: What Investors Need to Know", 
        author: "Shayan Javeed", 
        img: "images/image3.jpg",
        content: "As the Bitcoin halving approaches, market sentiment is shifting. Scarcity and institutional interest are key factors..."
    }
];

let marketChart;

// --- 2. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
    initChart();
    loadNews();
});

function checkAuthState() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log("No token found, but staying on page for testing.");
        //window.location.href = 'login.html';
        return;
    }
    document.querySelectorAll('.auth-only').forEach(el => el.style.display = 'block');
    document.querySelectorAll('.guest-only').forEach(el => el.style.display = 'none');
}

// --- 3. CHART LOGIC ---
function initChart() {
    const ctx = document.getElementById('marketChart').getContext('2d');
    marketChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'S&P 500',
                data: marketData.sp500.data,
                borderColor: marketData.sp500.color,
                backgroundColor: marketData.sp500.color + '22',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });

    document.getElementById('assetSelector').addEventListener('change', function(e) {
        const asset = marketData[e.target.value];
        marketChart.data.datasets[0].label = asset.label;
        marketChart.data.datasets[0].data = asset.data;
        marketChart.data.datasets[0].borderColor = asset.color;
        marketChart.data.datasets[0].backgroundColor = asset.color + '22';
        marketChart.update();
    });
}

function loadNews() {
    const newsContainer = document.getElementById('news-feed');
    newsContainer.innerHTML = mockNews.map((item, index) => `
    <div class="list-group-item border-0 border-bottom py-3 bg-transparent px-3">
        <div class="row g-3 align-items-start">
            <div class="col-4">
                <div class="ratio ratio-4x3 shadow-sm rounded-2 overflow-hidden">
                    <img src="${item.img}" class="object-fit-cover" alt="news thumb">
                </div>
            </div>
            <div class="col-8">
                <div class="fw-bolder text-uppercase mb-1" style="font-size: 0.65rem; color: #1a53bd;">
                    ${item.category}
                </div>
                <a href="javascript:void(0)" onclick="showFullNews(${index})" class="text-decoration-none">
                    <h6 class="fw-bold text-dark mb-1 news-link" style="line-height: 1.3; font-size: 0.9rem;">
                        ${item.title}
                    </h6>
                </a>
                <div class="text-muted" style="font-size: 0.75rem;">By ${item.author}</div>
            </div>
        </div>
    </div>`).join('');
}

function showFullNews(index) {
    const selected = mockNews[index];
    const displaySection = document.getElementById('bottom-news-display');
    const contentArea = document.getElementById('bottom-content-area');
    const sidebarImg = document.getElementById('news-sidebar-img');

    // Set sidebar image for the blur effect
    sidebarImg.style.backgroundImage = `url('${selected.img}')`;

    contentArea.innerHTML = `
        <div class="text-uppercase mb-2 fw-bold" style="font-size: 0.75rem; color: #1a53bd; letter-spacing: 1px;">
            ${selected.category}
        </div>
        <h1 class="fw-bold mb-3" style="color: #d42c20 !important; font-size: 2.5rem; line-height: 1.1;">
            ${selected.title}
        </h1>
        <div class="mb-4 fw-bold" style="color: #007bff;">
            By ${selected.author} | May 5, 2026
        </div>
        
        <div class="news-text text-dark" style="line-height: 1.8; font-size: 1.1rem;">
            <p class="lead fw-bold">${selected.content}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.</p>
        </div>
    `;

    displaySection.style.display = 'block';
    displaySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
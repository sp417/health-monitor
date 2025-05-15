// Navigation logic
const pages = {
    home: document.getElementById('page-home'),
    add: document.getElementById('page-add'),
    view: document.getElementById('page-view')
};
const navLinks = {
    home: document.getElementById('nav-home'),
    add: document.getElementById('nav-add'),
    view: document.getElementById('nav-view')
};

function showPage(page) {
    Object.values(pages).forEach(p => p.style.display = 'none');
    Object.values(navLinks).forEach(l => l.classList.remove('active'));
    pages[page].style.display = '';
    navLinks[page].classList.add('active');
    if (page === 'view') loadData();
}

navLinks.home.onclick = () => showPage('home');
navLinks.add.onclick = () => showPage('add');
navLinks.view.onclick = () => showPage('view');

// Add Data Form Logic
const healthForm = document.getElementById('healthForm');
const formStatus = document.getElementById('form-status');
if (healthForm) {
    healthForm.onsubmit = async function(e) {
        e.preventDefault();
        formStatus.textContent = 'Submitting...';
        const user = document.getElementById('user').value;
        const heart_rate = document.getElementById('heart_rate').value;
        const temperature = document.getElementById('temperature').value;
        const notes = document.getElementById('notes').value;
        const res = await fetch('http://localhost:5000/api/health', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user, heart_rate, temperature, notes })
        });
        if (res.ok) {
            formStatus.textContent = 'Data submitted!';
            healthForm.reset();
        } else {
            formStatus.textContent = 'Submission failed.';
        }
    };
}

// View Data Logic
const dataList = document.getElementById('data-list');
const refreshBtn = document.getElementById('refresh-btn');

async function loadData() {
    dataList.innerHTML = 'Loading...';
    const res = await fetch('http://localhost:5000/api/health');
    if (!res.ok) {
        dataList.innerHTML = 'Failed to load data.';
        return;
    }
    const data = await res.json();
    if (data.length === 0) {
        dataList.innerHTML = '<p>No health data found.</p>';
        return;
    }
    dataList.innerHTML = data.map(entry => `
        <div class="data-entry">
            <strong>${entry.user}</strong> <br>
            <span>Heart Rate: <b>${entry.heart_rate}</b> bpm</span> |
            <span>Temperature: <b>${entry.temperature}</b> °C</span><br>
            <span>Notes: ${entry.notes || '<i>None</i>'}</span><br>
            <span style="font-size:0.9em;color:#888;">${new Date(entry.timestamp).toLocaleString()}</span>
            <button class="delete-btn" onclick="deleteEntry(${entry.id})">Delete</button>
        </div>
    `).join('');
}

window.deleteEntry = async function(id) {
    if (!confirm('Delete this entry?')) return;
    await fetch(`http://localhost:5000/api/health/${id}`, { method: 'DELETE' });
    loadData();
};

if (refreshBtn) refreshBtn.onclick = loadData;

// Initial page
showPage('home');

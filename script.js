// Global constants and elements
const navLinks = document.querySelectorAll('.nav-links a');
const contentSections = document.querySelectorAll('.content-section');
const currentSectionTitle = document.getElementById('currentSectionTitle');

// Login elements
const loginContainer = document.getElementById('login-container');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginMessage = document.getElementById('loginMessage');
const mainContent = document.getElementById('main-content');
const logoutBtn = document.getElementById('logoutBtn');

// Define valid credentials
const VALID_USERNAME = 'admin'; // You can change this
const VALID_PASSWORD = 'ilstate123';

// Webhook URLs (as provided by you, ensure they are correct)
const WEBHOOK_URLS = {
    reports: 'https://discord.com/api/webhooks/1378494950278430770/1bsyeUy1kCBHzWqhiV7YEDc0NKuLjSlMp07jYZCVgXdlE9Aqpwil7mqrrmKjOdPruU', // Example, use your actual 'reports' webhook
    bolosWarrants: 'https://discord.com/api/webhooks/1378494950278430770/1bsyeUy1kCBHzWqhiV7YEDc0NKuLjSlMp07jYZCVgXdlE9Aqpwil7mqrrmKjOdPruU',
    vehicles: 'https://discord.com/api/webhooks/1378495174459523073/y_TkwouVSwuVz1mRLBoVQv7rAUdBbtXoxLxjFEN7BW5wGYLi9GVw4RMLJ3fLYoyLgzPL',
    evidence: 'https://discord.com/api/webhooks/1378495259524337716/zlTX8yWQvUXM7fCth32JiK6H7C2y03knjLBkyKLmmOLhBBQtbRH-gpNdOboFNQP9h05A',
    weaponRegistry: 'https://discord.com/api/webhooks/1378495349257142442/GFA4zJPaibXxU2QJwvzGhwVhb_mbpXzqxKo1Z2asz1OucakhfBgEzuCumw8aRK3P--_-', // UPDATED
    staff: 'https://discord.com/api/webhooks/1378495438034043171/tqJgIHIHoFy0vkhPjhTsxGO4EtLVev7Ag9SL49rZHWcJPsrYePdvux-J_yJIoRkRQpQ8',
    roster: 'https://discord.com/api/webhooks/1378495652371235037/PRC2l6N2Zi6sGn5zhEP9azHpwMEpxWzQMq-CBzlmtXePGxiFdzH-wnnBnU-5YIRVtEPf', // UPDATED
    codesCommands: 'https://discord.com/api/webhooks/1378495805240905898/WjENCUwC9-F_5BKq2_m274R_HFU0SWyOb3Jh5JGUB7Z9iBKRId3cFGfSUUhRdxvZges_',
    charges: 'https://discord.com/api/webhooks/1378495876825350195/kLfFQNnvoltNuhtoq76Ia95OcNJ9JEpC-cKtRxoUqVp1-rTXCwPdhcqFjCfc0o99HonI'
};

// Helper to show/hide sections
function showSection(sectionId) {
    contentSections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.remove('hidden');
            section.classList.add('active');
        } else {
            section.classList.add('hidden');
            section.classList.remove('active');
        }
    });
}

// Helper to update main header title
function updateMainHeaderTitle(title) {
    currentSectionTitle.textContent = title;
}

/**
 * Sends a message to a Discord channel via Webhook.
 * @param {string} webhookUrl The specific Webhook URL to send the message to.
 * @param {string} message The content of the message.
 * @param {string} username Optional: The username to display for the webhook.
 * @param {string} avatar_url Optional: URL to an avatar image for the webhook.
 */
async function sendDiscordMessage(webhookUrl, message, username = 'מערכת ניהול', avatar_url = 'https://via.placeholder.com/60') {
    if (!webhookUrl) {
        console.error("Discord Webhook URL is missing for this operation.");
        alert("שגיאה: Webhook של דיסקורד אינו מוגדר עבור פעולה זו.");
        return;
    }

    const payload = {
        content: message,
        username: username,
        avatar_url: avatar_url
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log(`הודעה נשלחה לדיסקורד בהצלחה! (Webhook: ${webhookUrl.substring(0, 50)}...)`);
        } else {
            const errorText = await response.text();
            console.error('שגיאה בשליחת הודעה לדיסקורד:', response.status, response.statusText, errorText);
            alert(`שגיאה בשליחת הודעה לדיסקורד: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        console.error('שגיאה ברשת או בבקשה לדיסקורד:', error);
        alert(`שגיאה בתקשורת עם דיסקורד: ${error.message}`);
    }
}

// --- Login Logic ---
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        loginContainer.classList.add('hidden'); // Hide login
        mainContent.classList.remove('hidden'); // Show main content
        loginMessage.classList.add('hidden'); // Hide any error messages
        // Automatically navigate to dashboard and update title on successful login
        showSection('dashboard-section');
        updateMainHeaderTitle('לוח מחוונים');
        document.querySelector('.nav-links li[data-section="dashboard"]').classList.add('active');
    } else {
        loginMessage.classList.remove('hidden'); // Show error message
    }
});

// --- Logout Logic ---
logoutBtn.addEventListener('click', function() {
    if (confirm('האם אתה בטוח שברצונך להתנתק?')) {
        mainContent.classList.add('hidden'); // Hide main content
        loginContainer.classList.remove('hidden'); // Show login screen
        usernameInput.value = ''; // Clear username field
        passwordInput.value = ''; // Clear password field
        loginMessage.classList.add('hidden'); // Hide error message on logout
        // Reset navigation active state
        navLinks.forEach(nav => nav.parentElement.classList.remove('active'));
    }
});


// --- Event Listeners for Navigation ---
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.dataset.section + '-section';
        const sectionTitle = this.textContent.trim(); // Get the text content of the link

        // Remove active class from all nav links
        navLinks.forEach(nav => nav.parentElement.classList.remove('active'));
        // Add active class to the clicked link's parent <li>
        this.parentElement.classList.add('active');

        updateMainHeaderTitle(sectionTitle);
        showSection(sectionId);
    });
});

// --- Charges Section Logic ---
const charges = []; // In-memory storage for charges
const chargesTableBody = document.querySelector('#chargesTable tbody');
const chargeFormContainer = document.getElementById('chargeFormContainer');
const addChargeBtn = document.getElementById('addChargeBtn');
const cancelChargeFormBtn = document.getElementById('cancelChargeForm');
const chargeForm = document.getElementById('chargeForm');

// Function to render charges table
function renderCharges() {
    chargesTableBody.innerHTML = ''; // Clear existing rows
    if (charges.length === 0) {
        chargesTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--secondary-text-color);">אין אישומים זמינים.</td></tr>';
        return;
    }
    charges.forEach((charge, index) => {
        const row = chargesTableBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${charge.title}</td>
            <td>${charge.description}</td>
            <td>$${charge.fine}</td>
            <td>${charge.jail}</td>
            <td>${charge.points}</td>
            <td class="actions-cell">
                <button class="action-button edit-charge" data-id="${charge.id}" title="ערוך"><i class="fas fa-edit"></i></button>
                <button class="action-button delete-charge" data-id="${charge.id}" title="מחק"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
    });
    updateDashboardStats(); // Update dashboard after charges render
}

// Show add/edit charge form
addChargeBtn.addEventListener('click', () => {
    chargeForm.reset(); // Clear form
    document.getElementById('chargeId').value = ''; // Clear ID for new charge
    chargeFormContainer.classList.remove('hidden');
});

// Cancel charge form
cancelChargeFormBtn.addEventListener('click', () => {
    chargeFormContainer.classList.add('hidden');
});

// Handle charge form submission
chargeForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = document.getElementById('chargeId').value || `charge-${Date.now()}`;
    const title = document.getElementById('chargeTitle').value;
    const description = document.getElementById('chargeDescription').value;
    const fine = document.getElementById('chargeFine').value;
    const jail = document.getElementById('chargeJail').value;
    const points = document.getElementById('chargePoints').value;

    const newCharge = { id, title, description, fine, jail, points };

    let message;
    const existingIndex = charges.findIndex(c => c.id === id);
    if (existingIndex > -1) {
        charges[existingIndex] = newCharge; // Update existing
        message = `**אישום עודכן:**\nכותרת: ${title}\nקנס: $${fine}, מאסר: ${jail} חודשים, נקודות: ${points}\nתיאור: ${description}`;
    } else {
        charges.push(newCharge); // Add new
        message = `**אישום חדש נוצר:**\nכותרת: ${title}\nקנס: $${fine}, מאסר: ${jail} חודשים, נקודות: ${points}\nתיאור: ${description}`;
    }

    renderCharges();
    chargeFormContainer.classList.add('hidden');

    await sendDiscordMessage(WEBHOOK_URLS.charges, message, 'מערכת אישומים');
});

// Handle edit/delete from table
chargesTableBody.addEventListener('click', async function(event) {
    if (event.target.closest('.edit-charge')) {
        const chargeId = event.target.closest('button').dataset.id;
        const chargeToEdit = charges.find(c => c.id === chargeId);
        if (chargeToEdit) {
            document.getElementById('chargeId').value = chargeToEdit.id;
            document.getElementById('chargeTitle').value = chargeToEdit.title;
            document.getElementById('chargeDescription').value = chargeToEdit.description;
            document.getElementById('chargeFine').value = chargeToEdit.fine;
            document.getElementById('chargeJail').value = chargeToEdit.jail;
            document.getElementById('chargePoints').value = chargeToEdit.points;
            chargeFormContainer.classList.remove('hidden');
        }
    } else if (event.target.closest('.delete-charge')) {
        const chargeId = event.target.closest('button').dataset.id;
        if (confirm('האם אתה בטוח שברצונך למחוק אישום זה?')) {
            const deletedCharge = charges.splice(charges.findIndex(c => c.id === chargeId), 1)[0];
            renderCharges();
            const message = `**אישום נמחק:**\nכותרת: ${deletedCharge.title}\nקנס: $${deletedCharge.fine}, מאסר: ${deletedCharge.jail} חודשים, נקודות: ${deletedCharge.points}`;
            await sendDiscordMessage(WEBHOOK_URLS.charges, message, 'מערכת אישומים');
        }
    }
});


// Initial render for Charges (if any pre-defined charges)
renderCharges();


// --- Reports Section Logic ---
const reports = []; // In-memory storage for reports
const reportsList = document.getElementById('reportsList');
const reportDetailPanel = document.getElementById('reportDetailPanel');
const addReportBtn = document.getElementById('addReportBtn');

// Function to render reports list
function renderReportsList() {
    reportsList.innerHTML = '';
    if (reports.length === 0) {
        reportsList.innerHTML = '<p style="text-align: center; color: var(--secondary-text-color); padding: 20px;">אין דוחות זמינים.</p>';
        reportDetailPanel.innerHTML = '<h3>בחר דוח לצפייה או צור דוח חדש</h3>';
        return;
    }
    reports.forEach(report => {
        const li = document.createElement('li');
        li.dataset.id = report.id;
        li.innerHTML = `
            <div>
                <div class="report-summary-title">${report.title}</div>
                <div class="report-summary-date">${report.date}</div>
            </div>
            <div class="actions-cell">
                <button class="action-button edit-report" data-id="${report.id}" title="ערוך"><i class="fas fa-edit"></i></button>
                <button class="action-button delete-report" data-id="${report.id}" title="מחק"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        reportsList.appendChild(li);
    });
    updateDashboardStats(); // Update dashboard after reports render
}

// Function to display report details (you'll need to create a form/display for this)
function displayReportDetails(report) {
    if (!report) {
        reportDetailPanel.innerHTML = '<h3>בחר דוח לצפייה או צור דוח חדש</h3>';
        // Remove active class from all list items
        document.querySelectorAll('.reports-list li').forEach(item => item.classList.remove('active'));
        return;
    }
    reportDetailPanel.innerHTML = `
        <h3>${report.title}</h3>
        <div class="detail-field"><strong>תאריך:</strong> <span>${report.date}</span></div>
        <div class="detail-field"><strong>כתב:</strong> <span>${report.reporter}</span></div>
        <div class="detail-field"><strong>תוכן:</strong> <span>${report.content}</span></div>
        <div class="form-buttons">
            <button class="action-button edit-report" data-id="${report.id}"><i class="fas fa-edit"></i> ערוך דוח</button>
            <button class="action-button delete-report" data-id="${report.id}"><i class="fas fa-trash-alt"></i> מחק דוח</button>
        </div>
    `;
    // Remove active class from all list items
    document.querySelectorAll('.reports-list li').forEach(item => item.classList.remove('active'));
    // Add active class to the selected list item
    const selectedListItem = document.querySelector(`.reports-list li[data-id="${report.id}"]`);
    if (selectedListItem) {
        selectedListItem.classList.add('active');
    }
}

// Handle adding a new report (simplified for demonstration)
addReportBtn.addEventListener('click', async () => {
    const newReportTitle = prompt('הכנס כותרת לדוח חדש:');
    if (newReportTitle) {
        const newReportContent = prompt('הכנס תוכן לדוח:');
        const reporterName = prompt('הכנס שם הכתב:');
        const newReport = {
            id: `report-${Date.now()}`,
            title: newReportTitle,
            date: new Date().toLocaleDateString('he-IL'),
            reporter: reporterName || 'לא ידוע',
            content: newReportContent || 'אין תוכן'
        };
        reports.push(newReport);
        renderReportsList();
        displayReportDetails(newReport);

        const message = `**דוח מערכת חדש נוצר:**\nכותרת: ${newReport.title}\nנוצר ע"י: ${newReport.reporter}\nתאריך: ${newReport.date}`;
        await sendDiscordMessage(WEBHOOK_URLS.reports, message, 'מערכת דוחות');
    }
});

// Handle clicking on a report in the list or edit/delete buttons
reportsList.addEventListener('click', function(event) {
    const listItem = event.target.closest('li');
    if (listItem) {
        const reportId = listItem.dataset.id;
        const selectedReport = reports.find(r => r.id === reportId);
        displayReportDetails(selectedReport);
    }
});
reportDetailPanel.addEventListener('click', async function(event) {
    if (event.target.closest('.edit-report')) {
        const reportId = event.target.closest('button').dataset.id;
        const reportToEdit = reports.find(r => r.id === reportId);
        if (reportToEdit) {
            const updatedTitle = prompt('ערוך כותרת דוח:', reportToEdit.title);
            const updatedContent = prompt('ערוך תוכן דוח:', reportToEdit.content);
            const updatedReporter = prompt('ערוך שם כתב:', reportToEdit.reporter);

            if (updatedTitle !== null && updatedContent !== null && updatedReporter !== null) {
                reportToEdit.title = updatedTitle;
                reportToEdit.content = updatedContent;
                reportToEdit.reporter = updatedReporter;
                renderReportsList();
                displayReportDetails(reportToEdit);

                const message = `**דוח מערכת עודכן:**\nכותרת: ${reportToEdit.title}\nעודכן ע"י: ${reportToEdit.reporter}\nתאריך: ${reportToEdit.date}`;
                await sendDiscordMessage(WEBHOOK_URLS.reports, message, 'מערכת דוחות');
            }
        }
    } else if (event.target.closest('.delete-report')) {
        const reportId = event.target.closest('button').dataset.id;
        if (confirm('האם אתה בטוח שברצונך למחוק דוח זה?')) {
            const deletedReport = reports.splice(reports.findIndex(r => r.id === reportId), 1)[0];
            renderReportsList();
            displayReportDetails(null); // Clear detail panel
            const message = `**דוח מערכת נמחק:**\nכותרת: ${deletedReport.title}\nנוצר ע"י: ${deletedReport.reporter}`;
            await sendDiscordMessage(WEBHOOK_URLS.reports, message, 'מערכת דוחות');
        }
    }
});

renderReportsList();


// --- Bolo/Warrants Section Logic ---
const bolosWarrants = []; // In-memory storage
const boloWarrantListDiv = document.getElementById('boloWarrantList');
const addBoloWarrantBtn = document.getElementById('addBoloWarrantBtn');
const boloFormContainer = document.getElementById('boloFormContainer');
const cancelBoloFormBtn = document.getElementById('cancelBoloForm');
const boloForm = document.getElementById('boloForm');

function renderBolosWarrants() {
    boloWarrantListDiv.innerHTML = '';
    if (bolosWarrants.length === 0) {
        boloWarrantListDiv.innerHTML = '<p style="text-align: center; color: var(--secondary-text-color);">אין צווי מעצר או Bolos זמינים.</p>';
        return;
    }
    bolosWarrants.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('bolo-warrant-item');
        div.innerHTML = `
            <h3>${item.type}: ${item.subject}</h3>
            <p><strong>תיאור:</strong> ${item.description}</p>
            <div class="bolo-meta">
                <span>הונפק ע"י: ${item.issuedBy}</span>
                <span>תאריך הנפקה: ${item.issueDate}</span>
            </div>
            <div class="action-buttons-bolo">
                <button class="action-button edit-bolo" data-id="${item.id}" title="ערוך"><i class="fas fa-edit"></i> ערוך</button>
                <button class="action-button delete-bolo" data-id="${item.id}" title="מחק"><i class="fas fa-trash-alt"></i> מחק</button>
            </div>
        `;
        boloWarrantListDiv.appendChild(div);
    });
    updateDashboardStats(); // Update dashboard after Bolos render
}

addBoloWarrantBtn.addEventListener('click', () => {
    boloForm.reset();
    document.getElementById('boloId').value = '';
    boloFormContainer.classList.remove('hidden');
});

cancelBoloFormBtn.addEventListener('click', () => {
    boloFormContainer.classList.add('hidden');
});

boloForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = document.getElementById('boloId').value || `bolo-${Date.now()}`;
    const type = document.getElementById('boloType').value;
    const subject = document.getElementById('boloSubject').value;
    const description = document.getElementById('boloDescription').value;
    const issuedBy = document.getElementById('boloIssuedBy').value;
    const issueDate = new Date().toLocaleDateString('he-IL');

    const newBolo = { id, type, subject, description, issuedBy, issueDate };

    let message;
    const existingIndex = bolosWarrants.findIndex(b => b.id === id);
    if (existingIndex > -1) {
        bolosWarrants[existingIndex] = newBolo; // Update existing
        message = `**צו מעצר/BOLO עודכן:**\nסוג: ${type}, נושא: ${subject}\nהונפק ע"י: ${issuedBy}\nתיאור: ${description}`;
    } else {
        bolosWarrants.push(newBolo); // Add new
        message = `**צו מעצר/BOLO חדש נוצר:**\nסוג: ${type}, נושא: ${subject}\nהונפק ע"י: ${issuedBy}\nתאריך: ${issueDate}`;
    }

    renderBolosWarrants();
    boloFormContainer.classList.add('hidden');

    await sendDiscordMessage(WEBHOOK_URLS.bolosWarrants, message, 'מערכת צווי מעצר & Bolos');
});

boloWarrantListDiv.addEventListener('click', async function(event) {
    if (event.target.closest('.edit-bolo')) {
        const boloId = event.target.closest('button').dataset.id;
        const boloToEdit = bolosWarrants.find(b => b.id === boloId);
        if (boloToEdit) {
            document.getElementById('boloId').value = boloToEdit.id;
            document.getElementById('boloType').value = boloToEdit.type;
            document.getElementById('boloSubject').value = boloToEdit.subject;
            document.getElementById('boloDescription').value = boloToEdit.description;
            document.getElementById('boloIssuedBy').value = boloToEdit.issuedBy;
            boloFormContainer.classList.remove('hidden');
        }
    } else if (event.target.closest('.delete-bolo')) {
        const boloId = event.target.closest('button').dataset.id;
        if (confirm('האם אתה בטוח שברצונך למחוק פריט זה?')) {
            const deletedBolo = bolosWarrants.splice(bolosWarrants.findIndex(b => b.id === boloId), 1)[0];
            renderBolosWarrants();
            const message = `**צו מעצר/BOLO נמחק:**\nסוג: ${deletedBolo.type}, נושא: ${deletedBolo.subject}\nהונפק ע"י: ${deletedBolo.issuedBy}`;
            await sendDiscordMessage(WEBHOOK_URLS.bolosWarrants, message, 'מערכת צווי מעצר & Bolos');
        }
    }
});

renderBolosWarrants();


// --- Vehicles Section Logic ---
const vehicles = []; // In-memory storage
const vehicleGrid = document.getElementById('vehicleGrid');
const addVehicleBtn = document.getElementById('addVehicleBtn');

function renderVehicles() {
    vehicleGrid.innerHTML = '';
    if (vehicles.length === 0) {
        vehicleGrid.innerHTML = '<p style="text-align: center; color: var(--secondary-text-color);">אין כלי רכב זמינים.</p>';
        return;
    }
    vehicles.forEach(vehicle => {
        const card = document.createElement('div');
        card.classList.add('card-item');
        card.innerHTML = `
            <div class="default-icon"><i class="fas fa-car"></i></div>
            <strong>${vehicle.make} ${vehicle.model}</strong>
            <span>לוחית רישוי: ${vehicle.licensePlate}</span>
            <span>צבע: ${vehicle.color}</span>
            <span>בעלים: ${vehicle.owner}</span>
            <div class="actions-cell">
                <button class="action-button edit-vehicle" data-id="${vehicle.id}" title="ערוך"><i class="fas fa-edit"></i></button>
                <button class="action-button delete-vehicle" data-id="${vehicle.id}" title="מחק"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        vehicleGrid.appendChild(card);
    });
    updateDashboardStats(); // Update dashboard after vehicles render
}

addVehicleBtn.addEventListener('click', async () => {
    const licensePlate = prompt('הכנס מספר לוחית רישוי:');
    if (licensePlate) {
        const make = prompt('הכנס יצרן רכב:');
        const model = prompt('הכנס דגם רכב:');
        const color = prompt('הכנס צבע רכב:');
        const owner = prompt('הכנס שם הבעלים:');

        const newVehicle = {
            id: `vehicle-${Date.now()}`,
            licensePlate,
            make: make || 'לא ידוע',
            model: model || 'לא ידוע',
            color: color || 'לא ידוע',
            owner: owner || 'לא ידוע'
        };
        vehicles.push(newVehicle);
        renderVehicles();

        const message = `**רכב חדש נוסף:**\nלוחית רישוי: ${newVehicle.licensePlate}\nדגם: ${newVehicle.make} ${newVehicle.model}\nצבע: ${newVehicle.color}\nבעלים: ${newVehicle.owner}`;
        await sendDiscordMessage(WEBHOOK_URLS.vehicles, message, 'מערכת כלי רכב');
    }
});

vehicleGrid.addEventListener('click', async function(event) {
    if (event.target.closest('.edit-vehicle')) {
        const vehicleId = event.target.closest('button').dataset.id;
        const vehicleToEdit = vehicles.find(v => v.id === vehicleId);
        if (vehicleToEdit) {
            const updatedLicensePlate = prompt('ערוך לוחית רישוי:', vehicleToEdit.licensePlate);
            const updatedMake = prompt('ערוך יצרן:', vehicleToEdit.make);
            const updatedModel = prompt('ערוך דגם:', vehicleToEdit.model);
            const updatedColor = prompt('ערוך צבע:', vehicleToEdit.color);
            const updatedOwner = prompt('ערוך בעלים:', vehicleToEdit.owner);

            if (updatedLicensePlate !== null && updatedMake !== null && updatedModel !== null && updatedColor !== null && updatedOwner !== null) {
                vehicleToEdit.licensePlate = updatedLicensePlate;
                vehicleToEdit.make = updatedMake;
                vehicleToEdit.model = updatedModel;
                vehicleToEdit.color = updatedColor;
                vehicleToEdit.owner = updatedOwner;
                renderVehicles();

                const message = `**רכב עודכן:**\nלוחית רישוי: ${vehicleToEdit.licensePlate}\nדגם: ${vehicleToEdit.make} ${vehicleToEdit.model}\nבעלים: ${vehicleToEdit.owner}`;
                await sendDiscordMessage(WEBHOOK_URLS.vehicles, message, 'מערכת כלי רכב');
            }
        }
    } else if (event.target.closest('.delete-vehicle')) {
        const vehicleId = event.target.closest('button').dataset.id;
        if (confirm('האם אתה בטוח שברצונך למחוק רכב זה?')) {
            const deletedVehicle = vehicles.splice(vehicles.findIndex(v => v.id === vehicleId), 1)[0];
            renderVehicles();
            const message = `**רכב נמחק:**\nלוחית רישוי: ${deletedVehicle.licensePlate}\nדגם: ${deletedVehicle.make} ${deletedVehicle.model}\nבעלים: ${deletedVehicle.owner}`;
            await sendDiscordMessage(WEBHOOK_URLS.vehicles, message, 'מערכת כלי רכב');
        }
    }
});

renderVehicles();


// --- Evidence Section Logic ---
const evidenceItems = []; // In-memory storage
const evidenceTableBody = document.querySelector('#evidenceTable tbody');
const addEvidenceBtn = document.getElementById('addEvidenceBtn');

function renderEvidence() {
    evidenceTableBody.innerHTML = '';
    if (evidenceItems.length === 0) {
        evidenceTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--secondary-text-color);">אין ראיות זמינות.</td></tr>';
        return;
    }
    evidenceItems.forEach((item, index) => {
        const row = evidenceTableBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.item}</td>
            <td>${item.description}</td>
            <td>${item.caseNumber}</td>
            <td>${item.collectedDate}</td>
            <td>${item.collectedBy}</td>
            <td class="actions-cell">
                <button class="action-button edit-evidence" data-id="${item.id}" title="ערוך"><i class="fas fa-edit"></i></button>
                <button class="action-button delete-evidence" data-id="${item.id}" title="מחק"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
    });
}

addEvidenceBtn.addEventListener('click', async () => {
    const item = prompt('הכנס שם ראיה (פריט):');
    if (item) {
        const description = prompt('הכנס תיאור ראיה:');
        const caseNumber = prompt('הכנס מספר קייס:');
        const collectedBy = prompt('הכנס שם האוסף:');
        const collectedDate = new Date().toLocaleDateString('he-IL');

        const newEvidence = {
            id: `evidence-${Date.now()}`,
            item,
            description: description || 'אין תיאור',
            caseNumber: caseNumber || 'לא ידוע',
            collectedDate,
            collectedBy: collectedBy || 'לא ידוע'
        };
        evidenceItems.push(newEvidence);
        renderEvidence();

        const message = `**ראיה חדשה נוספה:**\nפריט: ${newEvidence.item}\nקייס: ${newEvidence.caseNumber}\nנאסף ע"י: ${newEvidence.collectedBy}`;
        await sendDiscordMessage(WEBHOOK_URLS.evidence, message, 'מערכת ראיות');
    }
});

evidenceTableBody.addEventListener('click', async function(event) {
    if (event.target.closest('.edit-evidence')) {
        const evidenceId = event.target.closest('button').dataset.id;
        const evidenceToEdit = evidenceItems.find(e => e.id === evidenceId);
        if (evidenceToEdit) {
            const updatedItem = prompt('ערוך פריט:', evidenceToEdit.item);
            const updatedDescription = prompt('ערוך תיאור:', evidenceToEdit.description);
            const updatedCaseNumber = prompt('ערוך מספר קייס:', evidenceToEdit.caseNumber);
            const updatedCollectedBy = prompt('ערוך נאסף ע"י:', evidenceToEdit.collectedBy);

            if (updatedItem !== null && updatedDescription !== null && updatedCaseNumber !== null && updatedCollectedBy !== null) {
                evidenceToEdit.item = updatedItem;
                evidenceToEdit.description = updatedDescription;
                evidenceToEdit.caseNumber = updatedCaseNumber;
                evidenceToEdit.collectedBy = updatedCollectedBy;
                renderEvidence();

                const message = `**ראיה עודכנה:**\nפריט: ${evidenceToEdit.item}\nקייס: ${evidenceToEdit.caseNumber}\nעודכן ע"י: ${evidenceToEdit.collectedBy}`;
                await sendDiscordMessage(WEBHOOK_URLS.evidence, message, 'מערכת ראיות');
            }
        }
    } else if (event.target.closest('.delete-evidence')) {
        const evidenceId = event.target.closest('button').dataset.id;
        if (confirm('האם אתה בטוח שברצונך למחוק ראיה זו?')) {
            const deletedEvidence = evidenceItems.splice(evidenceItems.findIndex(e => e.id === evidenceId), 1)[0];
            renderEvidence();
            const message = `**ראיה נמחקה:**\nפריט: ${deletedEvidence.item}\nקייס: ${deletedEvidence.caseNumber}`;
            await sendDiscordMessage(WEBHOOK_URLS.evidence, message, 'מערכת ראיות');
        }
    }
});

renderEvidence();


// --- Weapon Registry Section Logic ---
const weapons = []; // In-memory storage
const weaponTableBody = document.querySelector('#weaponTable tbody');
const addWeaponBtn = document.getElementById('addWeaponBtn');

function renderWeapons() {
    weaponTableBody.innerHTML = '';
    if (weapons.length === 0) {
        weaponTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--secondary-text-color);">אין כלי נשק רשומים.</td></tr>';
        return;
    }
    weapons.forEach((weapon, index) => {
        const row = weaponTableBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${weapon.model}</td>
            <td>${weapon.type}</td>
            <td>${weapon.serialNumber}</td>
            <td>${weapon.owner}</td>
            <td>${weapon.status}</td>
            <td class="actions-cell">
                <button class="action-button edit-weapon" data-id="${weapon.id}" title="ערוך"><i class="fas fa-edit"></i></button>
                <button class="action-button delete-weapon" data-id="${weapon.id}" title="מחק"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
    });
}

addWeaponBtn.addEventListener('click', async () => {
    const model = prompt('הכנס דגם נשק:');
    if (model) {
        const type = prompt('הכנס סוג נשק (לדוגמה: אקדח, רובה):');
        const serialNumber = prompt('הכנס מספר סידורי:');
        const owner = prompt('הכנס שם בעלים רשום:');
        const status = prompt('הכנס סטטוס (לדוגמה: פעיל, גנוב, הושמד):');

        const newWeapon = {
            id: `weapon-${Date.now()}`,
            model,
            type: type || 'לא ידוע',
            serialNumber: serialNumber || 'לא ידוע',
            owner: owner || 'לא ידוע',
            status: status || 'פעיל'
        };
        weapons.push(newWeapon);
        renderWeapons();

        const message = `**נשק חדש נרשם:**\nדגם: ${newWeapon.model}, סוג: ${newWeapon.type}\nמספר סידורי: ${newWeapon.serialNumber}\nבעלים: ${newWeapon.owner}, סטטוס: ${newWeapon.status}`;
        await sendDiscordMessage(WEBHOOK_URLS.weaponRegistry, message, 'מערכת רישום נשק');
    }
});

weaponTableBody.addEventListener('click', async function(event) {
    if (event.target.closest('.edit-weapon')) {
        const weaponId = event.target.closest('button').dataset.id;
        const weaponToEdit = weapons.find(w => w.id === weaponId);
        if (weaponToEdit) {
            const updatedModel = prompt('ערוך דגם:', weaponToEdit.model);
            const updatedType = prompt('ערוך סוג:', weaponToEdit.type);
            const updatedSerialNumber = prompt('ערוך מספר סידורי:', weaponToEdit.serialNumber);
            const updatedOwner = prompt('ערוך בעלים:', weaponToEdit.owner);
            const updatedStatus = prompt('ערוך סטטוס:', weaponToEdit.status);

            if (updatedModel !== null && updatedType !== null && updatedSerialNumber !== null && updatedOwner !== null && updatedStatus !== null) {
                weaponToEdit.model = updatedModel;
                weaponToEdit.type = updatedType;
                weaponToEdit.serialNumber = updatedSerialNumber;
                weaponToEdit.owner = updatedOwner;
                weaponToEdit.status = updatedStatus;
                renderWeapons();

                const message = `**נשק עודכן:**\nדגם: ${weaponToEdit.model}, סוג: ${weaponToEdit.type}\nמספר סידורי: ${weaponToEdit.serialNumber}\nבעלים: ${weaponToEdit.owner}, סטטוס: ${weaponToEdit.status}`;
                await sendDiscordMessage(WEBHOOK_URLS.weaponRegistry, message, 'מערכת רישום נשק');
            }
        }
    } else if (event.target.closest('.delete-weapon')) {
        const weaponId = event.target.closest('button').dataset.id;
        if (confirm('האם אתה בטוח שברצונך למחוק נשק זה מהרישום?')) {
            const deletedWeapon = weapons.splice(weapons.findIndex(w => w.id === weaponId), 1)[0];
            renderWeapons();
            const message = `**נשק נמחק:**\nדגם: ${deletedWeapon.model}, סוג: ${deletedWeapon.type}\nמספר סידורי: ${deletedWeapon.serialNumber}\nבעלים: ${deletedWeapon.owner}`;
            await sendDiscordMessage(WEBHOOK_URLS.weaponRegistry, message, 'מערכת רישום נשק');
        }
    }
});

renderWeapons();

// --- Staff Section Logic ---
const staffMembers = []; // In-memory storage
const staffGrid = document.getElementById('staffGrid');
const addStaffMemberBtn = document.getElementById('addStaffMemberBtn');

function renderStaffMembers() {
    staffGrid.innerHTML = '';
    if (staffMembers.length === 0) {
        staffGrid.innerHTML = '<p style="text-align: center; color: var(--secondary-text-color);">אין אנשי סגל רשומים.</p>';
        return;
    }
    staffMembers.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('card-item');
        card.innerHTML = `
            <div class="default-icon"><i class="fas fa-user-tie"></i></div>
            <strong>${member.name}</strong>
            <span>תעודת זהות: ${member.idNumber}</span>
            <span>דרגה: ${member.rank}</span>
            <span>תפקיד: ${member.role}</span>
            <div class="actions-cell">
                <button class="action-button edit-staff" data-id="${member.id}" title="ערוך"><i class="fas fa-edit"></i></button>
                <button class="action-button delete-staff" data-id="${member.id}" title="מחק"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        staffGrid.appendChild(card);
    });
}

addStaffMemberBtn.addEventListener('click', async () => {
    const name = prompt('הכנס שם מלא של איש הסגל:');
    if (name) {
        const idNumber = prompt('הכנס מספר תעודת זהות:');
        const rank = prompt('הכנס דרגה:');
        const role = prompt('הכנס תפקיד:');

        const newStaffMember = {
            id: `staff-${Date.now()}`,
            name,
            idNumber: idNumber || 'לא ידוע',
            rank: rank || 'לא ידוע',
            role: role || 'לא ידוע'
        };
        staffMembers.push(newStaffMember);
        renderStaffMembers();

        const message = `**איש סגל חדש נוסף:**\nשם: ${newStaffMember.name}\nתעודת זהות: ${newStaffMember.idNumber}\nדרגה: ${newStaffMember.rank}, תפקיד: ${newStaffMember.role}`;
        await sendDiscordMessage(WEBHOOK_URLS.staff, message, 'מערכת סגל');
    }
});

staffGrid.addEventListener('click', async function(event) {
    if (event.target.closest('.edit-staff')) {
        const memberId = event.target.closest('button').dataset.id;
        const memberToEdit = staffMembers.find(m => m.id === memberId);
        if (memberToEdit) {
            const updatedName = prompt('ערוך שם מלא:', memberToEdit.name);
            const updatedIdNumber = prompt('ערוך מספר תעודת זהות:', memberToEdit.idNumber);
            const updatedRank = prompt('ערוך דרגה:', memberToEdit.rank);
            const updatedRole = prompt('ערוך תפקיד:', memberToEdit.role);

            if (updatedName !== null && updatedIdNumber !== null && updatedRank !== null && updatedRole !== null) {
                memberToEdit.name = updatedName;
                memberToEdit.idNumber = updatedIdNumber;
                memberToEdit.rank = updatedRank;
                memberToEdit.role = updatedRole;
                renderStaffMembers();

                const message = `**איש סגל עודכן:**\nשם: ${memberToEdit.name}\nתעודת זהות: ${memberToEdit.idNumber}\nדרגה: ${memberToEdit.rank}, תפקיד: ${memberToEdit.role}`;
                await sendDiscordMessage(WEBHOOK_URLS.staff, message, 'מערכת סגל');
            }
        }
    } else if (event.target.closest('.delete-staff')) {
        const memberId = event.target.closest('button').dataset.id;
        if (confirm('האם אתה בטוח שברצונך למחוק איש סגל זה?')) {
            const deletedMember = staffMembers.splice(staffMembers.findIndex(m => m.id === memberId), 1)[0];
            renderStaffMembers();
            const message = `**איש סגל נמחק:**\nשם: ${deletedMember.name}\nתעודת זהות: ${deletedMember.idNumber}`;
            await sendDiscordMessage(WEBHOOK_URLS.staff, message, 'מערכת סגל');
        }
    }
});

renderStaffMembers();


// --- Roster Section Logic ---
const rosterEntries = []; // In-memory storage
const rosterTable = document.querySelector('#rosterTable tbody');
const addRosterEntryBtn = document.getElementById('addRosterEntryBtn');

function renderRoster() {
    rosterTable.innerHTML = '';
    if (rosterEntries.length === 0) {
        rosterTable.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--secondary-text-color);">אין כניסות ברשימת הסגל.</td></tr>';
        return;
    }
    rosterEntries.forEach((entry, index) => {
        const row = rosterTable.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.rank}</td>
            <td>${entry.status}</td>
            <td class="actions-cell">
                <button class="action-button edit-roster" data-id="${entry.id}" title="ערוך"><i class="fas fa-edit"></i></button>
                <button class="action-button delete-roster" data-id="${entry.id}" title="מחק"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
    });
}

addRosterEntryBtn.addEventListener('click', async () => {
    const name = prompt('הכנס שם של איש הסגל:');
    if (name) {
        const rank = prompt('הכנס דרגה:');
        const status = prompt('הכנס סטטוס (לדוגמה: בפעילות, במשמרת, בחופשה):');

        const newRosterEntry = {
            id: `roster-${Date.now()}`,
            name,
            rank: rank || 'לא ידוע',
            status: status || 'לא ידוע'
        };
        rosterEntries.push(newRosterEntry);
        renderRoster();

        const message = `**כניסה חדשה לרשימת סגל:**\nשם: ${newRosterEntry.name}\nדרגה: ${newRosterEntry.rank}\nסטטוס: ${newRosterEntry.status}`;
        await sendDiscordMessage(WEBHOOK_URLS.roster, message, 'מערכת רשימת סגל');
    }
});

rosterTable.addEventListener('click', async function(event) {
    if (event.target.closest('.edit-roster')) {
        const entryId = event.target.closest('button').dataset.id;
        const entryToEdit = rosterEntries.find(e => e.id === entryId);
        if (entryToEdit) {
            const updatedName = prompt('ערוך שם:', entryToEdit.name);
            const updatedRank = prompt('ערוך דרגה:', entryToEdit.rank);
            const updatedStatus = prompt('ערוך סטטוס:', entryToEdit.status);

            if (updatedName !== null && updatedRank !== null && updatedStatus !== null) {
                entryToEdit.name = updatedName;
                entryToEdit.rank = updatedRank;
                entryToEdit.status = updatedStatus;
                renderRoster();

                const message = `**כניסה לרשימת סגל עודכנה:**\nשם: ${entryToEdit.name}\nדרגה: ${entryToEdit.rank}\nסטטוס: ${entryToEdit.status}`;
                await sendDiscordMessage(WEBHOOK_URLS.roster, message, 'מערכת רשימת סגל');
            }
        }
    } else if (event.target.closest('.delete-roster')) {
        const entryId = event.target.closest('button').dataset.id;
        if (confirm('האם אתה בטוח שברצונך למחוק כניסה זו?')) {
            const deletedEntry = rosterEntries.splice(rosterEntries.findIndex(e => e.id === entryId), 1)[0];
            renderRoster();
            const message = `**כניסה לרשימת סגל נמחקה:**\nשם: ${deletedEntry.name}\nדרגה: ${deletedEntry.rank}`;
            await sendDiscordMessage(WEBHOOK_URLS.roster, message, 'מערכת רשימת סגל');
        }
    }
});

renderRoster();


// --- Codes & Commands Section Logic ---
const codesCommands = []; // In-memory storage
const codesCommandsTableBody = document.querySelector('#codesCommandsTable tbody');
const addCodeCommandBtn = document.getElementById('addCodeCommandBtn');

function renderCodesCommands() {
    codesCommandsTableBody.innerHTML = '';
    if (codesCommands.length === 0) {
        codesCommandsTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--secondary-text-color);">אין קודים או פקודות זמינות.</td></tr>';
        return;
    }
    codesCommands.forEach((item, index) => {
        const row = codesCommandsTableBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td class="actions-cell">
                <button class="action-button edit-code-command" data-id="${item.id}" title="ערוך"><i class="fas fa-edit"></i></button>
                <button class="action-button delete-code-command" data-id="${item.id}" title="מחק"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
    });
}

addCodeCommandBtn.addEventListener('click', async () => {
    const name = prompt('הכנס שם קוד/פקודה:');
    if (name) {
        const description = prompt('הכנס תיאור לקוד/פקודה:');

        const newCodeCommand = {
            id: `code-${Date.now()}`,
            name,
            description: description || 'אין תיאור'
        };
        codesCommands.push(newCodeCommand);
        renderCodesCommands();

        const message = `**קוד/פקודה חדש נוצר:**\nשם: ${newCodeCommand.name}\nתיאור: ${newCodeCommand.description}`;
        await sendDiscordMessage(WEBHOOK_URLS.codesCommands, message, 'מערכת קודים & פקודות');
    }
});

codesCommandsTableBody.addEventListener('click', async function(event) {
    if (event.target.closest('.edit-code-command')) {
        const itemId = event.target.closest('button').dataset.id;
        const itemToEdit = codesCommands.find(c => c.id === itemId);
        if (itemToEdit) {
            const updatedName = prompt('ערוך שם קוד/פקודה:', itemToEdit.name);
            const updatedDescription = prompt('ערוך תיאור:', itemToEdit.description);

            if (updatedName !== null && updatedDescription !== null) {
                itemToEdit.name = updatedName;
                itemToEdit.description = updatedDescription;
                renderCodesCommands();

                const message = `**קוד/פקודה עודכן:**\nשם: ${itemToEdit.name}\nתיאור: ${itemToEdit.description}`;
                await sendDiscordMessage(WEBHOOK_URLS.codesCommands, message, 'מערכת קודים & פקודות');
            }
        }
    } else if (event.target.closest('.delete-code-command')) {
        const itemId = event.target.closest('button').dataset.id;
        if (confirm('האם אתה בטוח שברצונך למחוק קוד/פקודה זו?')) {
            const deletedItem = codesCommands.splice(codesCommands.findIndex(c => c.id === itemId), 1)[0];
            renderCodesCommands();
            const message = `**קוד/פקודה נמחק:**\nשם: ${deletedItem.name}\nתיאור: ${deletedItem.description}`;
            await sendDiscordMessage(WEBHOOK_URLS.codesCommands, message, 'מערכת קודים & פקודות');
        }
    }
});

renderCodesCommands();


// --- Dashboard Statistics Update Logic ---
function updateDashboardStats() {
    document.getElementById('activeWarrantsCount').textContent = bolosWarrants.filter(item => item.type === 'Warrant').length;
    document.getElementById('registeredVehiclesCount').textContent = vehicles.length;
    document.getElementById('recentReportsCount').textContent = reports.length;
    document.getElementById('availableChargesCount').textContent = charges.length;
}

// Initial call to update dashboard stats when the page loads
updateDashboardStats();

// Initial state: show login screen, hide main content
document.addEventListener('DOMContentLoaded', () => {
    loginContainer.classList.remove('hidden');
    mainContent.classList.add('hidden');
});

// Firebase config + init
const firebaseConfig = {
  apiKey: "AIzaSyAAADd1lL5cgTgTxQOC8VSrjLlIsDlRyIk",
  authDomain: "policereportsystem-f23fd.firebaseapp.com",
  projectId: "policereportsystem-f23fd",
  storageBucket: "policereportsystem-f23fd.appspot.com",
  messagingSenderId: "93022201022",
  appId: "1:93022201022:web:b33be966dcac2ce8612aef"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- התחברות ---
const loginScreen = document.getElementById("loginScreen");
const tabletScreen = document.getElementById("tabletScreen");
const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const loginError = document.getElementById("loginError");
const loggedInUser = document.getElementById("loggedInUser");

const USERNAME = "officer";
const PASSWORD = "1234";

loginBtn.addEventListener("click", () => {
  const user = usernameInput.value.trim();
  const pass = passwordInput.value.trim();
  if (user === USERNAME && pass === PASSWORD) {
    loginScreen.classList.remove("active");
    tabletScreen.classList.add("active");
    loggedInUser.textContent = user;
  } else {
    loginError.textContent = "שם משתמש או סיסמה שגויים";
  }
});

// --- ניווט בין טאבים ---
const navBtns = document.querySelectorAll("nav button");
const tabs = document.querySelectorAll("main section.tab");

navBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    navBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const target = btn.getAttribute("data-target");
    tabs.forEach((tab) => {
      if (tab.id === target) tab.classList.add("active");
      else tab.classList.remove("active");
    });
  });
});

// --- שליחת טפסים ל-Firebase ---
function submitForm(event, collection, formId) {
  event.preventDefault();
  const form = event.target;
  const data = {};
  [...form.elements].forEach((el) => {
    if (el.name) data[el.name] = el.value.trim();
  });
  data.timestamp = firebase.firestore.FieldValue.serverTimestamp();
  db.collection(collection)
    .add(data)
    .then(() => {
      form.reset();
    })
    .catch((err) => {
      alert("שגיאה בשליחת הנתונים: " + err.message);
    });
}

// הצמדת אירועי שליחה לטפסים
document.getElementById("registrationForm").addEventListener("submit", (e) =>
  submitForm(e, "registration", "registrationForm")
);
document.getElementById("chaseForm").addEventListener("submit", (e) =>
  submitForm(e, "chases", "chaseForm")
);
document.getElementById("backupForm").addEventListener("submit", (e) =>
  submitForm(e, "backups", "backupForm")
);
document.getElementById("searchForm").addEventListener("submit", (e) =>
  submitForm(e, "searches", "searchForm")
);
document.getElementById("reportForm").addEventListener("submit", (e) =>
  submitForm(e, "reports", "reportForm")
);

// --- טעינת רשימות עם עדכון בזמן אמת ---
function renderList(collectionName, containerId, formatter) {
  const container = document.getElementById(containerId);
  db.collection(collectionName)
    .orderBy("timestamp", "desc")
    .onSnapshot((snapshot) => {
      container.innerHTML = "";
      if (snapshot.empty) {
        container.innerHTML = "<p>אין פריטים להצגה כרגע.</p>";
        return;
      }
      snapshot.forEach((doc) => {
        const data = doc.data();
        const div = document.createElement("div");
        div.className = "list-item";
        const ts = data.timestamp
          ? data.timestamp.toDate().toLocaleString("he-IL")
          : "---";
        div.innerHTML = formatter(data, ts);
        container.appendChild(div);
      });
    });
}

// עיצוב תצוגת פריטים
renderList("registration", "registrationList", (data, ts) => `
  <strong>שם:</strong> ${data.name} | <strong>יחידה:</strong> ${data.unit}
  <div class="timestamp">${ts}</div>
`);
renderList("chases", "chaseList", (data, ts) => `
  <strong>חשוד:</strong> ${data.suspect} | <strong>רכב:</strong> ${data.vehicle}
  <div class="timestamp">${ts}</div>
`);
renderList("backups", "backupList", (data, ts) => `
  <strong>מיקום:</strong> ${data.location} | <strong>סיבה:</strong> ${data.reason}
  <div class="timestamp">${ts}</div>
`);
renderList("searches", "searchList", (data, ts) => `
  <strong>חיפוש:</strong> ${data.query}
  <div class="timestamp">${ts}</div>
`);
renderList("reports", "reportList", (data, ts) => `
  <strong>דוח:</strong> ${data.description}
  <div class="timestamp">${ts}</div>
`);

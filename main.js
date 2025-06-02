// סיסמאות
const policePassword = "1234";
const teamPassword = "admin123";

// הצגת טפסים
function showPoliceLogin() {
  hideAll();
  document.getElementById("policeLogin").classList.remove("hidden");
}

function showTeamLogin() {
  hideAll();
  document.getElementById("teamLogin").classList.remove("hidden");
}

function enterPolice() {
  const name = document.getElementById("policeName").value;
  const pass = document.getElementById("policePass").value;
  if (pass === policePassword && name.trim() !== "") {
    hideAll();
    document.getElementById("policeSystem").classList.remove("hidden");
    showMessage(`שלום ${name}, נכנסת בהצלחה!`);
  } else {
    alert("שם או סיסמה שגויים");
  }
}

function enterTeam() {
  const pass = document.getElementById("teamPass").value;
  if (pass === teamPassword) {
    hideAll();
    document.getElementById("teamSystem").classList.remove("hidden");
  } else {
    alert("סיסמה שגויה");
  }
}

// טופס דיווח
function showReportForm() {
  document.getElementById("reportForm").classList.remove("hidden");
}

function clearReportForm() {
  document.getElementById("reportName").value = "";
  document.getElementById("reportID").value = "";
  document.getElementById("reportCrime").value = "";
  document.getElementById("reportOfficer").value = "";
  document.getElementById("reportForm").classList.add("hidden");
  showMessage("הטופס נוקה");
}

function submitReport() {
  const name = document.getElementById("reportName").value;
  const id = document.getElementById("reportID").value;
  const crime = document.getElementById("reportCrime").value;
  const officer = document.getElementById("reportOfficer").value;

  if (!name || !id || !crime || !officer) {
    alert("אנא מלא את כל השדות");
    return;
  }

  showMessage(`הדיווח נשלח: ${name}, עבירה: ${crime}`);
  clearReportForm();
}

// הודעה למשתמש
function showMessage(text) {
  document.getElementById("messageBox").textContent = text;
}

// עוזר להחביא הכל
function hideAll() {
  const all = document.querySelectorAll(".container");
  all.forEach(e => e.classList.add("hidden"));
}

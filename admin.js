// Admin PIN
const ADMIN_PIN = "1234";

// Demo "database" of users
let users = [
  { name: "John Doe", email: "john@example.com", balance: 500 },
  { name: "Jane Smith", email: "jane@example.com", balance: 1200 },
  { name: "Alice Johnson", email: "alice@example.com", balance: 300 }
];

// Demo transaction history
let transactions = [
  { date: "2026-01-10 10:00", from: "John Doe", to: "Jane Smith", amount: 100 },
  { date: "2026-01-09 15:30", from: "Alice Johnson", to: "John Doe", amount: 50 }
];

let adminLoggedIn = false;

// --- Admin Login ---
function adminLogin() {
  const pin = document.getElementById("adminPin").value;
  const error = document.getElementById("error");

  if (pin === ADMIN_PIN) {
    adminLoggedIn = true;
    document.getElementById("adminLogin").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
    showUsers();
    showTransactions();
  } else {
    error.innerText = "Incorrect PIN";
  }
}

// --- Show Users ---
function showUsers() {
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";
  users.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${u.name}</td><td>${u.email}</td><td>$${u.balance.toFixed(2)}</td>`;
    tbody.appendChild(tr);
  });
}

// --- Show Transactions ---
function showTransactions() {
  const tbody = document.querySelector("#transactionsTable tbody");
  tbody.innerHTML = "";
  transactions.forEach(tx => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${tx.date}</td><td>${tx.from}</td><td>${tx.to}</td><td>$${tx.amount.toFixed(2)}</td>`;
    tbody.appendChild(tr);
  });
}

// --- Logout ---
function logout() {
  adminLoggedIn = false;
  document.getElementById("adminPanel").classList.add("hidden");
  document.getElementById("adminLogin").classList.remove("hidden");
  document.getElementById("adminPin").value = "";
  document.getElementById("error").innerText = "";
}

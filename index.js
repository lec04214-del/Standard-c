// Initialize EmailJS
emailjs.init("YOUR_USER_ID"); // Replace with your EmailJS user ID

// Simple "database"
let users = [];
let transactions = [];
let currentUser = null;
let generatedOTP = null;

// --- Show / Hide Sections ---
function showLogin() {
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("dashboard").classList.add("hidden");
}

function showRegister() {
  document.getElementById("registerForm").classList.remove("hidden");
  document.getElementById("loginForm").classList.add("hidden");
}

function showDashboard() {
  document.getElementById("dashboard").classList.remove("hidden");
  hideAllSections();
}

function showTransfer() {
  hideAllSections();
  document.getElementById("transferSection").classList.remove("hidden");
}

function showTransactions() {
  hideAllSections();
  document.getElementById("transactionsSection").classList.remove("hidden");
}

function showSupport() {
  hideAllSections();
  document.getElementById("supportSection").classList.remove("hidden");
}

function hideAllSections() {
  document.getElementById("transferSection").classList.add("hidden");
  document.getElementById("transactionsSection").classList.add("hidden");
  document.getElementById("supportSection").classList.add("hidden");
}

// --- Login ---
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    currentUser = user;
    document.getElementById("userName").innerText = user.name;
    document.getElementById("userBalance").innerText = user.balance.toFixed(2);
    showDashboard();
    document.getElementById("loginError").innerText = "";
  } else {
    document.getElementById("loginError").innerText = "Invalid email or password";
  }
}

// --- Registration & OTP ---
function sendOTP() {
  const name = document.getElementById("rName").value;
  const email = document.getElementById("rEmail").value;
  const password = document.getElementById("rPassword").value;

  if (!name || !email || !password) {
    document.getElementById("regError").innerText = "Please fill all fields";
    return;
  }

  generatedOTP = Math.floor(100000 + Math.random() * 900000);
  alert("Your OTP: " + generatedOTP); // For demo, you can send via email in production
  document.getElementById("otpBox").classList.remove("hidden");
}

function verifyOTP() {
  const userOTP = document.getElementById("userOTP").value;
  if (parseInt(userOTP) === generatedOTP) {
    const user = {
      name: document.getElementById("rName").value,
      email: document.getElementById("rEmail").value,
      password: document.getElementById("rPassword").value,
      balance: 0
    };
    users.push(user);
    generatedOTP = null;
    alert("Registration successful!");
    showLogin();
  } else {
    document.getElementById("regError").innerText = "Invalid OTP";
  }
}

// --- Transfer ---
function transferFunds() {
  const email = document.getElementById("transferEmail").value;
  const amount = parseFloat(document.getElementById("transferAmount").value);
  const recipient = users.find(u => u.email === email);

  if (!recipient) {
    document.getElementById("transferMsg").innerText = "Recipient not found";
    return;
  }
  if (amount <= 0 || amount > currentUser.balance) {
    document.getElementById("transferMsg").innerText = "Invalid amount";
    return;
  }

  currentUser.balance -= amount;
  recipient.balance += amount;
  transactions.push({
    from: currentUser.email,
    to: recipient.email,
    amount: amount.toFixed(2),
    date: new Date().toLocaleString()
  });

  document.getElementById("userBalance").innerText = currentUser.balance.toFixed(2);
  document.getElementById("transferMsg").innerText = "Transfer successful!";
}

// --- Transactions ---
function updateTransactions() {
  const list = document.getElementById("transactionList");
  list.innerHTML = "";
  transactions.forEach(tx => {
    if (tx.from === currentUser.email || tx.to === currentUser.email) {
      const li = document.createElement("li");
      li.innerText = `${tx.date}: ${tx.from} → ${tx.to} : $${tx.amount}`;
      list.appendChild(li);
    }
  });
}

// --- Customer Support ---
function sendSupport() {
  const msg = document.getElementById("supportMsg").value;
  if (!msg) return;

  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
    user_email: currentUser.email,
    message: msg
  }).then(res => {
    document.getElementById("supportFeedback").innerText = "Message sent!";
    document.getElementById("supportMsg").value = "";
  }).catch(err => {
    document.getElementById("supportFeedback").innerText = "Failed to send!";
  });
}

// --- Logout ---
function logout() {
  currentUser = null;
  showLogin();
    }

// ====== EMAILJS INIT ======
(function(){
  emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
})();

// ========== USERS DATA ==========
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = null;
let generatedOTP = "";

// ======= REGISTRATION & LOGIN ========
function showRegister() { document.getElementById("loginForm").classList.add("hidden"); document.getElementById("registerForm").classList.remove("hidden"); }
function showLogin() { document.getElementById("registerForm").classList.add("hidden"); document.getElementById("loginForm").classList.remove("hidden"); }

// Send OTP
function sendOTP() {
  const email = document.getElementById("rEmail").value;
  const name = document.getElementById("rName").value;
  if (!email || !name) { document.getElementById("regError").textContent = "Name and email required"; return; }

  generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

  emailjs.send(
    "service_standardc",
    "template_gw847ac",
    { to_email: email, subject: "Your OTP Code", message: "Hello " + name + ", your OTP is: " + generatedOTP }
  ).then(()=> {
    alert("OTP sent to " + email);
    document.getElementById("otpBox").classList.remove("hidden");
  }).catch(err=> { console.error(err); alert("Failed to send OTP"); });
}

// Verify OTP
function verifyOTP() {
  const input = document.getElementById("userOTP").value;
  if (input === generatedOTP) {
    const newUser = {
      name: document.getElementById("rName").value,
      email: document.getElementById("rEmail").value,
      password: document.getElementById("rPassword").value,
      dob: document.getElementById("rDOB").value,
      address: document.getElementById("rAddress").value,
      balance: 0,
      transactions: [],
      messages: [],
      frozen: false
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created! You can now login.");
    showLogin();
  } else {
    alert("Incorrect OTP.");
  }
}

// Login
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    showDashboard();
  } else {
    document.getElementById("loginError").textContent = "Invalid login";
  }
}

// ========== DASHBOARD ==========
function showDashboard() {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  document.getElementById("userName").textContent = currentUser.name;
  document.getElementById("userBalance").textContent = currentUser.balance.toFixed(2);
  loadTransactions();
  hideSections();
}
function hideSections() {
  document.getElementById("transferSection").classList.add("hidden");
  document.getElementById("transactionsSection").classList.add("hidden");
  document.getElementById("supportSection").classList.add("hidden");
}

// Transfer
function showTransfer() { hideSections(); document.getElementById("transferSection").classList.remove("hidden"); }
function transferFunds() {
  const recipientEmail = document.getElementById("transferEmail").value;
  const amount = +document.getElementById("transferAmount").value;
  const recipient = users.find(u => u.email === recipientEmail);
  if (!recipient) { document.getElementById("transferMsg").textContent = "Recipient not found"; return; }
  if (currentUser.balance < amount) { document.getElementById("transferMsg").textContent = "Insufficient balance"; return; }

  currentUser.balance -= amount;
  recipient.balance += amount;

  const tx1 = { type:"Debit", amount, to:recipientEmail, date:new Date().toLocaleString() };
  const tx2 = { type:"Credit", amount, from:currentUser.email, date:new Date().toLocaleString() };
  currentUser.transactions.push(tx1);
  recipient.transactions.push(tx2);

  localStorage.setItem("users", JSON.stringify(users));
  document.getElementById("userBalance").textContent = currentUser.balance.toFixed(2);
  document.getElementById("transferMsg").textContent = "Transfer successful";

  emailjs.send("service_standardc","template_gw847ac",{ to_email: recipient.email, subject:"Funds Received", message: `You received $${amount} from ${currentUser.email}` });
}

// Transactions
function showTransactions() { hideSections(); document.getElementById("transactionsSection").classList.remove("hidden"); }
function loadTransactions() {
  const list = document.getElementById("transactionList");
  list.innerHTML = "";
  currentUser.transactions.forEach(tx => {
    list.innerHTML += `<li>${tx.date} - ${tx.type} ${tx.amount} ${tx.to ? "to "+tx.to : tx.from ? "from "+tx.from : ""}</li>`;
  });
}

// Customer Support
function showSupport() { hideSections(); document.getElementById("supportSection").classList.remove("hidden"); }
function sendSupport() {
  const msg = document.getElementById("supportMsg").value;
  currentUser.messages.push({ text: msg, date: new Date().toLocaleString(), reply:"" });
  localStorage.setItem("users", JSON.stringify(users));
  document.getElementById("supportFeedback").textContent = "Message sent to admin";
}

// Logout
function logout() { currentUser=null; document.getElementById("dashboard").classList.add("hidden"); showLogin(); }

// Sidebar toggle
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
menuBtn.addEventListener("click",()=>{ sidebar.classList.toggle("hidden"); });
window.addEventListener("click",(e)=>{ if(!sidebar.contains(e.target) && e.target!==menuBtn){ sidebar.classList.add("hidden"); }});

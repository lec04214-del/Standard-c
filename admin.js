let users = JSON.parse(localStorage.getItem("users")) || [];
const ADMIN_PIN = "9999";

function adminLogin() {
  const pin = document.getElementById("adminPin").value;
  if(pin !== ADMIN_PIN){ document.getElementById("error").textContent = "Invalid admin PIN"; return; }
  document.getElementById("adminLogin").classList.add("hidden");
  document.getElementById("adminPanel").classList.remove("hidden");
  loadUsers();
}

function loadUsers() {
  const usersDiv = document.getElementById("users");
  usersDiv.innerHTML = "";
  users.forEach((u,i)=>{
    usersDiv.innerHTML += `
      <div class="card">
        <p><strong>${u.name}</strong> (${u.email}) ${u.frozen ? "[Frozen]" : ""}</p>
        <p>Balance: $${u.balance.toFixed(2)}</p>
        <input id="amount${i}" placeholder="Amount">
        <button onclick="credit(${i})">Credit</button>
        <button onclick="debit(${i})">Debit</button>
        <button onclick="toggleFreeze(${i})">${u.frozen ? "Unfreeze" : "Freeze"}</button>
        <textarea id="reply${i}" placeholder="Reply to customer"></textarea>
        <button onclick="sendReply(${i})">Send Reply</button>
      </div>
    `;
  });
}

function credit(i){ const amt= +document.getElementById("amount"+i).value; users[i].balance+=amt; users[i].transactions.push({type:"Credit",amount:amt,date:new Date().toLocaleString()}); saveUsers(); }
function debit(i){ const amt= +document.getElementById("amount"+i).value; users[i].balance-=amt; users[i].transactions.push({type:"Debit",amount:amt,date:new Date().toLocaleString()}); saveUsers(); }
function toggleFreeze(i){ users[i].frozen = !users[i].frozen; saveUsers(); }
function sendReply(i){ const reply=document.getElementById("reply"+i).value; const lastMsg=users[i].messages.slice(-1)[0]; if(lastMsg) lastMsg.reply=reply; saveUsers(); }
function saveUsers(){ localStorage.setItem("users",JSON.stringify(users)); loadUsers(); }

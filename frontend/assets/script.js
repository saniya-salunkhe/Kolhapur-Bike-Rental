// Toggle auth buttons depending on token
function refreshAuthUI() {
  const token = localStorage.getItem("token");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const profileBtn = document.getElementById("profileBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!loginBtn) return;

  if (token) {
    loginBtn.classList.add("d-none");
    registerBtn.classList.add("d-none");
    profileBtn.classList.remove("d-none");
    logoutBtn.classList.remove("d-none");
  } else {
    loginBtn.classList.remove("d-none");
    registerBtn.classList.remove("d-none");
    profileBtn.classList.add("d-none");
    logoutBtn.classList.add("d-none");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  refreshAuthUI();

  // hook logout if present
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedBike");
    localStorage.removeItem("selectedBikeName");
    refreshAuthUI();
    location.href = "index.html";
  });
});

async function sendMessage() {
  const msg = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value
  };

  const res = await fetch("http://localhost:5000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(msg)
  });

  const result = await res.json();
  alert(result.message);
}

async function loadAdminData() {
  const token = localStorage.getItem("token");

  const users = await fetch(`${API}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const bookings = await fetch(`${API}/admin/bookings`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  document.getElementById("userCount").innerText = (await users.json()).length;
  document.getElementById("bookingCount").innerText = (await bookings.json()).length;
}

loadAdminData();

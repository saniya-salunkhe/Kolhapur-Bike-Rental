const API = "http://localhost:5000/api";

/* ================= REGISTER ================= */
async function register() {
  const data = {
    name: document.getElementById("name")?.value,
    email: document.getElementById("email")?.value,
    password: document.getElementById("password")?.value
  };

  if (!data.email || !data.password) return alert("Email and password are required!");

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json().catch(() => ({ message: "Server error" }));

  if (res.ok) {
    alert("Registration successful!");
    window.location.href = "login.html";
  } else {
    alert(result.message || "Something went wrong");
  }
}


/* ================= LOGIN ================= */
async function login() {
  const data = {
    email: document.getElementById("email")?.value,
    password: document.getElementById("password")?.value
  };

  if (!data.email || !data.password) return alert("Email and password required!");

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json().catch(() => ({ message: "Server error" }));

  if (result.token) {
    localStorage.setItem("token", result.token);
    alert("Login successful!");
    window.location.href = "bikes.html";
  } else {
    alert(result.message || "Login failed");
  }
}


/* ================= LOAD BIKES ================= */
async function loadBikes() {
  const res = await fetch(`${API}/bikes`);
  const bikes = await res.json();

  const container = document.getElementById("bikeList");
  container.innerHTML = "";

  bikes.forEach(bike => {
    container.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card shadow">
          <img src="${bike.image}" class="card-img-top" style="height:300px; object-fit:cover;">
          <div class="card-body">
            <h5>${bike.name}</h5>
            <p>₹${bike.price}/day</p>
            <button onclick="selectBike('${bike._id}', '${bike.name}')" class="btn btn-primary w-100">
              Book Now
            </button>
          </div>
        </div>
      </div>
    `;
  });
}


/* ================= SELECT BIKE ================= */
function selectBike(id, name) {
  localStorage.setItem("bikeId", id);
  localStorage.setItem("selectedBikeName", name);
  window.location.href = "booking.html";
}


/* ================= LOAD BOOKING PAGE ================= */
function loadBookingPage() {
  const bikeName = localStorage.getItem("selectedBikeName");

  if (!bikeName) {
    alert("No bike selected. Redirecting...");
    return window.location.href = "bikes.html";
  }

  document.getElementById("bikeName").innerText = bikeName;
}


/* ================= CONFIRM BOOKING ================= */
async function confirmBooking() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login to continue.");
    return window.location.href = "login.html";
  }

  const bookingData = {
    bikeId: localStorage.getItem("bikeId"),
    location: document.getElementById("location").value,
    pickupDate: document.getElementById("pickupDate").value,
    pickupTime: document.getElementById("pickupTime").value,
    dropDate: document.getElementById("dropDate").value,
    dropTime: document.getElementById("dropTime").value
  };

  if (!bookingData.bikeId) return alert("Bike ID missing. Please select a bike again.");

  const response = await fetch(`${API}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(bookingData)
  });

  const result = await response.json();
  console.log(result);

  if (response.ok) {
    alert("🎉 Booking Successful!");
    window.location.href = "bikes.html";
  } else {
    alert(result.message || "Something went wrong");
  }
}


/* ================= LOGOUT ================= */
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("bikeId");
  localStorage.removeItem("selectedBikeName");
  alert("Logged out!");
  window.location.href = "login.html";
}


/* ================= CONTACT FORM SUBMIT ================= */

const form = document.getElementById("contactForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    try {
      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Failed: " + data.message);
        return;
      }

      alert("Message Sent Successfully!");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  });
}

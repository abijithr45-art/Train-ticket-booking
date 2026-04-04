const API = "http://localhost:3000";

let selectedSeat = null;

// LOGIN
function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  fetch(`${API}/users?email=${email}&password=${password}`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        localStorage.setItem("user", JSON.stringify(data[0]));
        showPage("homePage"); // 🔥 changed
      } else {
        alert("Invalid login");
      }
    });
}

// SIGNUP
function signup() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  fetch(`${API}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(() => alert("Signup success"));
}

// LOGOUT
function logout() {
  localStorage.removeItem("user");
  showPage("loginPage");
}

// SEARCH TRAIN
function searchTrain() {
  document.getElementById("trainlist").innerHTML = `
    <div class="card">
      <option selected disabled value="">Select Train</option>
<select>
<option>AC Express</option>
<option>Amrit Bharat Express</option>
<option>Agnibina Express</option>
<option>Ahilyanagari Express</option>
<option>Ahimsa Express</option>
<option>Ajanta Express</option>
<option>Akal Takht Express</option>
<option>Ala Hazrat Express (via Ahmedabad)</option>
<option>Amaravati Express</option>
<option>Amarkantak Express</option>
<option>Amarnath Express</option>
<option>Amrapali Express</option>
<option>Amrapur Aravali Express</option>
<option>Amritha Express</option>
<option>Anantapuri Express</option>
<option>Ananya Express</option>
<option>Andaman Express</option>
<option>Andhra Pradesh Express</option>
<option>Andhra Pradesh Sampark Kranti Express</option>
<option>Anga Express</option>
<option>Antyodaya Express</option>
<option>Anuvrat AC Superfast Express</option>
<option>Aranyak Express</option>
<option>Archana Express</option>
<option>Arunachal Express</option>
<option>Arunachal AC Superfast Express</option>
<option>Ashram Express</option>
<option>Assam Mail</option>
<option>August Kranti Rajdhani Express</option>
<option>Avadh Assam Express</option>
<option>Avantika Express</option>
<option>Azad Hind Express</option>
<option>Azimabad Express</option></select>
      <button onclick="selectSeat()">Book</button>
    </div>
  `;
}

// SEAT SELECT
function selectSeat() {
  showPage("seatPage");

  let seatsDiv = document.getElementById("seats");
  seatsDiv.innerHTML = "";

  let from = document.getElementById("from").value;
  let to = document.getElementById("to").value;
  let date = document.getElementById("date").value;

  if (!date) {
    alert("Please select date first");
    showPage("searchPage");
    return;
  }

  fetch(`${API}/bookings`)
    .then(res => res.json())
    .then(bookings => {

      let filtered = bookings.filter(b =>
        b.from === from &&
        b.to === to &&
        b.date === date
      );

      let bookedSeats = filtered.map(b => Number(b.seat));

      for (let i = 1; i <= 20; i++) {
        if (bookedSeats.includes(i)) {
          seatsDiv.innerHTML += `<button disabled style="background:red;color:white">${i}</button>`;
        } else {
          seatsDiv.innerHTML += `<button onclick="chooseSeat(${i}, this)">${i}</button>`;
        }
      }
    });
}

// SELECT SEAT
function chooseSeat(seat, el) {
  selectedSeat = seat;

  document.querySelectorAll("#seats button").forEach(btn => {
    btn.classList.remove("selected");
  });

  el.classList.add("selected");
}

// PAYMENT
function goPayment() {
  showPage("paymentPage");

  setTimeout(() => {
    document.getElementById("paymentStatus").innerText = "Payment Successful ✅";

    setTimeout(() => {
      confirmTicket();
    }, 1500);

  }, 2500);
}

// CONFIRM
function confirmTicket() {
  let user = JSON.parse(localStorage.getItem("user"));

  if (!selectedSeat) {
    alert("Please select a seat first");
    return;
  }

  let booking = {
    userId: user.id,
    from: document.getElementById("from").value,
    to: document.getElementById("to").value,
    date: document.getElementById("date").value,
    train: document.getElementById("trainlist").value,
    seat: selectedSeat
  };

  fetch(`${API}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking)
  })
  .then(() => {
    showTicket(booking);
  });
}

// TICKET
function showTicket(data) {
  showPage("ticketPage");

  document.getElementById("ticketPage").innerHTML = `
    <h3>Ticket Confirmed</h3>
    <p>${data.from} → ${data.to}</p>
    <p>Date: ${data.date}</p>
    <p>Seat: ${data.seat}</p>
    <p>Train: ${data.trainlist}</p>
    <br>
    <button onclick="goHome()">Back to Home</button>
  `;
}

function goHome() {
  selectedSeat = null;
  showPage("searchPage");
}

// BOOKINGS
function showBookings() {
  let user = JSON.parse(localStorage.getItem("user"));

  fetch(`${API}/bookings?userId=${user.id}`)
    .then(res => res.json())
    .then(data => {
      let list = document.getElementById("bookingList");
      list.innerHTML = "";

      data.forEach(b => {
        list.innerHTML += `
          <p>${b.from} → ${b.to} | ${b.date} | Seat ${b.seat}</p>
        `;
      });

      showPage("bookingPage");
    });
}

// PAGE SWITCH
function showPage(page) {
  document.querySelectorAll(".card").forEach(c => c.classList.add("hidden"));
  document.getElementById(page).classList.remove("hidden");
}

// AUTO LOGIN
window.onload = function () {
  let user = localStorage.getItem("user");

  if (user) {
    showPage("homePage");
  } else {
    showPage("loginPage");
  }
};
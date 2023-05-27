const calendar = document.getElementById("calendar");
const eventForm = document.getElementById("event-form");

function createCalendar(year, month) {
  const date = new Date(year, month - 1);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const prevMonthDays = firstDay.getDay();
  const nextMonthDays = 6 - lastDay.getDay();

  let calendarHTML =
    "<table><thead><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr></thead><tbody>";

  let day = 1;
  for (let i = 0; i < 6; i++) {
    calendarHTML += "<tr>";
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < prevMonthDays) {
        const prevMonthDate = new Date(
          year,
          month - 2,
          daysInMonth - prevMonthDays + j + 1
        );
        calendarHTML += `<td class="prev-month">${prevMonthDate.getDate()}</td>`;
      } else if (day > daysInMonth) {
        const nextMonthDate = new Date(year, month, day - daysInMonth);
        calendarHTML += `<td class="next-month">${nextMonthDate.getDate()}</td>`;
        day++;
      } else {
        const currentDate = new Date(year, month - 1, day);
        calendarHTML += `<td class="current-month" data-date="${
          currentDate.toISOString().split("T")[0]
        }"><span class="day">${day}</span><div class="events"></div></td>`;
        day++;
      }
    }
    calendarHTML += "</tr>";
  }

  calendarHTML += "</tbody></table>";

  calendar.innerHTML = calendarHTML;
}

createCalendar(new Date().getFullYear(), new Date().getMonth() + 1);

eventForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const eventTitle = document.getElementById("event-title").value;
  const eventDate = document.getElementById("event-date").value;
  const eventTime = document.getElementById("event-time").value;
  const eventInput = document.getElementById("event-category");
  const eventSelectedOption =
    eventInput.options[eventInput.selectedIndex].value;
  const eventData = {
    title: eventTitle,
    date: eventDate,
    time: eventTime,
    category: eventSelectedOption,
  };
  const currentMonthDays = document.querySelectorAll(".current-month");
  currentMonthDays.forEach((day) => {
    if (day.dataset.date === eventDate) {
      const eventHTML = `<div class="event"><div class="event-time">${eventTime}</div><div class="event-title">${eventTitle}</div><div class="event-category">${eventSelectedOption}</div><button class="delete-event">X</button></div>`;
      day.querySelector(".events").insertAdjacentHTML("beforeend", eventHTML);
    }
  });
  eventForm.reset();
});

calendar.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-event")) {
    e.target.parentElement.remove();
  }
});

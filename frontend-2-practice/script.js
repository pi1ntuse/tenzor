const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

const MONTHS_GENITIVE = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

const DAYS_OF_WEEK = [
  "Воскресенье", "Понедельник", "Вторник", "Среда", 
  "Четверг", "Пятница", "Суббота"
];

const DAYS_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

const ALL_SLOTS = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", 
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"
];

const today = new Date();
today.setHours(0, 0, 0, 0);

const state = {
  currentYear: today.getFullYear(),
  currentMonth: today.getMonth(),
  selectedDay: today.getDate(),
  selectedTime: null,
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function isDatePast(year, month, day) {
  const date = new Date(year, month, day);
  return date < today;
}

function renderCalendar() {
  const datesList = document.getElementById("datesList");
  const monthYearTitle = document.getElementById("currentMonthYear");
  
  monthYearTitle.textContent = `${MONTHS[state.currentMonth]} ${state.currentYear}`;
  
  const daysInMonth = getDaysInMonth(state.currentYear, state.currentMonth);
  const firstDayOffset = getFirstDayOfMonth(state.currentYear, state.currentMonth);
  
  let html = "";
  
  for (let i = 0; i < firstDayOffset; i++) {
    html += `<li class="date date--empty"></li>`;
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(state.currentYear, state.currentMonth, day);
    const dayOfWeek = dateObj.getDay();
    
    const isPast = isDatePast(state.currentYear, state.currentMonth, day);
    
    let classes = "date";
    if (isPast) classes += " date--disabled";
    if (day === state.selectedDay) classes += " date--active";
    
    html += `
      <li>
        <button class="${classes}" data-day="${day}" ${isPast ? 'disabled' : ''}>
          <span class="date__day">${DAYS_SHORT[dayOfWeek]}</span>
          <span class="date__num">${day}</span>
        </button>
      </li>
    `;
  }
  
  datesList.innerHTML = html;
  
  const dayButtons = datesList.querySelectorAll(".date:not(.date--disabled):not(.date--empty)");
  dayButtons.forEach(btn => {
    btn.addEventListener("click", onDayClick);
  });
  
  renderTimeSlots();
  updateBottomBar();
}

function renderTimeSlots() {
  const slotsList = document.getElementById("slotsList");
  let html = "";
  
  ALL_SLOTS.forEach(time => {
    const isBusy = Math.random() < 0.2; 
    const isSelected = time === state.selectedTime;
    
    let classes = "slot";
    if (isBusy) classes += " slot--busy";
    if (isSelected) classes += " slot--active";
    
    html += `
      <li>
        <button class="${classes}" data-time="${time}" ${isBusy ? 'disabled' : ''}>
          ${time}
        </button>
      </li>
    `;
  });
  
  slotsList.innerHTML = html;
  
  const slotButtons = slotsList.querySelectorAll(".slot:not(.slot--busy)");
  slotButtons.forEach(btn => {
    btn.addEventListener("click", onTimeSlotClick);
  });
}

function onDayClick(event) {
  const day = parseInt(event.currentTarget.getAttribute("data-day"));
  
  if (state.selectedDay !== day) {
    state.selectedTime = null;
  }
  
  state.selectedDay = day;
  renderCalendar();
}

function onTimeSlotClick(event) {
  state.selectedTime = event.currentTarget.getAttribute("data-time");
  renderTimeSlots(); 
  updateBottomBar();
}

function setupMonthNavigation() {
  document.getElementById("prevMonth").addEventListener("click", () => {
    state.currentMonth--;
    if (state.currentMonth < 0) {
      state.currentMonth = 11;
      state.currentYear--;
    }
    state.selectedTime = null;
    renderCalendar();
  });

  document.getElementById("nextMonth").addEventListener("click", () => {
    state.currentMonth++;
    if (state.currentMonth > 11) {
      state.currentMonth = 0;
      state.currentYear++;
    }
    state.selectedTime = null;
    renderCalendar();
  });
}

function updateBottomBar() {
  const bottomBar = document.getElementById("bottomBar");
  
  if (!state.selectedDay) {
    bottomBar.innerHTML = `<p class="footer__text">Выберите дату и время</p>`;
    return;
  }
  
  const dateObj = new Date(state.currentYear, state.currentMonth, state.selectedDay);
  const dayOfWeekStr = DAYS_OF_WEEK[dateObj.getDay()];
  const monthStr = MONTHS_GENITIVE[state.currentMonth];
  const yearStr = state.currentYear;
  const timeStr = state.selectedTime || "время не выбрано";
  
  bottomBar.innerHTML = `
    <p class="footer__text">
      <b>${dayOfWeekStr}, ${state.selectedDay} ${monthStr} ${yearStr}</b> • ${timeStr}
    </p>
  `;
}

function init() {
  setupMonthNavigation();
  renderCalendar();
}

document.addEventListener("DOMContentLoaded", init);
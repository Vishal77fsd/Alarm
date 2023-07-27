const currTime = document.getElementById("current-time");
const setHour = document.getElementById("hours");
const setMinute = document.getElementById("minutes");
const setSecond = document.getElementById("seconds");
const setAmPm = document.getElementById("am-pm");
const setAlarmBtn = document.getElementById("submit-btn");
const alarmContainer = document.getElementById("alarms-container");

// this event will run just after the DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  setValue(1, 12, setHour);
  setValue(0, 59, setMinute);
  setValue(0, 59, setSecond);

  // run after every 1second
  setInterval(getCurrTime, 1000);

  // fetching the alarm if its present in the local storage
  fetchAlarm();
});

// if user click on set alarm button then call getInput function
setAlarmBtn.addEventListener("click", getInput);

// getinput will call when user click on Set Alarm button
function getInput(e) {
  // preventDefault is used preventing the form to submit
  e.preventDefault();
  let hour = setHour.value;
  let minute = setMinute.value;
  let second = setSecond.value;
  let amPm = setAmPm.value;

  // Converting the value in time
  const alarmTime = convertToTime(hour, minute, second, amPm);

  // setting the alarm
  setAlarm(alarmTime);
}

// function to setAlarm
function setAlarm(alarmTime, fetching = false) {
  // console.log(alarmTime);
  // console.log(getCurrTime());

  const alarmId = setInterval(() => {
    if (alarmTime === getCurrTime()) {
      window.alert("Alarm");
    }
  }, 500);

  // console.log(alarmId);
  setAlarmToDOM(alarmTime, alarmId);

  // if fetching is false the save it to the local storage
  if (!fetching) {
    saveAlarm(alarmTime);
  }
}

// saving the alarm into local storage
function saveAlarm(alarmTime) {
  const alarm = getAlarm();
  alarm.push(alarmTime);

  localStorage.setItem("alarms", JSON.stringify(alarm));
}

// setting alarm time to DOM
function setAlarmToDOM(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "d-flex", "center");
  alarm.innerHTML = `
        <div class="time">${time}</div>
        <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>
  `;

  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) =>
    deleteAlarm(e, time, intervalId)
  );

  alarmContainer.prepend(alarm);
}

// convert to time
function convertToTime(hour, minute, second, amPm) {
  return `${hour}:${minute}:${second} ${amPm}`;
}

// delete alarm
function deleteAlarm(e, alarmTime, intervalId) {
  const ele = e.target;
  clearInterval(intervalId);

  const alarm = ele.parentElement;
  deleteAlarmFromLocalStorage(alarmTime);
  alarm.remove();
}

// deleting alarm from localstorage
function deleteAlarmFromLocalStorage(time) {
  const alarm = getAlarm();
  const idx = alarm.indexOf(time);
  alarm.splice(idx, 1);
  localStorage.setItem("alarms", JSON.stringify(alarm));
}

// return the alarm array from local storage
function getAlarm() {
  let alarms = [];

  let isPresent = localStorage.getItem("alarms");
  if (isPresent) {
    alarms = JSON.parse(isPresent);
  }

  return alarms;
}

// this function will set values to the options to the element
function setValue(start, end, ele) {
  for (let i = start; i <= end; i++) {
    const optionEle = document.createElement("option");
    optionEle.value = i < 10 ? "0" + i : i;
    optionEle.innerText = i < 10 ? "0" + i : i;
    ele.appendChild(optionEle);
  }
}

// this function will return current time
function getCurrTime() {
  let time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  //   console.log(time);
  currTime.innerText = time;
  return time;
}

// fetch the alarm
function fetchAlarm() {
  // calling getAlarm -> it will get abd parse the alarm from localstorage and return it
  const alarms = getAlarm();

  alarms.forEach((alarm) => {
    setAlarm(alarm, true);
  });
}

const prev = document.getElementById("prev");
const curr = document.getElementById("curr");
const buttons = document.querySelectorAll(".buttons button");

const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");

let currentValue = "";
let previousValue = "";
let operator = null;
let soundOn = true;

/* SOUND (LOCAL SAFE) */
const clickSound = new Audio();
clickSound.src = "https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3";

function feedback() {
   if (soundOn) {
      clickSound.currentTime = 0;
      clickSound.play();
   }
   if (navigator.vibrate) navigator.vibrate(15);
}

function updateDisplay() {
   curr.innerText = currentValue || "0";
   prev.innerText = operator ? `${previousValue} ${operator}` : "";
}

function calculate() {
   const a = parseFloat(previousValue);
   const b = parseFloat(currentValue);
   if (isNaN(a) || isNaN(b)) return;

   let r;
   if (operator === "+") r = a + b;
   if (operator === "-") r = a - b;
   if (operator === "*") r = a * b;
   if (operator === "/") r = b === 0 ? "Error" : a / b;

   historyList.innerHTML =
      `<li>${previousValue} ${operator} ${currentValue} = ${r}</li>` +
      historyList.innerHTML;

   localStorage.setItem("calcHistory", historyList.innerHTML);

   currentValue = r.toString();
   previousValue = "";
   operator = null;
   updateDisplay();
}

/* BUTTON CLICK */
buttons.forEach(btn => {
   btn.onclick = () => {
      feedback();
      const v = btn.innerText;

      if (btn.classList.contains("clear")) {
         currentValue = previousValue = "";
         operator = null;
         updateDisplay();
         return;
      }

      if (btn.classList.contains("equal")) {
         calculate();
         return;
      }

      if (btn.dataset.op) {
         if (!currentValue) return;
         previousValue = currentValue;
         operator = btn.dataset.op;
         currentValue = "";
         updateDisplay();
         return;
      }

      if (v === "." && currentValue.includes(".")) return;
      currentValue += v;
      updateDisplay();
   };
});

/* KEYBOARD */
document.addEventListener("keydown", e => {
   if ("0123456789.".includes(e.key)) {
      currentValue += e.key;
      updateDisplay();
   }
   if ("+-*/".includes(e.key)) {
      previousValue = currentValue;
      operator = e.key;
      currentValue = "";
      updateDisplay();
   }
   if (e.key === "Enter") calculate();
   if (e.key === "Backspace") {
      currentValue = currentValue.slice(0, -1);
      updateDisplay();
   }
});

/* HISTORY */
document.getElementById("historyBtn").onclick = () =>
   historyPanel.classList.add("open");

document.getElementById("closeHistory").onclick = () =>
   historyPanel.classList.remove("open");

document.getElementById("clearHistory").onclick = () => {
   historyList.innerHTML = "";
   localStorage.removeItem("calcHistory");
};

/* THEME */
document.getElementById("themeBtn").onclick = () => {
   document.body.classList.toggle("light");
   document.body.classList.toggle("dark");
};

/* SOUND TOGGLE */
document.getElementById("soundBtn").onclick = (e) => {
   soundOn = !soundOn;
   e.target.innerText = soundOn ? "🔊" : "🔇";
};

/* LOAD HISTORY */
historyList.innerHTML = localStorage.getItem("calcHistory") || "";

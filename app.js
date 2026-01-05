const prev = document.getElementById("prev");
const curr = document.getElementById("curr");
const buttons = document.querySelectorAll(".buttons button");

const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");

let currentValue = "";
let previousValue = "";
let operator = null;
let soundOn = true;

/* SOUND (RESET FIX) */
const clickSound = new Audio(
   "https://assets.mixkit.co/sfx/preview/mixkit-soft-click-1126.mp3"
);

function playSound() {
   if (!soundOn) return;
   clickSound.currentTime = 0;
   clickSound.play();
   navigator.vibrate?.(15);
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

   const entry = `${previousValue} ${operator} ${currentValue} = ${r}`;
   historyList.innerHTML = `<li>${entry}</li>` + historyList.innerHTML;
   localStorage.setItem("history", historyList.innerHTML);

   currentValue = r.toString();
   previousValue = "";
   operator = null;
   updateDisplay();
}

/* BUTTON LOGIC */
buttons.forEach(btn => {
   btn.onclick = () => {
      playSound();
      const v = btn.innerText;

      if (btn.classList.contains("clear")) {
         currentValue = previousValue = "";
         operator = null;
         updateDisplay(); return;
      }

      if (btn.classList.contains("delete")) {
         currentValue = currentValue.slice(0, -1);
         updateDisplay(); return;
      }

      if (btn.classList.contains("equal")) {
         calculate(); return;
      }

      if (btn.dataset.op) {
         if (!currentValue) return;
         previousValue = currentValue;
         operator = btn.dataset.op;
         currentValue = "";
         updateDisplay(); return;
      }

      if (v === "." && currentValue.includes(".")) return;
      currentValue += v;
      updateDisplay();
   }
});

/* HISTORY */
historyBtn.onclick = () => historyPanel.classList.add("open");
closeHistory.onclick = () => historyPanel.classList.remove("open");
clearHistory.onclick = () => {
   historyList.innerHTML = "";
   localStorage.removeItem("history");
};

/* THEME */
toggleTheme.onclick = () => {
   document.body.classList.toggle("dark");
   document.body.classList.toggle("light");
};

/* SOUND TOGGLE */
toggleSound.onclick = (e) => {
   soundOn = !soundOn;
   e.target.innerText = soundOn ? "🔊" : "🔇";
};

/* LOAD HISTORY */
historyList.innerHTML = localStorage.getItem("history") || "";

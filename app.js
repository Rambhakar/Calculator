const prev = document.getElementById("prev");
const curr = document.getElementById("curr");
const buttons = document.querySelectorAll(".buttons button");
const historyList = document.getElementById("historyList");
const historyBox = document.getElementById("history");
const historyToggle = document.getElementById("historyToggle");
const clearHistoryBtn = document.getElementById("clearHistory");

let currentValue = "";
let previousValue = "";
let operator = null;

function updateDisplay() {
   curr.innerText = currentValue || "0";
   prev.innerText = operator ? `${previousValue} ${operator}` : "";
}

function saveHistory() {
   localStorage.setItem("calcHistory", historyList.innerHTML);
}

function loadHistory() {
   const saved = localStorage.getItem("calcHistory");
   if (saved) {
      historyList.innerHTML = saved;
      historyBox.classList.add("open");
   } else {
      historyList.innerHTML = '<li class="empty">No calculations yet</li>';
   }
}

function addToHistory(text) {
   historyBox.classList.add("open");

   if (historyList.querySelector(".empty")) {
      historyList.innerHTML = "";
   }

   const li = document.createElement("li");
   li.innerText = `📌 ${text}`;
   historyList.prepend(li);
   saveHistory();
}

function calculate() {
   const a = parseFloat(previousValue);
   const b = parseFloat(currentValue);
   if (isNaN(a) || isNaN(b)) return;

   let result;
   switch (operator) {
      case "+": result = a + b; break;
      case "-": result = a - b; break;
      case "*": result = a * b; break;
      case "/": result = b === 0 ? "Error" : a / b; break;
   }

   addToHistory(`${previousValue} ${operator} ${currentValue} = ${result}`);
   currentValue = result.toString();
   previousValue = "";
   operator = null;
   updateDisplay();
}

buttons.forEach(btn => {
   btn.addEventListener("click", () => {
      const value = btn.innerText;

      if (btn.classList.contains("clear")) {
         currentValue = "";
         previousValue = "";
         operator = null;
         updateDisplay();
         return;
      }

      if (btn.classList.contains("equal")) {
         calculate();
         return;
      }

      if (btn.dataset.op) {
         if (currentValue === "") return;
         if (previousValue !== "") calculate();
         operator = btn.dataset.op;
         previousValue = currentValue;
         currentValue = "";
         updateDisplay();
         return;
      }

      if (value === "." && currentValue.includes(".")) return;
      currentValue += value;
      updateDisplay();
   });
});

clearHistoryBtn.addEventListener("click", () => {
   localStorage.removeItem("calcHistory");
   historyList.innerHTML = '<li class="empty">No calculations yet</li>';
});

historyToggle.addEventListener("click", () => {
   historyBox.classList.toggle("open");
});

loadHistory();
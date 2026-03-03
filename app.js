const display = document.getElementById("display");
const keys = document.querySelector(".keys");

const state = {
  current: "0",
  previous: null,
  operator: null,
  overwrite: false,
};

const operators = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => (b === 0 ? Infinity : a / b),
};

const formatNumber = (value) => {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  const output = Number(value.toPrecision(12)).toString();
  return output.length > 11 ? Number(output).toExponential(5) : output;
};

const refreshDisplay = () => {
  display.textContent = state.current;
};

const clearActiveOperators = () => {
  document.querySelectorAll(".operator.active").forEach((button) => {
    button.classList.remove("active");
  });
};

const inputDigit = (digit) => {
  if (state.overwrite) {
    state.current = digit;
    state.overwrite = false;
    return;
  }

  if (state.current === "0") {
    state.current = digit;
    return;
  }

  state.current += digit;
};

const inputDecimal = () => {
  if (state.overwrite) {
    state.current = "0.";
    state.overwrite = false;
    return;
  }

  if (!state.current.includes(".")) {
    state.current += ".";
  }
};

const compute = () => {
  if (!state.operator || state.previous === null) {
    return;
  }

  const prev = Number(state.previous);
  const curr = Number(state.current);
  const result = operators[state.operator](prev, curr);
  state.current = formatNumber(result);
  state.previous = null;
  state.operator = null;
  state.overwrite = true;
  clearActiveOperators();
};

const chooseOperator = (operator, button) => {
  if (state.operator && !state.overwrite) {
    compute();
  }

  state.previous = state.current;
  state.operator = operator;
  state.overwrite = true;

  clearActiveOperators();
  button.classList.add("active");
};

const clear = () => {
  state.current = "0";
  state.previous = null;
  state.operator = null;
  state.overwrite = false;
  clearActiveOperators();
};

const toggleSign = () => {
  if (state.current === "0") {
    return;
  }

  state.current = state.current.startsWith("-")
    ? state.current.slice(1)
    : `-${state.current}`;
};

const percent = () => {
  state.current = formatNumber(Number(state.current) / 100);
};

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const { action, value } = button.dataset;

  switch (action) {
    case "digit":
      inputDigit(value);
      break;
    case "decimal":
      inputDecimal();
      break;
    case "operator":
      chooseOperator(value, button);
      break;
    case "equals":
      compute();
      break;
    case "clear":
      clear();
      break;
    case "sign":
      toggleSign();
      break;
    case "percent":
      percent();
      break;
    default:
      return;
  }

  refreshDisplay();
});

window.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/\d/.test(key)) {
    inputDigit(key);
  } else if (key === ".") {
    inputDecimal();
  } else if (key === "+") {
    chooseOperator("add", document.querySelector('[data-value="add"]'));
  } else if (key === "-") {
    chooseOperator("subtract", document.querySelector('[data-value="subtract"]'));
  } else if (key === "*") {
    chooseOperator("multiply", document.querySelector('[data-value="multiply"]'));
  } else if (key === "/") {
    event.preventDefault();
    chooseOperator("divide", document.querySelector('[data-value="divide"]'));
  } else if (key === "Enter" || key === "=") {
    compute();
  } else if (key === "Backspace") {
    state.current = state.current.length > 1 ? state.current.slice(0, -1) : "0";
  } else if (key.toLowerCase() === "c") {
    clear();
  } else {
    return;
  }

  refreshDisplay();
});

refreshDisplay();

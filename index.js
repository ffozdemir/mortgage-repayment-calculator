const form = document.querySelector("form");
const resultSection = document.querySelector(".result-section");
const beforeResult = document.querySelector(".before-result");
const monthlyRepayments = document.querySelector("#monthly-repayments");
const repayOverTheTerm = document.querySelector("#repay-over-the-term");
const resultDiv = document.querySelector(".result");
const mortgageAmountInputEl = document.querySelector("#mortgage-amount");
const mortgageTermInputEl = document.querySelector("#mortgage-term");
const interestInputEl = document.querySelector("#interest-rate");
const mortgageInputGroupEl = document.querySelector(".mortgage-input-group");
const mortgageTermGroupEl = document.querySelector(".mortgage-term-group");
const interestRateGroupEl = document.querySelector(".interest-rate-group");
const radioButtons = document.querySelectorAll('input[name="mortgage-type"]');

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const mortgageAmount = formData.get("mortgage-amount");
  const mortgageTerm = formData.get("mortgage-term");
  const interestRate = formData.get("interest-rate");
  const mortgageType = formData.get("mortgage-type");

  if (!mortgageAmount || !mortgageTerm || !interestRate || !mortgageType) {
    if (!mortgageAmount) {
      addErrorClass(
        mortgageInputGroupEl,
        mortgageAmountInputEl,
        "input-error-mortgage"
      );
    }
    if (!mortgageTerm) {
      addErrorClass(
        mortgageTermGroupEl,
        mortgageTermInputEl,
        "input-error-term"
      );
    }
    if (!interestRate) {
      addErrorClass(interestRateGroupEl, interestInputEl, "input-error-rate");
    }
    if (!mortgageType) {
      form.querySelector("#second-radio").nextElementSibling.textContent =
        "This field is required.";
    }
    return;
  }
  if (
    isNaN(mortgageAmount) ||
    isNaN(mortgageTerm) ||
    isNaN(interestRate) ||
    parseFloat(mortgageAmount) <= 0 ||
    parseInt(mortgageTerm) <= 0 ||
    parseFloat(interestRate) <= 0
  ) {
    return;
  }

  const data = {
    loanAmount: parseFloat(mortgageAmount),
    term: parseInt(mortgageTerm),
    rate: parseFloat(interestRate),
    type: mortgageType,
  };
  const monthlyRepayment = calculateMonthlyRepayment(data);
  const totalRepayment = calculateTotalRepayment(monthlyRepayment, data.term);

  monthlyRepayments.textContent = monthlyRepayment.toFixed(2);
  repayOverTheTerm.textContent = totalRepayment.toFixed(2);
  resultDiv.classList.remove("disactive");
  beforeResult.classList.replace("before-result", "disactive");
});

document.querySelector('button[type="reset"]').addEventListener("click", () => {
  resultDiv.classList.add("disactive");
  beforeResult.classList.replace("disactive", "before-result");
  removeErrorClass(
    mortgageInputGroupEl,
    mortgageAmountInputEl,
    "input-error-mortgage"
  );
  removeErrorClass(
    mortgageTermGroupEl,
    mortgageTermInputEl,
    "input-error-term"
  );
  removeErrorClass(interestRateGroupEl, interestInputEl, "input-error-rate");
  form.querySelector("#second-radio").nextElementSibling.textContent = "";
});

const calculateMonthlyRepayment = (data) => {
  const { loanAmount, term, rate, type } = data;
  const monthCount = term * 12;
  let monthlyInterest = rate / 100 / 12;
  let monthlyRepayment;

  switch (type) {
    case "repayment":
      const powInterest = Math.pow(1 + monthlyInterest, monthCount);
      monthlyRepayment =
        (loanAmount * monthlyInterest * powInterest) / (powInterest - 1);
      break;
    case "interest-only":
      monthlyRepayment = loanAmount * monthlyInterest;
      break;
  }
  return monthlyRepayment;
};

const calculateTotalRepayment = (monthlyRepayment, term) =>
  monthlyRepayment * term * 12;

const addErrorClass = (groupEl, inputEl, errorClass) => {
  groupEl.nextElementSibling.textContent = "This field is required.";
  inputEl.classList.add(errorClass);
  inputEl.previousElementSibling.style.color = "var(--color-white) !important";
};
const removeErrorClass = (groupEl, inputEl, errorClass) => {
  groupEl.nextElementSibling.textContent = "";
  inputEl.classList.remove(errorClass);
  inputEl.previousElementSibling.style.color = "var(--color-slate-500)";
};
mortgageAmountInputEl.addEventListener("input", () => {
  removeErrorClass(
    mortgageInputGroupEl,
    mortgageAmountInputEl,
    "input-error-mortgage"
  );
});
mortgageTermInputEl.addEventListener("input", () => {
  removeErrorClass(
    mortgageTermGroupEl,
    mortgageTermInputEl,
    "input-error-term"
  );
});
interestInputEl.addEventListener("input", () => {
  removeErrorClass(interestRateGroupEl, interestInputEl, "input-error-rate");
});

radioButtons.forEach((radio) => {
  radio.addEventListener("change", () => {
    document.querySelector("#second-radio").nextElementSibling.textContent = "";
  });
});

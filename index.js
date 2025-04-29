const form = document.querySelector("form");
const resultSection = document.querySelector(".result-section");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const mortgageAmount = formData.get("mortgage-amount");
  const mortgageTerm = formData.get("mortgage-term");
  const interestRate = formData.get("interest-rate");
  const mortgageType = formData.get("mortgage-type");
  const data = {
    loanAmount: parseFloat(mortgageAmount),
    term: parseInt(mortgageTerm),
    rate: parseFloat(interestRate),
    type: mortgageType,
  };
  const monthlyRepayment = calculateMonthlyRepayment(data);
  const totalRepayment = calculateTotalRepayment(monthlyRepayment, data.term);
  console.log(monthlyRepayment.toFixed(2), totalRepayment.toFixed(2));
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

const renderResult = () => {
  return `<div class="result">
          <h2>Your results</h2>
          <p>
            Your results are shown below based on the information you provided.
            To adjust the results, edit the form and click “calculate
            repayments” again.
          </p>
          <div class="result-card">
            <p>Your monthly repayments</p>
            <p id="monthly-repayments">£1,797.74</p>
            <hr />
            <p>Total you'll repay over the term</p>
            <p id="repay-over-the-term">£539,322.94</p>
          </div>
        </div>`;
};

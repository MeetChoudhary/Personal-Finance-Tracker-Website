let transactions = [];

document.getElementById("finance-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    const type = document.getElementById("type").value; // Income or Expense
    const mode = document.getElementById("mode").value; // Cash or Online
    const amount = parseFloat(document.getElementById("amount").value);
    const description = document.getElementById("description").value;

    // Add transaction
    const transaction = { type, mode, amount, description };
    transactions.push(transaction);
    
    // Clear form fields
    this.reset();
    
    // Update chart, percentage display, total money left, and history
    updateChart();
    displayPercentage();
    displayTotalLeft();
    displayTransactionHistory();
});

// Function to update the chart
const ctx = document.getElementById("financeChart").getContext("2d");
let financeChart;

function updateChart() {
    const cashIncome = transactions.filter(t => t.type === "income" && t.mode === "cash").reduce((acc, t) => acc + t.amount, 0);
    const onlineIncome = transactions.filter(t => t.type === "income" && t.mode === "online").reduce((acc, t) => acc + t.amount, 0);
    const cashExpense = transactions.filter(t => t.type === "expense" && t.mode === "cash").reduce((acc, t) => acc + t.amount, 0);
    const onlineExpense = transactions.filter(t => t.type === "expense" && t.mode === "online").reduce((acc, t) => acc + t.amount, 0);
    
    if (financeChart) {
        financeChart.destroy(); // Destroy previous chart instance
    }
    
    financeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Cash Income', 'Online Income', 'Cash Expense', 'Online Expense'],
            datasets: [{
                label: 'Amount (INR)',
                data: [cashIncome, onlineIncome, cashExpense, onlineExpense],
                backgroundColor: ['#2196F3', '#4CAF50', '#FF9800', '#F44336'] // Blue, Green, Orange, Red
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to calculate and display the percentage of expenses from income
function displayPercentage() {
    const income = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);

    const percentageDisplay = document.getElementById("percentage-display");
    if (income > 0) {
        const percentage = ((expense / income) * 100).toFixed(2);
        percentageDisplay.innerHTML = `Expenses are ${percentage}% of your income.`;
    } else {
        percentageDisplay.innerHTML = "No income recorded yet.";
    }
}

// Function to calculate and display the total money left for cash and online transactions
function displayTotalLeft() {
    const cashIncome = transactions.filter(t => t.type === "income" && t.mode === "cash").reduce((acc, t) => acc + t.amount, 0);
    const onlineIncome = transactions.filter(t => t.type === "income" && t.mode === "online").reduce((acc, t) => acc + t.amount, 0);
    const cashExpense = transactions.filter(t => t.type === "expense" && t.mode === "cash").reduce((acc, t) => acc + t.amount, 0);
    const onlineExpense = transactions.filter(t => t.type === "expense" && t.mode === "online").reduce((acc, t) => acc + t.amount, 0);

    const totalLeftCash = cashIncome - cashExpense; // Calculate total left after cash expenses
    const totalLeftOnline = onlineIncome - onlineExpense; // Calculate total left after online expenses

    const totalLeftDisplay = document.getElementById("total-left-display");
    totalLeftDisplay.innerHTML = `
        Total money left (Cash): ₹${totalLeftCash.toFixed(2)}<br>
        Total money left (Online): ₹${totalLeftOnline.toFixed(2)}
    `;
}

// Function to display transaction history
function displayTransactionHistory() {
    const transactionHistory = document.getElementById("transaction-history");
    transactionHistory.innerHTML = ""; // Clear previous history

    transactions.forEach((transaction, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} - ₹${transaction.amount.toFixed(2)} (${transaction.mode}) - ${transaction.description} 
        <button onclick="deleteTransaction(${index})">Delete</button>`;
        transactionHistory.appendChild(listItem);
    });
}

// Function to delete a transaction
function deleteTransaction(index) {
    transactions.splice(index, 1); // Remove the transaction from the array
    updateChart(); // Update the chart
    displayPercentage(); // Update the percentage display
    displayTotalLeft(); // Update the total money left
    displayTransactionHistory(); // Update the transaction history
}

// Contact form handling
document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
    alert("Thank you for your message!"); // Alert on form submission
    this.reset(); // Reset the form fields
});

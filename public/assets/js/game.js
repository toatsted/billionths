var portfolioWorth;
var cash;
var symbol = "";
var price;
var buyAmount = 0;
var coinId;
var transactions = [];


$(document).on("click", "#coinDropdown", (function(){

    // Getting transactions from database
    getTransactions();

    $.ajax({
        url: "https://api.coinmarketcap.com/v2/listings/",
        method: "GET"
    }).then(function (res) {
        for (let i = 0; i < res.data.length; i++) {
            $("#coinDropdown").append("<a class='dropdown-item coin' value='" + res.data[i].id + "'>" + res.data[i].symbol + "</a>")
        }
    });
}));

// Start new game by deleting user portfolio and reseting cash/portfolio worth
$(document).on("click", "#deletePortfolio", function () {

    deleteUserPortfolio();

});

// On selecting a coin from dropdown menu create request for its current price
$(document).on("click", ".coin" ,function () {
    coinId = $(this).val();
    let queryUrl = "https://api.coinmarketcap.com/v2/ticker/" + coinId + "/";

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then( function (res) {
        symbol = res.data.symbol;
        price = res.data.quotes.USD.price;

        $("#selectedCoinSymbol").html(symbol);
        $("#selectedCoinPrice").html("$" + price);

    })
})

// After selecting coin, input amount to buy (decimals allowed) and check for necessary funds
$(document).on("click", "#coinBuy", function() {
    event.preventDefault();

    if (parseFloat(buyAmount) > 0) {
        let buyPrice = Math.floor(price * buyAmount);

        if (buyPrice > cash) {
            alert("You do not have enough funds to make this purchase.")
        } else {

            cash = Math.floor(cash - buyPrice);
            // userId is undefined until we get auth working
            
            insertTransaction ();
        }
    } else {
        alert("Please enter a valid number.");
    }
})



function deleteUserPortfolio () {
    $.ajax({
        method: "DELETE",
        url: "/api/User/transactions"
    }).then(getTransactions);
}


// Our new transactions will go inside the transactionsContainer
var $transactionsContainer = $(".transactions-container");

// This function displays user transactions stored in db
function initializeRows() {
    $transactionsContainer.empty();
    var rowsToAdd = [];
    for (var i = 0; i < transactions.length; i++) {
        rowsToAdd.push(createNewRow(transactions[i]));
    }
    $transactionsContainer.prepend(rowsToAdd);
}

// This function grabs transactions from the database and updates the view
function getTransactions() {
    $.get("/api/User/transactions", function (data) {
        transactions = data;
        initializeRows();
    });
}

// This function deletes a transactions when the user clicks the delete button
function deleteTransaction (event) {
    event.stopPropagation();
    var id = $(this).data("id");
    $.ajax({
        method: "DELETE",
        url: "/api/User/transactions/" + id
    }).then(getTransactions);
}



// This function updates a transactions in our database, for use when user wants to sell X amount of coins for cash without deleting the entire entry (still not ready)
function updateTransactions(transactions) {
    $.ajax({
        method: "PUT",
        url: "/api/User/transactions",
        data: transactions
    }).then(getTransactions);
}

// This function inserts a new transactions into our database
function insertTransaction (event) {
    event.preventDefault();

    var transactions = {

        coin: symbol,

        coinId: coinId,

        purchasePrice: price,

        purchaseAmount: buyAmount
    };

    $.post("/api/User/transactions", transactions, getTransactions);
}
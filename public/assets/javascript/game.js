var portfolioWorth;
var cash;
var symbol = "";
var price;
var buyAmount = 0;
var coinId;
var holdings = [];

// On document ready, fetch coin list and create dropdown menu to select
$(document).ready(function(){
    // Getting holdings from database
    getHoldings();

    $.ajax({
        url: "https://api.coinmarketcap.com/v2/listings/",
        method: "GET"
    }).then(function (res) {
        for (let i = 0; i < res.data.length; i++) {
            $("#coinDropdown").append("<a class='dropdown-item coin' value='" + res.data[i].id + "'>" + res.data[i].symbol + "</a>")
        }
    });
});

// Start new game by deleting user portfolio and reseting cash/portfolio worth
function newGame () {

    deleteUserPortfolio();

    cash = 10000;
    portfolioWorth = 0;
}

// On selecting a coin from dropdown menu create request for its current price
$(".coin").on("click", function() {
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
$("#coinBuy").on("click", function() {
    event.preventDefault();

    if (parseFloat(buyAmount) > 0) {
        let buyPrice = Math.floor(price * buyAmount);

        if (buyPrice > cash) {
            alert("You do not have enough funds to make this purchase.")
        } else {

            cash = Math.floor(cash - buyPrice);
            // userId is undefined until we get auth working
            
            insertNewPurchase();
        }
    } else {
        alert("Please enter a valid number.");
    }
})

// Our new NewPurchase will go inside the NewPurchaseContainer
var $holdingsContainer = $(".holdings-container");

// This function displays user purchases stored in db
function initializeRows() {
    $NewPurchaseContainer.empty();
    var rowsToAdd = [];
    for (var i = 0; i < NewPurchase.length; i++) {
        rowsToAdd.push(createNewRow(NewPurchase[i]));
    }
    $NewPurchaseContainer.prepend(rowsToAdd);
}

// This function grabs NewPurchase from the database and updates the view
function getHoldings() {
    $.get("/api/holdings", function (data) {
        NewPurchase = data;
        initializeRows();
    });
}

// This function deletes a NewPurchase when the user clicks the delete button
function deleteHolding(event) {
    event.stopPropagation();
    var id = $(this).data("id");
    $.ajax({
        method: "DELETE",
        url: "/api/holdings/" + id
    }).then(getHoldings);
}

function deleteUserPortfolio(event) {

}


// This function updates a NewPurchase in our database, for use when user wants to sell X amount of coins for cash without deleting the entire entry (still not ready)
function updateNewPurchase(NewPurchase) {
    $.ajax({
        method: "PUT",
        url: "/api/holdings",
        data: NewPurchase
    }).then(getHoldings);
}

// This function inserts a new NewPurchase into our database
function insertNewPurchase(event) {
    event.preventDefault();
    var NewPurchase = {

        userId: userId,

        coin: symbol,

        coinId: coinId,

        purchasePrice: price,

        purchaseAmount: buyAmount,

        currentCash: cash
    };

    $.post("/api/holdings", NewPurchase, getHoldings);
}
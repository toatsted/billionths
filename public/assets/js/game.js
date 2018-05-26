var portfolioWorth;
var cash;
var symbol = "";
var price;
var buyAmount = 0;
var coinId;
var transactions = [];
var userLoggedIn;

// ===========================================
// Transactions page
// ===========================================
$(document).ready((function () {

    // Getting transactions from database
    getTransactions();

    $.ajax({
        url: "https://api.coinmarketcap.com/v2/ticker/?limit=10",
        method: "GET"
    }).then(function (res) {
        let cryptos = res.data;

        // Grabs the default coin (Bitcoin) and displays its information to the page
        coinId = $('#coinDropdown').val();
        $("#coinIcon").html(`<img height="32" width="32" src="https://unpkg.com/@icon/cryptocurrency-icons/icons/${cryptos[coinId].symbol.toLowerCase()}.svg" />`)
        $("#coinName").html(`<h3>Current ${cryptos[coinId].name} Price:`);
        $("#coinPrice").html(`<h4 id="cryptoPrice">$${cryptos[coinId].quotes.USD.price}`);

        // Function to update the crypto information displayed on the page depending on which crypto is selected
        $('#coinDropdown').change(function () {
            coinId = $('#coinDropdown').val();
            let queryUrl = "https://api.coinmarketcap.com/v2/ticker/" + coinId + "/";

            $("#coinIcon").html(`<img height="32" width="32" src="https://unpkg.com/@icon/cryptocurrency-icons/icons/${cryptos[coinId].symbol.toLowerCase()}.svg" />`)
            $("#coinName").html(`<h3>Current ${cryptos[coinId].name} Price:`);
            $("#coinPrice").html(`<h4 id="cryptoPrice">$${cryptos[coinId].quotes.USD.price}`);
        });


        // This function 'signs a user in' based on their entered loginID
        function userLogin(event) {
            event.preventDefault();

            let loginID = { loginID: $("#loginID").val() }
            console.log(loginID)

            // TODO:
            // For some reason a $.get didn't send the object, but a $.post does?
            $.post("/api/userLogin", loginID).then(function (res) {

                // Grabs the info of the signed in user and stores it in a variable
                userLoggedIn = res;
                $("#showLogin").html(`User signed in as email: ${userLoggedIn[0].userId}
            User money: ${userLoggedIn[0].money}`)

                return userLoggedIn
            });
        };


        // This function inserts a new transactions into our database
        function insertTransaction(event) {
            event.preventDefault();

            // console.log(cryptos[coinId])
            buyAmount = $("#buyAmount").val();

            // Determine the cost of the overall transaction
            let transactionCost = cryptos[coinId].quotes.USD.price * buyAmount

            var transactions = {
                coin: cryptos[coinId].symbol,
                coinId: coinId,
                purchasePrice: cryptos[coinId].quotes.USD.price,
                purchaseAmount: buyAmount
            };

            // Send the information to the backend if the user can afford the transaction
            if (transactionCost > userLoggedIn[0].money) {
                $("#transactionStatus").html("You cannot afford this transaction")
            } else {
                $.post("/api/User/transactions", transactions);
                $("#transactionStatus").html("Transaction complete!");
                updateMoney(transactionCost);
                
                // Updates the user money shown on the page
                userLogin(event);
            };
        };

        // Sends new user info to the backend
        function createUser(event) {
            event.preventDefault();

            let userEmail = $("#userEmail").val();
            var newUser = {
                username: "Bob",
                userId: userEmail,
                money: 10000
            };

            // Send the information to the backend
            $.post("/api/newUser", newUser);
        };

        // Button click functionality
        $("#userLogin").on('click', function (event) {
            userLogin(event);
        });
        $("#submitEmail").on('click', function (event) {
            createUser(event);
        });
        $("#insertTransaction").on('click', function (event) {
            insertTransaction(event);
        });
    });
}));


// Update the money of the "logged-in" user
function updateMoney(transactionCost) {

    let userMoney = {
        id: userLoggedIn[0].id,
        money: (userLoggedIn[0].money - transactionCost)
    };

    // $.put didn't work here for some reason
    $.post("/api/updateMoney/", userMoney);
}
// ===========================================
// ===========================================


// Start new game by deleting user portfolio and reseting cash/portfolio worth
$(document).on("click", "#deletePortfolio", function () {

    deleteUserPortfolio();

});

// After selecting coin, input amount to buy (decimals allowed) and check for necessary funds
$("#coinBuy").on("click", function () {
    event.preventDefault();

    if (parseFloat(buyAmount) > 0) {
        let buyPrice = Math.floor(price * buyAmount);

        if (buyPrice > cash) {
            alert("You do not have enough funds to make this purchase.")
        } else {

            cash = Math.floor(cash - buyPrice);
            // userId is undefined until we get auth working

            insertTransaction();
        }
    } else {
        alert("Please enter a valid number.");
    }
})



function deleteUserPortfolio() {
    $.ajax({
        method: "DELETE",
        url: "/api/User/transactions"
    }).then(getTransactions);
}


// Our new transactions will go inside the transactionsContainer
var $transactionsContainer = $(".transactions-container");

// This function displays user purchases stored in db
function initializeRows() {
    $transactionsContainer.empty();
    var rowsToAdd = [];
    // for (var i = 0; i < transactions.length; i++) {
    //     rowsToAdd.push(createNewRow(transactions[i]));
    // }
    // $transactionsContainer.prepend(rowsToAdd);
}

// This function grabs transactions from the database and updates the view
function getTransactions() {
    $.get("/api/User/transactions", function (data) {
        transactions = data;
        initializeRows();
    });
}

// This function deletes a transactions when the user clicks the delete button
function deleteTransaction(event) {
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
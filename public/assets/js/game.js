var portfolioWorth;
var cash;
var symbol = "";
var price;
var coinAmount = 0;
var coinId;
var transactions = [];
var userLoggedIn;
var wallet;





// ===========================================
// Transactions page
// ===========================================
$(document).ready((function () {

    $.ajax({
        url: "https://api.coinmarketcap.com/v2/ticker/?limit=10",
        method: "GET"
    }).then(function (res) {
        let cryptos = res.data;
        // console.log(cryptos)

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

            // TODO:
            // For some reason a $.get didn't send the object, but a $.post does?
            $.post("/api/userLogin", loginID).then(function (res) {

                // Grabs the info of the signed in user and stores it in a variable
                userLoggedIn = res;

                // Parses the user's wallet from the database
                wallet = JSON.parse(userLoggedIn[0].wallet);

                $("#showLogin").html(`User signed in as email: ${userLoggedIn[0].userId}
            User money: $${wallet.cash}`);
                console.log("User logged in: " + JSON.stringify(userLoggedIn));
            });
        };


        // This function inserts a new transactions into our database
        function buyTransaction(event) {
            event.preventDefault();
            console.log("insert transaction: " + JSON.stringify(wallet))

            coinAmount = $("#coinAmount").val();
            // Grab the symbol of the crypto being purchased
            let coinSymbol = cryptos[coinId].symbol;
            // Determine the cost of the overall transaction
            let transactionCost = cryptos[coinId].quotes.USD.price * coinAmount;

            // Send the information to the backend if the user can afford the transaction
            if (transactionCost > wallet.cash) {
                $("#transactionStatus").html("You cannot afford this transaction")
            } else {
                // Proceeds with the transaction if it's affordable

                // Checks if coin is in wallet yet, and adds it if not
                if (!wallet.hasOwnProperty(coinSymbol)) {
                    wallet[coinSymbol] = 0;
                };

                wallet[coinSymbol] = Number(wallet[coinSymbol]) + Number(coinAmount)
                var transactions = {
                    coin: cryptos[coinId].symbol,
                    coinId: coinId,
                    purchasePrice: cryptos[coinId].quotes.USD.price,
                    purchaseAmount: coinAmount,
                    // Temporary foreignKey solution
                    foreignKey: userLoggedIn[0].id
                };

                $.post("/api/User/transactions", transactions).then(function () {

                    $("#transactionStatus").html("Transaction complete!");
                    updateWallet(transactionCost);

                    // Updates the user money shown on the page
                    userLogin(event);
                });
            };
        };


        function sellTransaction(event) {
            event.preventDefault();
            console.log("selling: " + JSON.stringify(wallet))

            coinAmount = $("#coinAmount").val();
            // Grab the symbol of the crypto being purchased
            let coinSymbol = cryptos[coinId].symbol;
            // Determine the cost of the overall transaction
            let transactionCost = cryptos[coinId].quotes.USD.price * coinAmount;

            // First checks if coin is in the user's wallet, and notifies them if it is not
            if (!wallet.hasOwnProperty(coinSymbol)) {
                $("#transactionStatus").html("You do not have this type of coin in your wallet!  Please select a different coin.")
            }
            // Checks that the user is not selling more than they own
            else if(wallet[coinSymbol] < coinAmount){
                $("#transactionStatus").html("You cannot sell more coin than you have!  Please change your amount.")
            }
            else {

                wallet[coinSymbol] = Number(wallet[coinSymbol]) - Number(coinAmount)
                var transactions = {
                    coin: cryptos[coinId].symbol,
                    coinId: coinId,
                    purchasePrice: cryptos[coinId].quotes.USD.price,
                    purchaseAmount: coinAmount,
                    // Temporary foreignKey solution
                    foreignKey: userLoggedIn[0].id
                };

                $.post("/api/User/transactions", transactions).then(function () {

                    $("#transactionStatus").html("Transaction complete!");
                    
                    // *-1 so it will subtract the amount from the user's cash
                    updateWallet(transactionCost * -1);

                    // Updates the user money shown on the page
                    userLogin(event);
                });
            };
        };

        // Sends new user info to the backend
        function createUser(event) {
            event.preventDefault();

            let userEmail = $("#userEmail").val();
            var newUser = {
                username: "Bob",
                userId: userEmail,
                wallet: {
                    cash: 10000,
                    BTC: 1.3,
                    ETH: 27
                }
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
        $("#buyTransaction").on('click', function (event) {
            buyTransaction(event);
        });
        $("#sellTransaction").on('click', function (event) {
            sellTransaction(event);
        });
    });
}));


// Update the money of the "logged-in" user
function updateWallet(transactionCost) {

    // Calculates the cost of the transaction from the user (subtracts if buying, adds if selling)
    wallet.cash -= transactionCost;

    // Remove any currencies with 0 coins remaining
    for (i in wallet){
        // Skip cash so it won't ever be removed
        if (i === 'cash'){
            continue;
        }
        if (Number(wallet[i]) === 0){
            delete wallet[i];
        }
    }

    let userMoney = {
        id: userLoggedIn[0].id,
        wallet: wallet
    };

    // $.put didn't work here for some reason
    $.post("/api/updateWallet/", userMoney);
}
// ===========================================
// ===========================================
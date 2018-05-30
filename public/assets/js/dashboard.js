$(document).ready(function () {

    $(document).on('click', "#populateTransactions", getTransactions);
    $(document).on('click', ".deleteTransaction", deleteTransaction);
    $(document).on('click', "#showCash", getUser);

    var transactions = [];

    function getUser(event) {
        $.ajax({
            url: "/api/user",
            method: "GET"
        }).then(function (res) {
            console.log(res);
        });
    }

    //Get all user transactions
    function getTransactions(event) {

        $.get("/api/transactions", function (data) {
            transactions = data;
            initalizeRows();
        });
    }

    function initalizeRows() {
        $("#purchasedCryptos").empty();

        for (var i = 0; i < transactions.length; i++) {
            var purchase = {
                TransactionId: transactions[i].id,
                UserId: transactions[i].UserId,
                coin: transactions[i].coin,
                coinId: transactions[i].coinId,
                purchaseAmount: transactions[i].purchaseAmount,
                purchasePrice: transactions[i].purchasePrice,
                purchaseDate: transactions[i].createdAt
            };

            $("#purchasedCryptos").prepend("<div class='card'><div class='card-header'>" + purchase.coin + "<button class='deleteTransaction btn btn-danger float-right' value='" + purchase.TransactionId + "'>Delete</button></div><div class='card-body'><div class='row'><div class='col'><h5 class='card-title'>Purchased on: " + purchase.purchaseDate + "</h5><p class='card-text'>Amount Purchased: " + purchase.purchaseAmount + "  |  Purchase Price: $" + purchase.purchasePrice + "</p></div></div></div></div>");
        }
    }

    function deleteTransaction(event) {

        var TransactionId = $(this).val();


        console.log(TransactionId);

        $.ajax({
            url: "/api/transactions/" + TransactionId,
            type: "DELETE"
        }).then(function () {
            getTransactions();
        });
    }
});
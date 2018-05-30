$(document).ready(function () {

    $(document).on('click', "#populateTransactions", getTransactions);
    $(document).on('click', ".deleteTransaction", deleteTransaction);

    var transactions = [];



    //Get all user transactions
    function getTransactions(event) {
        event.preventDefault();

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

            $("#purchasedCryptos").prepend("<div class='card' data-userid='" + purchase.UserId + "' data-transactionid='" + purchase.TransactionId + "'><div class='card-header'>" + purchase.coin + "<button class='deleteTransaction btn btn-danger float-right'>Delete</button></div><div class='card-body'><div class='row'><div class='col'><h5 class='card-title'>Purchased on: " + purchase.purchaseDate + "</h5><p class='card-text'>Amount Purchased: " + purchase.purchaseAmount + "  |  Purchase Price: $" + purchase.purchasePrice + "</p></div></div></div></div>");
        }
    }

    function deleteTransaction(event) {
        event.stopPropagation();
        var ids = $(this);
        var TransactionId = ids.data("transactionid");
        var UserId = ids.data("userid");

        console.log(TransactionId);
        console.log(UserId);
        $.ajax({
            url: "/api/transactions/" + TransactionId,
            type: "DELETE"
        }).then(getTransactions);
    }
});
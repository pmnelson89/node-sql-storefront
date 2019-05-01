//requirements
const mysql = require("mysql");
const inquirer = require("inquirer");

//create connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost", 
    port: 3306, 
    user: "root", 
    password: "",
    database: "bamazon"
});

//connect to mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId + "\n");
    start();
});

function start() {

    showItems();
    //prompt to ask what item and quantity
    inquirer
        .prompt([
            {
                name: "whatProduct",
                type: "input",
                message: "Enter the Item ID of the product you wish to purchase."
            },
            {
                name: "howMany", 
                type: "input", 
                message: "How many would you like to buy?"
            }
        ]);
}

//function to diplay items for sale
function showItems() {
    connection.query("SELECT item_id, product_name, department_name, price FROM products", function(err, result) {
        if (err) throw err;

        console.log("Items for sale: \n");
        var productArray = [];
        for (var i = 0; i < result.length; i ++) {
            productArray.push(
                "Product: " + result[i].product_name + 
                " | Item ID: " + result[i].item_id +
                " | Department: " + result[i].department_name + 
                " | Price: " + result[i].price
            );
            console.log(productArray[i] + "\n");
        }
    });
}
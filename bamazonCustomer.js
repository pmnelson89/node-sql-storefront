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
    //display items available for purchase
    showItems();
}

//function to diplay items for sale
function showItems() {
    connection.query("SELECT item_id, product_name, department_name, price FROM products", function(err, result) {
        if (err) throw err;

        console.log(result);
    });
}
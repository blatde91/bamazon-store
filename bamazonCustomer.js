//Dependencies
//---------------------------------------
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");
//--------------------------------------

//Initialize Database
//-------------------------------------
var con = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon_db"
});
//-------------------------------------

var itemIdArray = [];

//Store opens upon SQL connection
//------------------------------------
con.connect(function(err) {
	if (err) throw err;
	displayItems();
});

//Function that will grab the information from the SQL Database
//--------------------------------------
function displayItems() {
	console.log("--------------------------------------------------");
	console.log("Welcome to Bamazon! Here is our available stock...");
	console.log("--------------------------------------------------");
	var query = con.query(
		'SELECT item_id, product_name, price FROM products', function(err, res) {
			if (err) throw err;
			prettifyResults(res);
			testArray();
			itemSelect();
		});
}
//Push all item id's into an array for validation later
//-----------------------------------------------------
function testArray() {
	var query = con.query(
		"SELECT item_id FROM products", function(err, res) {
			if (err) throw err;
			for(var i=0; i<res.length; i++) {
				itemIdArray.push(res[i].item_id);
			}
		})
}


//Using npm package console.table to make a pretty, legible table
//----------------------------------------------------------------
function prettifyResults(result) {
	var values = [];
	for (var i=0; i < result.length; i++) {
		values.push([result[i].item_id, result[i].product_name, result[i].price]);
	}
	console.table(["Item ID", "Product Name", "Price"], values);
}

//Using inquirer to allow user to select a product based on the item id
//---------------------------------------------------------------------
function itemSelect(id) {
	inquirer
	  .prompt([{
	  	type: "input",
	  	message: "Select an item you would like to purchase by typing in the desired item's ID",
	  	name: "userInput"
	  }]).then(function(answer) {
	  	console.log("User Selected ID# " + answer.userInput);
	  	if(isNaN(answer.userInput) || itemIdArray.indexOf(parseInt(answer.userInput)) === -1) {
	  		console.log("Please try again using a valid ID...");
	  		itemSelect();
	  	}
	  	else {
	  		productCall(answer.userInput);
	  	}

	  })
}

//Finding the Item in the database based on the given id
//---------------------------------------------------------
function productCall(itemID) {
	var query = con.query(
		"SELECT product_name FROM products WHERE item_id=" + itemID, function(err, res) {
			if (err) throw err;
			purchaseQuantity(res[0].product_name);
		})
}

//Asks user how many of the product they would like to buy
//----------------------------------------------------------
function purchaseQuantity(product) {
	inquirer
	  .prompt([
		  {
		  	type: "input",
		  	message: "Please input the quantity you would like to purchase",
		  	name: "quantity"
		  }
		  ]).then(function(answer) {
		  		purchaseAttempt(answer.quantity, product)
		  })
}

//Program attempts to grab as many of the unit as user requests....
//----------------------------------------------------------------
function purchaseAttempt(quantity, product) {
	con.query(
		'SELECT item_id, stock_quantity, price FROM products WHERE product_name=?', [product], function(err, res) {
			if (err) throw err;
			//Check to see if user requested quantity is available
			else if(parseFloat(quantity) > parseFloat(res[0].stock_quantity)) {
				console.log("Sorry, we only have" + res[0].stock_quantity + "units of that item left. Please select a different quantity");
				purchaseAttempt();
			}
			else {
				updateQuantity(res[0].item_id, quantity, res[0].stock_quantity);
				sumPrice(quantity, res[0].price);
			}
		})
}

//Updates SQL database to the remaining stock after purchase
//------------------------------------------------------------
function updateQuantity(itemID, quantity, stock) {
	var updatedStock = parseFloat(stock) - parseFloat(quantity);
	con.query(
		"UPDATE products SET stock_quantity" + updatedStock + " WHERE item_id=" + itemID), function(err, res) {
			if (err) throw err;
	}
}

//Gives user the total they are spending on their purchase
//----------------------------------------------------------
function sumPrice(quantity, price) {
	var purchaseTotal = parseFloat(quantity) * parseFloat(price);
	console.log("Your total comes to " + purchaseTotal + " Thanks for shopping with us!");
	wrapUp();
}

//Gives user option to continue shopping
//------------------------------------------------------

//*THIS FUNCTION WILL NOT RUN CORRECTLY*
function wrapUp() {
	inquirer
	  .prompt([
	  {
	  	type: "confirm",
	  	message: "Continue shopping?",
	  	name: "confirm"
	  }
	  ]).then(function(answer) {
	  	console.log("what the freeek");
	  	if (answer.confirm) { 
	  		displayItems();
	  	}
	  	else {
	  		endIt();
	  	}
	  })
}

//Closes connection
//----------------------------
function endIt() {
	console.log("Thanks for shopping with us!")
	con.end();
}



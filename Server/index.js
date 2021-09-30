const express = require("express");
const cors = require("cors");
const session = require("express-session");


// Import DB
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    // database: 'dbsmarketplace',
    database: 'DBSMarketplace',
    password: 'password',
    port: 5432,
  });

/** ------------------------------------- EXPRESS ------------------------------------- */

const app = express();
app.use(express.json());
app.use(cors({
    origin: `http://localhost:4000`,
    credentials: true
}));
app.use(
    session({
        secret: `dbs-secret`,
        resave:true,
        saveUninitialized: true,
    })
);

/** ------------------------------------- AUTHENTICATION ------------------------------------- */

// GET: Check user ## UNCOMPLETE
app.post("/checkuser", async (req, res) => {
    try {
        const { username, password } = req?.body;

        // SQL COMMAND: SELECT * FROM <table>
        const searchCount = await pool.query("SELECT COUNT(*) FROM customer WHERE username = $1 AND password = $2", [username, password]);
        
        const { count } = searchCount.rows[0];

        if (parseInt(count) > 0){
            // This is bad, passing password to the front
            const user = await pool.query("SELECT * FROM customer WHERE username = $1 AND password = $2", [username, password]);

            res.json(user.rows[0]) 
        } else {
            res.json(false) // Send false if count = 0
        }

    } catch (error) {
        console.log(error.message)
    }
});

/** ------------------------------------- ROUTES ------------------------------------- */

// POST: Login user


// GET: Logout user

// GET: Get logged in User

// GET: All Products
app.get("/product", async (req, res) => {
    try {

        // SQL COMMAND: SELECT * FROM <table>
        const allProducts = await pool.query("SELECT * FROM product");

        res.json(allProducts.rows) // Only return the first entry from res["rows"] instead of returning everything

    } catch (error) {
        console.log(error.message)
    }
});

// GET: All Categories
app.get("/category", async (req, res) => {
    try {

        // SQL COMMAND: SELECT * FROM <table>
        const allCategories = await pool.query("SELECT * FROM category");

        res.json(allCategories.rows) // Only return the first entry from res["rows"] instead of returning everything

    } catch (error) {
        console.log(error.message)
    }
});

// GET: Return a list of all products from the OrderItem table
app.get("/orderitem", async (req, res) => {
    try {

        // SQL COMMAND: SELECT * FROM <table>
        const allOrderItems = await pool.query("SELECT * FROM order_item");

        res.json(allOrderItems.rows) // Only return the first entry from res["rows"] instead of returning everything

    } catch (error) {
        console.log(error.message)
    }
});

// GET: Insert products added from frontend cart into database
app.get("/add/:id", async (req, res) => {
    try {

        const { id } = req.params;
               
        // SQL COMMAND: INSERT INTO table2 SELECT * FROM table1 WHERE condition; <--- jason: need help on this, not very familar w sql
        const todo = await pool.query("INSERT INTO order_item (product_id, order_id, product_qty, total_price) SELECT <somethinghere> FROM product WHERE id = $id", [id]);

        res.json(todo.rows[0]);

    } catch (error) {
        console.log(error.message)
    }
});

// POST: Delete from the OrderItem table

// Need a method to check if user is logged in


/** SERVER LISTEN AT PORT 4000 */

app.listen(4000, () => {
    console.log('Server has started on port 4000')
});
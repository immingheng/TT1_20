const express = require("express");
const cors = require("cors");
const session = require("express-session");

// Import DB
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'DBSMarketplace',
    password: 'password',
    port: 5432,
  })
// const pool = require("./app/config/db.config")
// import pool from "./app/config"
console.log(pool)

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

// POST: Insert products added from frontend cart into database

// POST: Delete from the OrderItem table

// Need a method to check if user is logged in


/** SERVER LISTEN AT PORT 4000 */

app.listen(4000, () => {
    console.log('Server has started on port 4000')
});
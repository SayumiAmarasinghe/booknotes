import express from "express";
import bodyParser from  "body-parser";
import pg from "pg";

const app = express();
const port = 3000;



const db = new pg.Client ( {
    user:"postgres",
    host:"localhost",
    database: "book",
    password: "cupcake",
    port: 5432,
})
db.connect();

app.use(bodyParser.urlencoded({extended: true}));
//if you need to use static files for images , you can use express.static()
app.use(express.static("public"));

//GET 
app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM books");
        const books = result.rows;
       
        res.render("index.ejs", {books});
    } catch (error) {
        console.error(error);
        if (error.response && err.response.status === 404) {
            console.log('Cover not found for ISBN:');
    }   else {
            console.error('Error:', err.message);
    }
    }

});

//GET: rating page, so that entries are sorted by rating 
app.get("/rating", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM books ORDER BY rating DESC");
        const books = result.rows;
        res.render("rating.ejs", {books});
    } catch (error) {
        console.error('Error loading the rating file: ', err.message);
    }
});

//GET: alphabetical page, so entries are sorted by title 
app.get("/alpha", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM books ORDER BY title ASC");
        const books = result.rows;
        res.render("alpha.ejs", {books});
    }catch (error) {
        console.error('Error loading the alpha file: ', err.message);
    }
})

//GET: get a new post 
app.get("/add", (req, res) => {
    res.render("add.ejs");
})
//POST: post a new post 
app.post("/add", async (req, res) => {
    try {
        const {title, author, isbn, content, rating} = req.body;
        //const id = 15;
        await db.query("INSERT INTO books (title, author, isbn, content, rating ) VALUES ($1, $2, $3, $4, $5)",
            [title, author, isbn, content, rating]);
            res.redirect("/");
        } catch (error) {
            console.log(error);
            console.error("Error with adding a new post");
        }
});

//GET: get an edited post
app.get("/edit/:id", async (req, res) => {
    const {id}  = req.params;
    const result = await(db.query("SELECT * FROM books WHERE id = $1", [id]));
    const book = result.rows[0];
    res.render("edit.ejs", {book});
});

//POST: edit a post
app.post("/edit/:id", async (req, res) => {
    try {
        const {title, author, isbn, content, rating} = req.body;
        const id = req.params.id;
        await db.query("UPDATE books SET title = $1, author = $2, isbn = $3, content = $4, rating = $5 WHERE id = $6",
        [title, author, isbn, content, rating, id]);

        res.redirect("/");
    }catch (error) {
        console.log(error);
        console.error("Error with editing a new post");
        }
    
});
//DELETE: delete a post
app.post("/delete/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await db.query("DELETE FROM books WHERE id = $1", [id]);
        res.redirect("/");
    }
    catch(error) {
        console.log(error);
        console.error("Error with deleting a post");
    }
});








app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);

});
import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('public'));

var posts=[];
// add lorem ipsum to post array. Title is lorem ipsum and text is lorem ipsum

posts.push({
    title: "lorem ipsum",
    text: "lorem ipsum",
    id: "lorem"
});

posts.push({
    title: "Spiderman",
    text: "batman",
    id:"batman"
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//home
app.get("/", (req, res) => {
    //Step 1 - Make the get route work and render the index.ejs file.
    res.render("index", { posts: posts });
});

app.post("/delete_posts/:id", (req, res) => {
    // Get the id from the request parameters
    const id = req.params.id;
    // Find the index of the post with the corresponding id
    const index = posts.findIndex(post => post.id === id);
    // If the post was found, delete it from the posts array
    if (index !== -1) {
        posts.splice(index, 1);
    }
    // Redirect to the home page
    res.redirect("/");
});

//post display
app.get("/post/:id", (req, res) => {
    // Get the id from the request parameters
    const id = req.params.id;
    // Find the post with the corresponding id
    const post = posts.find(post => post.id === id);
    // If the post was found, render it, otherwise render a 404 page
    if (post) {
        res.render("post", { post: post });
    } else {
        res.status(404).send('Post not found');
    }
});

app.post("/edit_posts", (req, res) => {
    // Get the post data from the request body
    const { title, text, id: newId } = req.body;

    // Find the post with the corresponding oldId
    const post = posts.find(post => post.id === req.body.oldId);

    // Check if the newId is already in use by another post
    const idExists = posts.some(post => post.id === newId);

    // If the post was found and the newId is not in use (or it's the same as the oldId), update its id, title, and text
    if (post && (!idExists || req.body.oldId === newId)) {
        post.id = newId;
        post.title = title;
        post.text = text;
    }
    // Redirect to the home page
    res.redirect("/");
});

app.get("/edit_posts/:id", (req, res) => {
    // Get the id from the request parameters
    const id = req.params.id;
    // Find the post with the corresponding id
    const post = posts.find(post => post.id === id);
    // Get the list of ids
    const ids = posts.map(post => post.id);
    // If the post was found, render the edit_posts.ejs file and pass the post and ids to it
    if (post) {
        res.render("edit_posts", { post: post, ids: ids });
    } else {
        res.status(404).send('Post not found');
    }
});

//make post
app.get("/create", (req, res) => {
    // Render the post_creator.ejs file
    const ids = posts.map(post => post.id);
    res.render("post_creator", { ids: ids });
});

app.post("/post_creator", (req, res) => {
    // Get the post data from the request body
    const post = req.body;

    // Add the post to the posts array
    posts.push(post);

    // Redirect to the home page
    res.redirect("/");
});

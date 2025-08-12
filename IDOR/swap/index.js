// what to build? 
// an application that retrieves document based on id. 

const express = require("express")
const bcrypt = require("bcrypt")
const session = require("express-session")
const bodyParser = require("body-parser")
const app = express()
const PORT = 3000;
const users = [];
let uid = 0;
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret: "cat",
    resave: false, 
    saveUninitialized: false
}));

function isAuthenticated(req, res, next){
    if (req.session.user){
        return next();
    }
    res.redirect("/login");
}

app.get("/", (req,res,) => {
    res.send(`<h2>Welcome</h2>
              <p><a href="/register">Register</a> | <a href="/login">Login</a> | <a href="/dashboard">Dashboard</a></p>`);
});

app.get("/register", (req, res) => {
    res.send(`
        <form method="POST" action="/register">
            <input name="username" placeholder="Username" required />
            <input name="password" type="password" placeholder="Password" required />
            <button type="submit">Register</button>
        </form>
    `);
});

app.post("/register", async (req, res) => {
    uid++;
    const {username, password} = req.body;
    const hasedPassword = await bcrypt.hash(password, 10);
    users.push({uid, username, password: hasedPassword});        // pushes the username and hased password in the local storage that is users objects
    res.send("user registered! <a href='/login'>Login</a>") 
});

app.get("/login", (req, res) => {
    res.send(`
        <form method="POST" action="/login">
            <input name="username" placeholder="Username" required />
            <input name="password" type="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    `);
});

app.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const user = users.find(u => u.username === username); // finds the entered username in the local storage that is users object
    if (user && await bcrypt.compare(password, user.password)){
        req.session.user = user.username;
        req.session.uid = user.uid;
        return res.redirect("/dashboard");
    }
    res.send("invlid creds <a href='/login'>Try again</a>")
});

app.get("/dashboard", isAuthenticated, (req,res) => {
    res.send(`
        <h2>Dashboard</h2>
        <p>Hello, ${req.session.user}</p>
        <a href="/logout">Logout</a>
        <br><br><br>
        <a href="/secret?id=${req.session.uid}">View your keys</a>
        <p></p>
        `)
});

app.get("/secret", (req, res) => {
    const searchTerm = req.query.id;
    console.log(searchTerm)
    res.download(__dirname+`/flag/${searchTerm}`)
});

app.get("/logout", (req,res)=>{
    req.session.destroy(err => {
        res.redirect("/")
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

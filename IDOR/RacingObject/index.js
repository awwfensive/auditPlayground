const express = require("express")
const bcrypt = require("bcrypt")
const session = require("express-session")
const bodyParser = require("body-parser")
const { createHash } = require('node:crypto');
const fs = require("fs");
const path = require("path");
const multer = require("multer")

function md5(content){
    return createHash('md5').update(content).digest('hex');
}

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads')
    },
    filename: function (req, file, cb){
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname);
        filename = md5(name)+ext
        cb(null, filename);
    }
})
const upload = multer({ storage: storage });

const app = express()
const PORT = 3000;
const users = [];
let uid = 0;
const userFiles = {}; // Maps userId to array of their files
const fileOwnership = {}; // Maps filename to userId

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
    const publicId = md5(uid.toString());
    const {username, password} = req.body;
    const hasedPassword = await bcrypt.hash(password, 10);
    users.push({uid, publicId, username, password: hasedPassword});        // pushes the username and hased password in the local storage that is users objects
    userFiles[publicId] = []; // Initialize empty file array for new user
    uid++;
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
        req.session.uid = user.publicId;
        return res.redirect("/dashboard");
    }
    res.send("invlid creds <a href='/login'>Try again</a>")
});

app.get("/dashboard", isAuthenticated, (req,res) => {
    console.log(req.body);
    console.log(req.file);
    
    // Get user's uploaded files
    const userFileList = userFiles[req.session.uid] || [];
    let fileListHtml = '<h3>Your Uploaded Files:</h3>';
    if (userFileList.length === 0) {
        fileListHtml += '<p>No files uploaded yet.</p>';
    } else {
        fileListHtml += '<ul>';
        userFileList.forEach(filename => {
            fileListHtml += `<li><a href="/secret?id=${filename}">${filename}</a></li>`;
        });
        fileListHtml += '</ul>';
    }
    
    res.send(`
        <h2>Dashboard</h2>
        <p>Hello, ${req.session.user}</p>
        <h2>Upload a File</h2>
         <form action="/upload" method="POST" enctype="multipart/form-data">
        <input type="file" name="doc" required>
        <button type="submit">Upload</button>
         </form>
        ${fileListHtml}
        <a href="/logout">Logout</a>
        <p></p>
        `)
});

app.post("/upload", upload.single("doc"), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    
    if (req.file) {
        const filename = req.file.filename;
        const userId = req.session.uid;
        
        console.log(`File ${filename} uploaded, but ownership not yet assigned...`);
        
        // Simulate processing delay - VULNERABLE WINDOW for race condition
        setTimeout(() => {
            console.log(`Assigning ownership of ${filename} to user ${userId} after delay`);
            fileOwnership[filename] = userId;
            
            // Add file to user's file list
            if (!userFiles[userId]) {
                userFiles[userId] = [];
            }
            userFiles[userId].push(filename);
        }, 2000); // 2 second delay before ownership is assigned
        
        req.session.userfile = filename;
    }
    
    res.redirect("/dashboard")
});

app.get("/secret", isAuthenticated, (req, res) => {
    const searchTerm = req.query.id;
    const currentUserId = req.session.uid;
    
    console.log(`User ${req.session.user} (${currentUserId}) requesting file: ${searchTerm}`);
    
    if (!searchTerm) {
        return res.send(`Hi ${req.session.user}, no file ID provided <br>
            <a href="/dashboard">Dashboard</a>`);
    }
    
    // Check if file exists
    const filePath = path.join(__dirname, 'uploads', searchTerm);
    if (!fs.existsSync(filePath)) {
        return res.send(`Hi ${req.session.user}, file not found <br>
            <a href="/dashboard">Dashboard</a>`);
    }
    
    // VULNERABLE: Check if user owns this file - but allow access if no owner is set yet!
    const fileOwner = fileOwnership[searchTerm];
    if (fileOwner && fileOwner !== currentUserId) {
        return res.send(`Hi ${req.session.user}, you don't have permission to access this file <br>
            <a href="/dashboard">Dashboard</a>`);
    }
    
    // RACE CONDITION: If no owner is set yet (undefined), allow access!
    if (!fileOwner) {
        console.log(`WARNING: File ${searchTerm} has no owner yet - allowing access during race condition window!`);
    }
    
    console.log(`Access granted for user ${req.session.user} to file ${searchTerm}`);
    res.download(filePath);
});

app.get("/logout", (req,res)=>{
    req.session.destroy(err => {
        res.redirect("/")
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

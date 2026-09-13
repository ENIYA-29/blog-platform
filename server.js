const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
    .connect("mongodb://127.0.0.1:27017/blogsphere")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error.message);
    });


// ================================
// USER MODEL
// ================================

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", userSchema);


// ================================
// POST MODEL
// ================================

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    comments: [
        {
            author: String,
            text: String
        }
    ]
});

const Post = mongoose.model("Post", postSchema);


// ================================
// HOME API
// ================================

app.get("/", (req, res) => {
    res.json({
        message: "BlogSphere Backend API is running"
    });
});


// ================================
// GET ALL POSTS
// ================================

app.get("/api/posts", async (req, res) => {

    try {

        const posts = await Post.find();

        res.json(posts);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching posts"
        });

    }

});


// ================================
// CREATE POST
// ================================

app.post("/api/posts", async (req, res) => {

    try {

        const post = new Post(req.body);

        const savedPost = await post.save();

        res.status(201).json(savedPost);

    } catch (error) {

        res.status(400).json({
            message: "Error creating post",
            error: error.message
        });

    }

});


// ================================
// REGISTER USER
// ================================

app.post("/api/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            });

        }

        const user = new User({
            name,
            email,
            password
        });

        const savedUser = await user.save();

        res.status(201).json({
            message: "Registration successful",
            user: savedUser
        });

    } catch (error) {

        res.status(400).json({
            message: "Registration failed",
            error: error.message
        });

    }

});


// ================================
// LOGIN USER
// ================================

app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({
            email,
            password
        });

        if (!user) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Login failed"
        });

    }

});


// ================================
// START SERVER
// ================================

app.listen(PORT, () => {

    console.log(
        `BlogSphere server running on http://localhost:${PORT}`
    );

});
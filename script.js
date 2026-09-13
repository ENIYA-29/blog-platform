// ================================
// BLOGSPHERE - BLOG PLATFORM
// ================================

// Sample posts
let posts = JSON.parse(localStorage.getItem("blogPosts")) || [
    {
        id: 1,
        title: "Welcome to BlogSphere",
        content: "This is our first blog post. Share your ideas and connect with other users.",
        author: "Admin",
        comments: [
            {
                author: "Guest",
                text: "Great first post!"
            }
        ]
    },
    {
        id: 2,
        title: "Learning Web Development",
        content: "HTML, CSS and JavaScript are important technologies for building modern websites.",
        author: "Admin",
        comments: []
    }
];

let currentUser = JSON.parse(localStorage.getItem("blogUser")) || null;


// ================================
// SAVE POSTS
// ================================

function savePosts() {
    localStorage.setItem("blogPosts", JSON.stringify(posts));
}


// ================================
// SHOW SECTION
// ================================

function showSection(sectionId) {

    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    const section = document.getElementById(sectionId);

    if (section) {
        section.classList.add("active");
    }

    if (sectionId === "posts") {
        displayPosts();
    }
}


// ================================
// DISPLAY POSTS
// ================================

function displayPosts() {

    const postList = document.getElementById("postList");

    if (!postList) {
        return;
    }

    postList.innerHTML = "";

    if (posts.length === 0) {

        postList.innerHTML = `
            <p>No blog posts available.</p>
        `;

        return;
    }


    posts.forEach(post => {

        const postCard = document.createElement("div");

        postCard.className = "post-card";

        let commentsHTML = "";

        if (post.comments && post.comments.length > 0) {

            commentsHTML = post.comments.map(comment => `
                <div class="comment">
                    <strong>${escapeHTML(comment.author)}</strong>
                    <p>${escapeHTML(comment.text)}</p>
                </div>
            `).join("");

        } else {

            commentsHTML = `
                <p>No comments yet.</p>
            `;
        }


        postCard.innerHTML = `

            <h3>${escapeHTML(post.title)}</h3>

            <div class="post-meta">
                Posted by ${escapeHTML(post.author)}
            </div>

            <p>
                ${escapeHTML(post.content)}
            </p>

            <div class="post-actions">

                <button onclick="addComment(${post.id})">
                    Add Comment
                </button>

                <button
                    class="edit-btn"
                    onclick="editPost(${post.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deletePost(${post.id})">
                    Delete
                </button>

            </div>

            <div class="comments">

                <h4>Comments</h4>

                ${commentsHTML}

            </div>
        `;


        postList.appendChild(postCard);

    });
}


// ================================
// CREATE POST
// ================================

document.getElementById("postForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const title =
        document.getElementById("postTitle").value.trim();

    const content =
        document.getElementById("postContent").value.trim();


    if (!title || !content) {

        alert("Please enter both title and content.");

        return;
    }


    const author =
        currentUser ? currentUser.name : "Guest";


    const newPost = {

        id: Date.now(),

        title: title,

        content: content,

        author: author,

        comments: []

    };


    posts.unshift(newPost);

    savePosts();

    this.reset();

    alert("Blog post published successfully!");

    showSection("posts");

});


// ================================
// EDIT POST
// ================================

function editPost(id) {

    const post = posts.find(post => post.id === id);

    if (!post) {
        return;
    }


    const newTitle =
        prompt("Enter new title:", post.title);

    if (newTitle === null) {
        return;
    }


    const newContent =
        prompt("Enter new content:", post.content);

    if (newContent === null) {
        return;
    }


    if (!newTitle.trim() || !newContent.trim()) {

        alert("Title and content cannot be empty.");

        return;
    }


    post.title = newTitle.trim();

    post.content = newContent.trim();


    savePosts();

    displayPosts();

    alert("Post updated successfully!");
}


// ================================
// DELETE POST
// ================================

function deletePost(id) {

    const confirmation =
        confirm("Are you sure you want to delete this post?");


    if (!confirmation) {
        return;
    }


    posts = posts.filter(post => post.id !== id);

    savePosts();

    displayPosts();

    alert("Post deleted successfully!");
}


// ================================
// ADD COMMENT
// ================================

function addComment(id) {

    const post = posts.find(post => post.id === id);

    if (!post) {
        return;
    }


    const commentText =
        prompt("Enter your comment:");


    if (commentText === null) {
        return;
    }


    if (!commentText.trim()) {

        alert("Comment cannot be empty.");

        return;
    }


    const author =
        currentUser ? currentUser.name : "Guest";


    post.comments.push({

        author: author,

        text: commentText.trim()

    });


    savePosts();

    displayPosts();

    alert("Comment added successfully!");
}


// ================================
// REGISTER
// ================================

document.getElementById("registerForm").addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value;


    if (!name || !email || !password) {

        alert("Please fill all fields.");

        return;
    }


    const user = {

        name: name,

        email: email,

        password: password

    };


    localStorage.setItem(
        "registeredUser",
        JSON.stringify(user)
    );


    alert("Registration successful! Please login.");

    this.reset();

    showSection("login");

});


// ================================
// LOGIN
// ================================

document.getElementById("loginForm").addEventListener("submit", function(event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;


    const registeredUser =
        JSON.parse(localStorage.getItem("registeredUser"));


    if (!registeredUser) {

        alert("No registered account found. Please register first.");

        showSection("register");

        return;
    }


    if (
        email === registeredUser.email &&
        password === registeredUser.password
    ) {

        currentUser = {

            name: registeredUser.name,

            email: registeredUser.email

        };


        localStorage.setItem(
            "blogUser",
            JSON.stringify(currentUser)
        );


        alert("Login successful!");

        this.reset();

        showSection("posts");

    } else {

        alert("Invalid email or password.");

    }

});


// ================================
// ESCAPE HTML
// ================================

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ================================
// INITIAL LOAD
// ================================

displayPosts();
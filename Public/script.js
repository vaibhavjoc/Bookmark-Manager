function moveToSignup() {
    document.getElementById("signup-container").style.display = "block";
    document.getElementById("signin-container").style.display = "none";
    document.getElementById("bookmarks-container").style.display = "none";
}
function moveToSignin() {
    document.getElementById("signup-container").style.display = "none";
    document.getElementById("signin-container").style.display = "block";
    document.getElementById("bookmarks-container").style.display = "none";
}
function showBookmarks() {
    document.getElementById("signup-container").style.display = "none";
    document.getElementById("signin-container").style.display = "none";
    document.getElementById("bookmarks-container").style.display = "block";

    getBookmarks();
}

async function signup() {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    try {
        const response = await axios.post("http://localhost:3000/signup", {
            email,
            password
        });

        alert(response.data.message);

        if (response.data.message === "You are signed up successfully") {
            moveToSignin()
        }
    } catch (error) {
        console.error("Error while signing up:", error);
    }

    document.getElementById("signup-email").value = "";
    document.getElementById("signup-password").value = "";

}

async function signin() {
    const email = document.getElementById("signin-email").value;
    const password = document.getElementById("signin-password").value;

    try {
        const response = await axios.post("http://localhost:3000/signin", {
            email,
            password
        });

        alert(response.data.message);

        if (response.data.message === "You are Logged In Successfully") {
            localStorage.setItem("token", response.data.token)
            showBookmarks();
        } else {
            alert(response.data.message)
        }
    } catch (error) {
        console.error("Error while signing up:", error);
    }

    document.getElementById("signup-email").value = "";
    document.getElementById("signup-password").value = "";
}

async function logout() {
    localStorage.removeItem("token");
    alert("You are logged out successfully");

    moveToSignin();
}

async function getBookmarks() {

    try {
        const response = await axios.get("http://localhost:3000/bookmarks", {
            headers: { token: localStorage.getItem("token") }
        });

        const bookmarksList = document.getElementById("bookmarks-list");
        bookmarksList.innerHTML = "";

        const bookmarks = response.data.bookmarks;

        if (bookmarks && bookmarks.length) {
            bookmarks.forEach((bookmark) => { // <--- CORRECTED
              const bookmarksElement = createBookmarkElement(bookmark);
              bookmarksList.appendChild(bookmarksElement);
          });
        }

    } catch (error) {
        console.log(error);
    }
}

function createBookmarkElement(bookmark) {
    const bookmarkDiv = document.createElement("div");
    bookmarkDiv.className = "bookmark-item";

    const inputEl = createInputElement(bookmark.title);
    inputEl.readOnly = true;

    const deleteBtn = deleteBookmarkBtn(bookmark._id);

    bookmarkDiv.appendChild(inputEl);
    bookmarkDiv.appendChild(deleteBtn);

    return bookmarkDiv;
}

function createInputElement(value) {
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.value = value;
    inputElement.readOnly = true;

    return inputElement;
}

function deleteBookmarkBtn(id) {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.onclick = function () {
        deleteBookmark(id);
    }

    return deleteBtn;
}

async function addBookmark() {
    const inputElement = document.getElementById("bookmarks-input");
    const title = inputElement.value;

    try {
        const response = await axios.post("http://localhost:3000/bookmark",
            { title },
            {
                headers: { token: localStorage.getItem("token") }
            });

        getBookmarks();

        document.getElementById("bookmarks-input").value = "";
    } catch (error) {
        console.log("Error while adding Bookmark:", error)
    }
}

async function deleteBookmark(id) {
    try {
        await axios.delete(`http://localhost:3000/bookmark/${id}`, {
            headers: { token: localStorage.getItem("token") },
        });

        getBookmarks();
    } catch (error) {
        console.log('Error while deleting a bookmark:', error)
    }
}
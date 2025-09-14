function moveToSignup() {
    document.getElementById("signup-container").style.display = "block";
    document.getElementById("signin-container").style.display = "none";
    document.getElementById("bookmarks-container").style.display = "none";
}
function moveToSignin() {
    document.getElementById("signup-container").style.display = "none";
    document.getElementById("signin-container").style.display = "block";
    document.getElementById("bookmarks-container").style.display = "none";

    // call the getBookmarks function
}
function showBookmarks() {
    document.getElementById("signup-container").style.display = "none";
    document.getElementById("signin-container").style.display = "none";
    document.getElementById("bookmarks-container").style.display = "block";

    // call it when you successfully logged in
}
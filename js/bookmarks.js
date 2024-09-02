console.log("bookmark.js loaded");

console.log("writing bookmark cookie");

document.cookie = "username=John Doe; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/";

console.log("Reading back bookmark cookie");
console.log("Cookie value is: ", document.cookie);



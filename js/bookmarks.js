



document.getElementById("bookmark-button").addEventListener("click", function(event){
    console.log("Bookmarked!");
    document.cookie = "sd=" + encode_date(today) + "; expires=Thu, 01 Jan 2026 00:00:01 GMT; path=/";
    console.log("Cookie value is: ", document.cookie);
})



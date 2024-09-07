



document.getElementById("bookmark-button").addEventListener("click", function(event){
    console.log("Bookmarked!");
    add_bookmark();
    
})


function read_cookie(){

}
function write_cookie(){

}

function add_bookmark(){

    document.cookie = "sd=" + encode_date(today) + "; expires=Thu, 01 Jan 2026 00:00:01 GMT; path=/";
    console.log("Cookie value is: ", document.cookie);

}
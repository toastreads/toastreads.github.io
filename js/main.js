//© Nithin Davis Nanthikkara
console.clear();
console.log("/main.js/ loaded")

let today = new Date()
// console.log("today is actually = ", today)
// console.log("date.parse(today): ", Date.parse(today))
// console.log("Date(date.parse(today)): ", Date(Date.parse(today)))
// console.log("to String radix 36 of above: ", (Date.parse(today)).toString(36))
// console.log("Reverse of above: ", parseInt((Date.parse(today)).toString(36),36))
// console.log("Encoded date: ", encode_date(today));
// console.log("Decoded date: ", decode_date(encode_date(today)));
// console.log("is this a date or not: ", decode_date(encode_date(today)).getDay());




function encode_date(inputDate) {

    dateInmillisecondFormat = Date.parse(inputDate)
    encodedtoString = dateInmillisecondFormat.toString(36)

    return encodedtoString
}
function decode_date(inputDate) {
    decodedDate = new Date(parseInt(inputDate, 36))

    return decodedDate
}



let no_image = "url('images/sunday_no_image.jpg')"

let sd = (new URLSearchParams(window.location.search)).get("sd");
if (sd) {
    //bla = console.log(sd.replace(/['"]+/g, ''));
    console.log("There is a sd (shared day) in the URL: ", sd);
    //today = new Date(Date.parse(sd))
    today = decode_date(sd)
    console.log("today will be considered to be = ", today)
} else {
    console.log("There is NO sd in the URL")
    today = new Date()
    console.log("today will be considered to be = ", today)
}

document.getElementById("dev-tool-clicker").addEventListener("click", function (event) {
    today.setDate(today.getDate() + 1)
    populate_card()
});

document.onload = populate_card();




function populate_card() {

    // Insert date and time into HTML
    document.getElementById("today").innerHTML = today.toDateString().substring(0, 3).concat(",", today.toDateString().substring(3, 10));





    //File paths for different days lists
    const monday_list = "json/monday_list.json"
    const tuesday_list = "json/tuesday_list.json"
    const wednesday_list = "json/wednesday_list.json"
    const thursday_list = "json/thursday_list.json"
    const friday_list = "json/friday_list.json"
    const saturday_list = "json/saturday_list.json"
    const sunday_list = "json/sunday_list.json"

    //Select list based on the day of the week.
    switch (today.getDay()) {
        case 0:
            console.log("Its a Sunday");
            no_image = "url('images/sunday_no_image.jpg')"
            fetch_and_write(sunday_list)
            break;
        case 1:
            console.log("Its a Monday");
            no_image = "url('images/monday_no_image.jpg')"
            fetch_and_write(monday_list)
            break;
        case 2:
            console.log("Its a Tuesday");
            no_image = "url('images/tuesday_no_image.jpg')"
            fetch_and_write(tuesday_list)
            break;
        case 3:
            console.log("Its a Wednesday");
            fetch_and_write(wednesday_list)
            break;
        case 4:
            console.log("Its a Thursday");
            no_image = "url('images/thursday_no_image.jpg')"
            fetch_and_write(thursday_list)
            break;
        case 5:
            console.log("Its a Friday");
            no_image = "url('images/friday_no_image.jpg')"
            fetch_and_write(friday_list)
            break;
        case 6:
            console.log("Its a Saturday");
            fetch_and_write(saturday_list)
            break;

    }



}

function fetch_and_write(jsonFilePath) {
    console.log("Fetching data from,", jsonFilePath, "...")
    fetch(jsonFilePath)
        .then(response => {
            if (response.ok) {
                console.log("Success")
                return response.json()


            } else {
                console.log("Fetch failed")
                return response.json()
            }
        })
        .then(data => {
            write_card(data)
        })
}



function write_card(data) {

    //dev tool stuff  -----




    console.log("writing card with the following data: ", data)
    // index = week_of_the_year(222);
    index = today.getWeek(); // using this function now, source: https://weeknumber.com/how-to/javascript
    console.log("Writing card with data index = ", index)
    document.getElementById("article-title").innerHTML = data[index].title;
    document.getElementById("topic").innerHTML = String("#" + data[index].topic);
    document.getElementById("article-description").innerHTML = data[index].description;

    if (data[index].image.startsWith("http", 0)) {




        imageURL = String("url(\"" + (data[index].image).toString() + "\")")
        gradientOverlay = "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%,rgba(0,0,0,0) 100%)"
        combinedImageGradientOverlay = String(gradientOverlay + "," + imageURL)
        document.getElementById("article-pic").style.backgroundImage = combinedImageGradientOverlay;


    } else {
        gradient_with_no_image = String("linear-gradient(to bottom, rgba(0,0,0,0.4) 0%,rgba(0,0,0,0) 100%)" + "," + no_image)
        document.getElementById("article-pic").style.backgroundImage = gradient_with_no_image;

    }

    if (data[index].sourcelogo.startsWith("http", 0)) {


        sourceLogoURL = String("url(\"" + (data[index].sourcelogo).toString() + "\")")
        document.getElementById("article-source-icon").style.backgroundImage = sourceLogoURL;


    } else {
        document.getElementById("article-source-icon").style.backgroundImage = "url(images/globe_icon.png)";
    }

    document.getElementById("article-source-name").innerHTML = extractDomain(data[index].link)



    //document.getElementById("clickable-area").setAttribute("onclick","location.href='www.yahoo.com';")
    document.getElementById("clickable-area").addEventListener("click", function (event) {
        window.open(data[index].link, '_blank');
    })




    setup_share_button(data[index].title, today);
    setup_save_button(data[index].title, data[index].description, data[index].link, encode_date(today));
    setup_done_button();
    setup_note_button();


}

var offset = 0;



function week_of_the_year(fromThisDay = 0) {

    fromThisDay = offset; // dev tool - delete later


    var now = today;
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var dayOfYear = Math.abs(Math.floor(diff / oneDay) - fromThisDay);
    console.log('Day of year: ' + dayOfYear);

    //calculate week of the year
    var weekOfYear = Math.floor(dayOfYear * (52 / 365));
    console.log("Week of the year with DST: " + (weekOfYear));

    return weekOfYear;
}

function extractDomain(url) {
    return url.replace(/^(?:https?:\/\/)?(?:[^\/]+\.)?([^.\/]+\.[^.\/]+).*$/, "$1");
}



function setup_share_button(titleToShare, dateOfShare) {

    encodedDateOfShare = encode_date(dateOfShare)
    linkToShare = String("https://toastreads.com/?sd=" + encodedDateOfShare)

    console.log("DEEP LINK: ", linkToShare)
    if (navigator.share) {
        const shareButton = document.getElementById('share-button');
        shareButton.addEventListener('click', async () => {
            try {
                // Use the Web Share API to trigger the native sharing dialog
                await navigator.share({
                    text: String(titleToShare + " | via Toastreads! |" + "\n"),
                    url: linkToShare
                });

                console.log('Shared successfully');
            } catch (error) {
                console.error('Error sharing:', error.message);
            }
        });
    } else {
        console.warn('Web Share API not supported on this browser');
        //change icon to copy-icon and raise a toast with link copied to clipboard on clicking
        const copyButton = document.getElementById('share-button');
        copyButton.addEventListener('click', function (event) {
            navigator.clipboard.writeText(linkToShare)
            //alert("Link copied to clipboard: " + linkToShare)
            snack(String("Link copied to clipboard:<br>" + linkToShare))
        })

    }

}

function setup_save_button(title, description, link, datecode) {
    document.getElementById('save-button').addEventListener('click', function (event) {
        snack("Save coming soon!")
        write_to_saved_articles_os(title, description, link, datecode)


    })
}

function setup_done_button() {
    document.getElementById('done-button').addEventListener('click', function(event) {
        snack("Yay! Your a Champ!")
    })
}

function setup_note_button() {
    document.getElementById('note-button').addEventListener('click', function(event) {
        snack("Notes coming soon!")
    })
}


function snack(message) {
    // Add the "show" class to DIV

    document.getElementById("snack-message").innerHTML = message
    document.getElementById("snackbar").className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { document.getElementById("snackbar").className = document.getElementById("snackbar").className.replace("show", ""); }, 3000);
}


// This script is released to the public domain and may be used, modified and
// distributed without restrictions. Attribution not necessary but appreciated.
// Source: https://weeknumber.com/how-to/javascript

// Returns the ISO week of the date.
Date.prototype.getWeek = function () {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function () {
    var date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
}

console.log("Week of the year from the new function: ", today.getWeek());





//bugs to fix:
//using the dev tool clicker adds multiple onclick event listeners to the clickable area of the card.
//some of the links have images, but they are not mentioned in the meta tags so the python does not capture them.
//Some links dont have a description in the meta tag, python would need to take the first 50 words of the main text as description.
//share link needs to be from toast reads:
//  https://stackoverflow.com/questions/31522621/pull-variable-from-a-url-and-set-it-as-value-of-textbox
//  https://stackoverflow.com/questions/1034621/get-the-current-url-with-javascript


//Use indexedDB for bookmark, read, and notes etc: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage#storing_complex_data_%E2%80%94_indexeddb
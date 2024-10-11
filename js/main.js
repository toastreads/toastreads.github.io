console.clear()



//functions defined for use
function encode_date(inputDate) {

    dateInmillisecondFormat = Date.parse(inputDate)
    encodedtoString = dateInmillisecondFormat.toString(36)

    return encodedtoString
}
function decode_date(inputDate) {
    decodedDate = new Date(parseInt(inputDate, 36))

    return decodedDate
}


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

Date.prototype.getDateWithoutTime = function () {
    return new Date(this.toDateString());
}


////------------------------------------------------------------


async function getArticleOfTheDay(dateOfInterest) {
    jsonList = await getDayBasedJSON(dateOfInterest)
    index = dateOfInterest.getWeek()
    articleObject = jsonList[index]

    return articleObject
}

//function that returns the json data of the article based on the date provided
function getDayBasedJSON(dateOfInterest) {
    //File paths for different days lists
    const monday_list = "json/monday_list.json"
    const tuesday_list = "json/tuesday_list.json"
    const wednesday_list = "json/wednesday_list.json"
    const thursday_list = "json/thursday_list.json"
    const friday_list = "json/friday_list.json"
    const saturday_list = "json/saturday_list.json"
    const sunday_list = "json/sunday_list.json"

    //Select list based on the day of the week.
    switch (dateOfInterest.getDay()) {
        case 0:
            console.log("Its a Sunday");
            // no_image = "url('/images/sunday_no_image.jpg')"
            return fetchFromJSON(sunday_list)
        case 1:
            console.log("Its a Monday");
            no_image = "url('/images/monday_no_image.jpg')"
            return fetchFromJSON(monday_list)
        case 2:
            console.log("Its a Tuesday");
            no_image = "url('/images/tuesday_no_image.jpg')"
            return fetchFromJSON(tuesday_list)
        case 3:
            console.log("Its a Wednesday");
            no_image = "url('/images/wednesday_no_image.jpg')"
            return fetchFromJSON(wednesday_list)
        case 4:
            console.log("Its a Thursday");
            no_image = "url('/images/thursday_no_image.jpg')"
            return fetchFromJSON(thursday_list)
        case 5:
            console.log("Its a Friday");
            no_image = "url('/images/friday_no_image.jpg')"
            return fetchFromJSON(friday_list)
        case 6:
            console.log("Its a Saturday");
            no_image = "url('/images/saturday_no_image.jpg')"
            return fetchFromJSON(saturday_list)
    }
}

async function fetchFromJSON(jsonFilePath) {
    try {
        const response = await fetch(jsonFilePath)
        if (response.ok) {
            console.log("New fetch is Success")
            return response.json()

        }
    } catch (error) {
        console.error(error);
    }
}

////------------------------------------------------------------

let today = new Date()


let no_image = "url('images/sunday_no_image.jpg')"

//sd is shared date
let sd = (new URLSearchParams(window.location.search)).get("sd");
if (sd) {
    //bla = console.log(sd.replace(/['"]+/g, ''));
    console.log("There is a sd (shared day) in the URL: ", sd);
    //today = new Date(Date.parse(sd))
    today = decode_date(sd)
    console.log("today will be considered to be = ", today)
} else {
    console.log("There is NO sd in the URL")
    today = new Date().getDateWithoutTime()
    console.log("today will be considered to be = ", today)
}

document.getElementById("dev-tool-clicker").addEventListener("click", function (event) {
    today.setDate(today.getDate() + 1)
    populate_card()
});


populate_card();




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
            no_image = "url('/images/sunday_no_image.jpg')"
            fetch_and_write(sunday_list)
            break;
        case 1:
            console.log("Its a Monday");
            no_image = "url('/images/monday_no_image.jpg')"
            fetch_and_write(monday_list)
            break;
        case 2:
            console.log("Its a Tuesday");
            no_image = "url('/images/tuesday_no_image.jpg')"
            fetch_and_write(tuesday_list)
            break;
        case 3:
            console.log("Its a Wednesday");
            no_image = "url('/images/wednesday_no_image.jpg')"
            fetch_and_write(wednesday_list)
            break;
        case 4:
            console.log("Its a Thursday");
            no_image = "url('/images/thursday_no_image.jpg')"
            fetch_and_write(thursday_list)
            break;
        case 5:
            console.log("Its a Friday");
            no_image = "url('/images/friday_no_image.jpg')"
            fetch_and_write(friday_list)
            break;
        case 6:
            console.log("Its a Saturday");
            no_image = "url('/images/saturday_no_image.jpg')"
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

async function getArticleOfTheDayWithOffset(dateOfInterest, dateOffset = 0){
    tomorrow = new Date()
    tomorrow.setDate(dateOfInterest.getDate() + dateOffset)
    return (await getArticleOfTheDay(tomorrow))
}

async function writeSuggestedCard(cardElementID, dateOfInterest, dateOffset){
    suggestedCard = document.querySelector(cardElementID)
    suggestedArticleObject = await getArticleOfTheDayWithOffset(dateOfInterest, dateOffset)
    
    suggestedCard.querySelector(".saved-article-card-title").innerHTML = suggestedArticleObject.title
    suggestedCard.querySelector(".saved-article-source-name").innerHTML = extractDomain(suggestedArticleObject.link)
    suggestedCard.querySelector(".saved-article-source-logo").style.backgroundImage = sourceLogoURL = String("url(\"" + (suggestedArticleObject.sourcelogo).toString() + "\")")
    suggestedCard.querySelector(".saved-article-card-pic").style.backgroundImage = String("url(\"" + (suggestedArticleObject.image).toString() + "\")")
    suggestedCard.href = suggestedArticleObject.link
    suggestedCard.target = '_blank'
    suggestedCard.querySelector(".topic").innerHTML = suggestedArticleObject.topic
    suggestedCard.querySelector(".topic").style.backgroundColor = getRandomColor()
}
function getRandomColor() {


      color = 50 * Math.ceil(Math.random() * 7.2);

    return String("hsl("+color + "," + "60%,90%)");
  }

async function writeAllSuggestedCards(){
    await writeSuggestedCard("#suggested-article-card-1", today, 4)
    await writeSuggestedCard("#suggested-article-card-2", today, 5)
    await writeSuggestedCard("#suggested-article-card-3", today, 6)
}
//writeAllSuggestedCards()

async function writeMainCard(dateOfInterest=today){
    mainArticleObject = await getArticleOfTheDay(dateOfInterest)

    document.querySelector("#article-title").innerHTML = mainArticleObject.title
    document.querySelector("#topic").innerHTML = mainArticleObject.topic
    document.querySelector("#article-description").innerHTML = mainArticleObject.description;

}

function makeURL(input){
    return String("url(\"" + (input).toString() + "\")")
}

function write_card(data) {


    index = today.getWeek(); // using this function now, source: https://weeknumber.com/how-to/javascript
    console.log("Writing card with data index = ", index)
    document.getElementById("article-title").innerHTML = data[index].title;
    document.getElementById("topic").innerHTML = data[index].topic;
    document.getElementById("article-description").innerHTML = data[index].description;

    if (data[index].image.startsWith("http", 0)) {
        document.getElementById("article-pic").style.backgroundImage = makeURL(data[index].image);
    } else {
        document.getElementById("article-pic").style.backgroundImage = no_image;
    }

    if (data[index].sourcelogo.startsWith("http", 0)) {
        document.getElementById("article-source-icon").style.backgroundImage = makeURL(data[index].sourcelogo);
    } else {
        document.getElementById("article-source-icon").style.backgroundImage = "url(images/globe_icon.png)";
    }

    document.getElementById("article-source-name").innerHTML = extractDomain(data[index].link)

    document.getElementById("clickable-area").href = data[index].link
    document.getElementById("clickable-area").target = '_blank'

    setup_share_button(data[index].title, today);
    setup_save_button(data[index].title, data[index].description, data[index].link, data[index].image, sourceLogoURL, encode_date(today));
    setup_done_button(data[index].link);
    setup_note_button();
    setup_textarea(data[index].title, data[index].description, data[index].link, data[index].image, sourceLogoURL, encode_date(today));

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

function setup_save_button(title, description, link, pic, sourcelogo, datecode) {
    document.getElementById('save-button').addEventListener('click', function (event) {
        snack("Saved!")
        write_to_saved_articles_os(title, description, link, pic, sourcelogo, datecode)


    })
}

function setup_done_button(link) {
    document.getElementById('done-button').addEventListener('click', function (event) {
        snack("Your a Champ!")
        event.target.innerHTML = "Started Reading..."
        setTimeout(()=>{window.open(link, '_blank')},500)
        
        
    })
}

function setup_note_button() {
    noteButton = document.querySelector("#note-button")
    noteButton.addEventListener('click', function (event) {
        // snack("Notes coming soon!")
        notepadContainer = document.querySelector(".notepad-container")

        if (window.getComputedStyle(notepadContainer).getPropertyValue('display') == 'none') {
            notepadContainer.style.display = "block";
            document.querySelector(".notepad-textarea").focus({ preventScroll: false })
            noteButton.classList.add("secondary-button-pressed")
        } else {
            notepadContainer.style.display = "none";
            noteButton.classList.remove("secondary-button-pressed")
        }

    })

    closeNoteButton = document.querySelector("#close-note-button")
    closeNoteButton.addEventListener("click", function (event) {
        notepadContainer.style.display = "none"
        noteButton.classList.remove("secondary-button-pressed")

    })
}

function setup_textarea(title, description, link, pic, sourcelogo, datecode) {
    textArea = document.querySelector("#note-textarea")
    textArea.addEventListener("input", function () {
        console.log("User is typing ...", textArea.value);
        write_to_saved_articles_os(title, description, link, pic, sourcelogo, datecode, "something")



    })
}


function snack(message) {
    // Add the "show" class to DIV

    document.getElementById("snack-message").innerHTML = message
    document.getElementById("snackbar").className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { document.getElementById("snackbar").className = document.getElementById("snackbar").className.replace("show", ""); }, 3000);
}









//bugs to fix:
//using the dev tool clicker adds multiple onclick event listeners to the clickable area of the card.
//some of the links have images, but they are not mentioned in the meta tags so the python does not capture them.
//Some links dont have a description in the meta tag, python would need to take the first 50 words of the main text as description.
//share link needs to be from toast reads:
//  https://stackoverflow.com/questions/31522621/pull-variable-from-a-url-and-set-it-as-value-of-textbox
//  https://stackoverflow.com/questions/1034621/get-the-current-url-with-javascript


//Use indexedDB for bookmark, read, and notes etc: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage#storing_complex_data_%E2%80%94_indexeddb
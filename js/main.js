console.clear()

function encode_date(inputDate) {
    dateInmillisecondFormat = Date.parse(inputDate)
    encodedtoString = dateInmillisecondFormat.toString(36)
    return encodedtoString
}
function decode_date(inputDate) {
    decodedDate = new Date(parseInt(inputDate, 36))
    return decodedDate
}

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



async function getArticleOfTheDay(dateOfInterest) {
    jsonList = await getDayBasedJSON(dateOfInterest)
    index = dateOfInterest.getWeek()
    articleObject = jsonList[index]

    return articleObject
}

function getDefaultImageOfTheDay(dateOfInterest){
    switch (dateOfInterest.getDay()) {
        case 0:
            console.log("Its a Sunday");
            no_image = "url('/images/sunday_no_image.jpg')"
            break
        case 1:
            console.log("Its a Monday");
            no_image = "url('/images/monday_no_image.jpg')"
            break
        case 2:
            console.log("Its a Tuesday");
            no_image = "url('/images/tuesday_no_image.jpg')"
            break
        case 3:
            console.log("Its a Wednesday");
            no_image = "url('/images/wednesday_no_image.jpg')"
            break
        case 4:
            console.log("Its a Thursday");
            no_image = "url('/images/thursday_no_image.jpg')"
            break
        case 5:
            console.log("Its a Friday");
            no_image = "url('/images/friday_no_image.jpg')"
            break
        case 6:
            console.log("Its a Saturday");
            no_image = "url('/images/saturday_no_image.jpg')"
            break
    }
    return no_image

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
            return fetchFromJSON(sunday_list)
        case 1:
            console.log("Its a Monday");
            return fetchFromJSON(monday_list)
        case 2:
            console.log("Its a Tuesday");
            return fetchFromJSON(tuesday_list)
        case 3:
            console.log("Its a Wednesday");
            return fetchFromJSON(wednesday_list)
        case 4:
            console.log("Its a Thursday");
            return fetchFromJSON(thursday_list)
        case 5:
            console.log("Its a Friday");
            return fetchFromJSON(friday_list)
        case 6:
            console.log("Its a Saturday");
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







async function getArticleOfTheDayWithOffset(dateOfInterest, dateOffset = 0) {
    tomorrow = new Date()
    tomorrow.setDate(dateOfInterest.getDate() + dateOffset)
    return (await getArticleOfTheDay(tomorrow))
}

async function writeSuggestedCard(cardElementID, dateOfInterest, dateOffset) {
    suggestedCard = document.querySelector(cardElementID)
    suggestedArticleObject = await getArticleOfTheDayWithOffset(dateOfInterest, dateOffset)

    suggestedCard.querySelector(".saved-article-card-title").innerHTML = suggestedArticleObject.title
    suggestedCard.querySelector(".saved-article-source-name").innerHTML = extractDomain(suggestedArticleObject.link)
    suggestedCard.querySelector(".saved-article-source-logo").style.backgroundImage = makeURL(suggestedArticleObject.sourcelogo)
    
    if (suggestedArticleObject.image.startsWith("http", 0)) {
        suggestedCard.querySelector(".saved-article-card-pic").style.backgroundImage = makeURL(suggestedArticleObject.image)
    } else {
        suggestedCard.querySelector(".saved-article-card-pic").style.backgroundImage = getDefaultImageOfTheDay(dateOfInterest)
    }

    suggestedCard.href = suggestedArticleObject.link
    suggestedCard.target = '_blank'
    suggestedCard.querySelector(".topic").innerHTML = suggestedArticleObject.topic
    suggestedCard.querySelector(".topic").style.backgroundColor = getRandomColor()
}
function getRandomColor() {


    color = 50 * Math.ceil(Math.random() * 7.2);

    return String("hsl(" + color + "," + "60%,90%)");
}

async function writeAllSuggestedCards(dateOfInterest) {
    await writeSuggestedCard("#suggested-article-card-1", dateOfInterest, 4)
    await writeSuggestedCard("#suggested-article-card-2", dateOfInterest, 5)
    await writeSuggestedCard("#suggested-article-card-3", dateOfInterest, 6)
}


async function writeMainCard(dateOfInterest = today, offset=0) {
    mainArticleObject = await getArticleOfTheDayWithOffset(dateOfInterest, offset)

    if (mainArticleObject.image.startsWith("http", 0)) {
        document.querySelector("#article-pic").style.backgroundImage = makeURL(mainArticleObject.image);
    } else {
        document.querySelector("#article-pic").style.backgroundImage = getDefaultImageOfTheDay(dateOfInterest);
    }

    document.querySelector("#article-title").innerHTML = mainArticleObject.title
    document.querySelector("#topic").innerHTML = mainArticleObject.topic
    document.querySelector("#article-description").innerHTML = mainArticleObject.description;

    if (mainArticleObject.sourcelogo.startsWith("http", 0)) {
        document.getElementById("article-source-icon").style.backgroundImage = makeURL(mainArticleObject.sourcelogo);
    } else {
        document.getElementById("article-source-icon").style.backgroundImage = "url(images/globe_icon.png)";
    }

    document.getElementById("article-source-name").innerHTML = extractDomain(mainArticleObject.link)

    document.getElementById("clickable-area").href = mainArticleObject.link
    document.getElementById("clickable-area").target = '_blank'

    setup_share_button(mainArticleObject.title, today);
    setup_save_button(mainArticleObject.title, mainArticleObject.description, mainArticleObject.link, mainArticleObject.image, mainArticleObject.sourceLogoURL, encode_date(today));
    setup_done_button(mainArticleObject.link);
    setup_note_button();
    setup_textarea(mainArticleObject.title, mainArticleObject.description, mainArticleObject.link, mainArticleObject.image, mainArticleObject.sourceLogoURL, encode_date(today));


}

function makeURL(input) {
    return String("url(\"" + (input).toString() + "\")")
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
        setTimeout(() => { window.open(link, '_blank') }, 500)


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

function writeTodayHeadline(dateOfInterest) {
    //document.getElementById("today-date").innerHTML = dateOfInterest.toDateString().substring(0, 3).concat(",", dateOfInterest.toDateString().substring(3, 10));
    document.getElementById("today-date").innerHTML = dateOfInterest.toDateString().substring(3, 10);
    document.querySelector("#today-headline").innerHTML = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dateOfInterest.getDay()]
}



let today = new Date()

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
    writeTodayHeadline(today)
    writeMainCard(today)
    writeAllSuggestedCards()
});

writeTodayHeadline(today)
writeMainCard(today)
writeAllSuggestedCards(today)


document.querySelector("#cycle-article-button").addEventListener("click", () => {
    randomDateOffset = Math.ceil(365*Math.random())
    writeMainCard(today,randomDateOffset)
    writeAllSuggestedCards(today)
})




//bugs to fix:
//using the dev tool clicker adds multiple onclick event listeners to the clickable area of the card.
//some of the links have images, but they are not mentioned in the meta tags so the python does not capture them.
//Some links dont have a description in the meta tag, python would need to take the first 50 words of the main text as description.
//share link needs to be from toast reads:
//  https://stackoverflow.com/questions/31522621/pull-variable-from-a-url-and-set-it-as-value-of-textbox
//  https://stackoverflow.com/questions/1034621/get-the-current-url-with-javascript


//Use indexedDB for bookmark, read, and notes etc: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage#storing_complex_data_%E2%80%94_indexeddb
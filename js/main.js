//© Nithin Davis Nanthikkara
console.clear();
console.log("JS loaded")

let today = new Date()
// console.log("today is actually = ", today)
// console.log("date.parse(today): ", Date.parse(today))
// console.log("Date(date.parse(today)): ", Date(Date.parse(today)))
// console.log("to String radix 36 of above: ", (Date.parse(today)).toString(36))
// console.log("Reverse of above: ", parseInt((Date.parse(today)).toString(36),36))
// console.log("Encoded date: ", encode_date(today));
// console.log("Decoded date: ", decode_date(encode_date(today)));
// console.log("is this a date or not: ", decode_date(encode_date(today)).getDay());




function encode_date(inputDate){

    dateInmillisecondFormat = Date.parse(inputDate)
    encodedtoString = dateInmillisecondFormat.toString(36)

    return encodedtoString
}
function decode_date(inputDate){
    decodedDate = new Date(parseInt(inputDate, 36))

    return decodedDate
}



let no_image = "url('images/sunday_no_image.jpg')"

let sharedDay = (new URLSearchParams(window.location.search)).get("sharedDay");
if (sharedDay) {
    //bla = console.log(sharedDay.replace(/['"]+/g, ''));
    console.log("There is a sharedDay in the URL: ", sharedDay);
    //today = new Date(Date.parse(sharedDay))
    today = decode_date(sharedDay)
    console.log("today will be considered to be = ", today)
} else {
    console.log("There is NO sharedDay in the URL")
    today = new Date()
    console.log("today will be considered to be = ", today)
}



document.onload = populate_card();




function populate_card() {





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
    document.getElementById("dev-tool-clicker").addEventListener("click", function (event) {
        offset = offset - 7;
        write_card(data)
        console.log(offset)
    }, { once: true });



    console.log("writing card with the following data: ", data)
    index = week_of_the_year(222);
    console.log("Writing card with data index = ", index)
    document.getElementById("article-title").innerHTML = data[index].title;
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


}

var offset = 222;



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
    return url.replace(/^(?:https?:\/\/)?(?:[^\/]+\.)?([^.\/]+\.[^.\/]+).*$/, "https://www.$1");
}


function setup_share_button(titleToShare, dateOfShare) {

    encodedDateOfShare = encode_date(dateOfShare)
    linkToShare = String("https://toastreads.com/?sharedDay=" + encodedDateOfShare)
    
    console.log("DEEP LINK: ", linkToShare)
    if (navigator.share) {
        const shareButton = document.getElementById('share-button');
        shareButton.addEventListener('click', async () => {
            try {
                // Use the Web Share API to trigger the native sharing dialog
                await navigator.share({
                    text: String(titleToShare + " | via Toastreads! |"),
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
        copyButton.addEventListener('click', function(event){
            navigator.clipboard.writeText(linkToShare)
            alert("Link copied to clipboard: " + linkToShare)
        })
        
    }

}



//bugs to fix:
//using the dev tool clicker adds multiple onclick event listeners to the clickable area of the card.
//some of the links have images, but they are not mentioned in the meta tags so the python does not capture them.
//Some links dont have a description in the meta tag, python would need to take the first 50 words of the main text as description.
//share link needs to be from toast reads:
//  https://stackoverflow.com/questions/31522621/pull-variable-from-a-url-and-set-it-as-value-of-textbox
//  https://stackoverflow.com/questions/1034621/get-the-current-url-with-javascript



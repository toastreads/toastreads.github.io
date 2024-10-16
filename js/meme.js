function fetch_meme() {
    console.log("/meme.js/Fetching meme...")

    fetch("https://meme-api.com/gimme")
        .then(response => {
            if (response.ok) {
                console.log("/meme.js/Meme fetch Success")
                return response.json()


            } else {
                console.log("/meme.js/Meme Fetch failed")
                return response.json()
            }
        })
        .then(data => {
            write_meme(data)
            console.log("/meme.js/Meme data: ", data);

        })

}

function fetchMemeCorsAnywhere() {
    fetch("https://cors-anywhere.herokuapp.com/https://meme-api.com/gimme")
        .then(response => {
            if (!response.ok) {
                console.log("/meme.js/Meme Fetch failed, status: ", response.status);
                // Throw an error to be caught in the catch block
                throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
            }
            console.log("/meme.js/Meme fetch Success");
            return response.json();
        })
        .then(data => {
            write_meme(data);
            console.log("/meme.js/Meme data: ", data);
        })
        .catch(error => {
            console.error("/meme.js/Meme Fetch Error:", error);
            // Handle the error accordingly
        });
}

function write_meme(jsonData) {

    if (jsonData.url) {
        document.getElementById("meme-pic").src = jsonData.url;
        document.getElementById("meme-source").innerHTML = jsonData.url
        document.getElementById("meme-source").href = jsonData.url
        setShareMemeButton(jsonData.url)
        document.querySelector("#cycle-meme-button").querySelector(".secondary-button-icon").classList.remove("secondary-button-rotate")
    }

}



document.onload = fetch_meme()

document.querySelector("#cycle-meme-button").addEventListener("click", () => {
    document.querySelector("#cycle-meme-button").querySelector(".secondary-button-icon").classList.add("secondary-button-rotate")
    fetch_meme()
})






function setShareMemeButton(titleToShare) {


    linkToShare = titleToShare


    if (navigator.share) {
        const shareButton = document.querySelector('#share-meme-button');
        shareButton.addEventListener('click', async () => {
            try {
                // Use the Web Share API to trigger the native sharing dialog
                await navigator.share({
                    text: "Shared via Toastreads!",
                    url: linkToShare
                });
            } catch (error) {
                console.error('Error sharing meme:', error.message);
            }
        });
    } else {
        console.warn('Web Share API not supported on this browser');
        const copyButton = document.querySelector('#share-meme-button');
        copyButton.addEventListener('click', function (event) {
            navigator.clipboard.writeText(linkToShare)
            snack(String("Link copied to clipboard:<br>" + linkToShare))
        })

    }

}
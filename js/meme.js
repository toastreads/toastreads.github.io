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
            console.log("/meme.js/Meme data: ",data);
            
        })
    }

    function write_meme(jsonData) {
        
        if (jsonData.url) {
            document.getElementById("meme-pic").src = jsonData.url;
            document.getElementById("meme-source").innerHTML = jsonData.url
            document.getElementById("meme-source").href = jsonData.url
        }
        
    }

    document.onload = fetch_meme()
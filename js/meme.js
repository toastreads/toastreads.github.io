function fetch_meme() {
    console.log("Fetching meme...")
    fetch("https://meme-api.com/gimme")
        .then(response => {
            if (response.ok) {
                console.log("Meme fetch Success")
                return response.json()


            } else {
                console.log("Meme Fetch failed")
                return response.json()
            }
        })
        .then(data => {
            write_meme(data)
            console.log(data);
            
        })
    }

    function write_meme(jsonData) {
        console.log("Meme selected:", jsonData.preview[2]);
        
        document.getElementById("meme-pic").style.backgroundImage = String("url(\"" + jsonData.preview[2] + "\"");
    }

    document.onload = fetch_meme()
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
        
        if (jsonData.url) {
            document.getElementById("meme-pic").src = jsonData.url;
            console.log("Meme selected:", jsonData.url);
        }
        
    }

    document.onload = fetch_meme()
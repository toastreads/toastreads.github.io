function fetch_and_write("https://meme-api.com/gimme") {
    console.log("Fetching meme...")
    fetch(https://meme-api.com/gimme)
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
            write_meme(data)
        })
    }
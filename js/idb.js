
let db;

const openRequest = window.indexedDB.open("toast_db", 1);

openRequest.addEventListener("error", () => {
    console.error("Database failed to open");
})
openRequest.addEventListener("success", () => {
    console.log("Database opened successfully");
    db = openRequest.result;
    display_data();
})

openRequest.addEventListener("upgradeneeded", (e) => {

    db = e.target.result;

    const objectStore = db.createObjectStore("saved_articles_os", {
        keyPath: "id",
        autoIncrement: true,
    });

    objectStore.createIndex("title", "title", { unique: false });
    objectStore.createIndex("description", "description", { unique: false });
    objectStore.createIndex("link", "link", { unique: false });
    objectStore.createIndex("datecode", "datecode", { unique: false });

    console.log("Database setup complete");
})

function write_to_saved_articles_os(article_title, article_description, article_link, article_datecode) {
    console.log("writing to database");

    const newItem = {
        title: article_title,
        description: article_description,
        link: article_link,
        datecode: article_datecode
    };

    const transaction = db.transaction(["saved_articles_os"], "readwrite");
    const objectStore = transaction.objectStore("saved_articles_os");
    const addRequest = objectStore.add(newItem);

    addRequest.addEventListener("success", () => {
        console.log("Add successfull");

    });

    transaction.addEventListener("complete", () => {
        console.log("Transaction completed: database modification finished.");
        display_data();
    });

    transaction.addEventListener("error", () =>
        console.log("Transaction not opened due to error"),
    );
}

function display_data() {
    console.log("displaying from database");

    document.getElementsByClassName("saved-article-card")[0].style.display = "block"
}
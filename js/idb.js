
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
    objectStore.createIndex("link", "link", { unique: true });
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

    list = document.querySelector("#saved-list-parent");
    if (document.getElementsByClassName("saved-article-card")[0]){
        listItemTemplate = document.getElementsByClassName("saved-article-card")[0];
    }
    

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    const objectStore = db.transaction("saved_articles_os").objectStore("saved_articles_os");
    objectStore.openCursor().addEventListener("success", (e) => {

        const cursor = e.target.result;


        if (cursor) {

            document.querySelector("#empty-saved").style.display = "none";
            document.querySelector("#saved-list-parent").style.display = "block";

            let listItem = listItemTemplate.cloneNode(true);
            list.appendChild(listItem);
            


            listItem.querySelector(".saved-article-card-title").innerHTML = cursor.value.title;
            // listItem.querySelector(".saved-article-card-description").innerHTML = cursor.value.description;
            listItem.setAttribute("data-note-id", cursor.value.id);

            


            // const deleteBtn = document.createElement("button");
            // listItem.appendChild(deleteBtn);
            // deleteBtn.textContent = "Delete";
            // deleteBtn.addEventListener("click", deleteItem);


            cursor.continue();
        } else {

            if (!list.firstChild) {
                document.querySelector("#empty-saved").style.display = "block";
                document.querySelector("#saved-list-parent").style.display = "none";
            }

            console.log("Notes all displayed");
        }
    });
}


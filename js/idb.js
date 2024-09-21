
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
    objectStore.createIndex("pic", "pic", { unique: false });
    objectStore.createIndex("sourcelogo", "sourcelogo", { unique: false });
    objectStore.createIndex("datecode", "datecode", { unique: false });

    console.log("Database setup complete");
})

function write_to_saved_articles_os(article_title, article_description, article_link, article_pic, article_source_logo, article_datecode) {
    console.log("writing to database");

    const newItem = {
        title: article_title,
        description: article_description,
        link: article_link,
        pic: article_pic,
        sourcelogo: article_source_logo,
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
    if (document.getElementsByClassName("saved-article-card")[0]) {
        listItemTemplate = document.getElementsByClassName("saved-article-card")[0];
    }


    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    const objectStore = db.transaction("saved_articles_os").objectStore("saved_articles_os");
    objectStore.openCursor(null, 'prev').addEventListener("success", (e) => {

        const cursor = e.target.result;


        if (cursor) {

            document.querySelector("#empty-saved").style.display = "none";
            document.querySelector("#saved-list-parent").style.display = "block";

            let listItem = listItemTemplate.cloneNode(true);
            list.appendChild(listItem);



            listItem.querySelector(".saved-article-card-title").innerHTML = cursor.value.title;
            listItem.querySelector(".saved-article-source-name").innerHTML = extractDomain(cursor.value.link);
            listItem.querySelector(".saved-article-card-pic").style.backgroundImage = String("URL('" + cursor.value.pic + "')");
            listItem.querySelector(".saved-article-source-logo").style.backgroundImage = cursor.value.sourcelogo;
            // listItem.querySelector(".saved-article-card-description").innerHTML = cursor.value.description;
            listItem.setAttribute("data-note-id", cursor.value.id);

            listItem.querySelector(".saved-article-card-clickable-area").addEventListener("click", function (event) {
                window.open(cursor.value.link, '_blank')
            });

            const deleteBtn = listItem.querySelector(".delete-button");
            // listItem.appendChild(deleteBtn);
            // deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", delete_item);

            const expandButton = listItem.querySelector(".expand-button");
            expandButton.addEventListener("click", expand_card);


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

function expand_card(e) {
    // console.log("Expanding");
    // const noteId = Number(e.target.parentNode.parentNode.parentNode.parentNode.getAttribute("data-note-id"));
    // console.log("NOTE ID = ", noteId);

    const extendedArea = e.target.closest('.saved-article-card').querySelector(".saved-article-card-extended-area");
    
    if (window.getComputedStyle(extendedArea).getPropertyValue('display') == 'none') {
        extendedArea.style.display = "block";        
    } else {
        extendedArea.style.display = "none";
    }

}

// Define the deleteItem() function
function delete_item(e) {
    // retrieve the name of the task we want to delete. We need
    // to convert it to a number before trying to use it with IDB; IDB key
    // values are type-sensitive.
    const noteId = Number(e.target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-note-id"));
    console.log("NOTE ID = ", noteId);


    // open a database transaction and delete the task, finding it using the id we retrieved above
    const transaction = db.transaction(["saved_articles_os"], "readwrite");
    const objectStore = transaction.objectStore("saved_articles_os");
    const deleteRequest = objectStore.delete(noteId);

    // report that the data item has been deleted
    transaction.addEventListener("complete", () => {
        // delete the parent of the button
        // which is the list item, so it is no longer displayed
        //display_data();
        e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode.parentNode.parentNode);
        console.log(`Note ${noteId} deleted.`);

        // Again, if list item is empty, display a 'No notes stored' message
        if (!list.firstChild) {
            document.querySelector("#empty-saved").style.display = "block";
        }
    });
}

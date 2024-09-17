
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

    list = document.querySelector("#saved-list-parent");
    listItemTemplate = document.getElementsByClassName("saved-article-card")[0];

    // Here we empty the contents of the list element each time the display is updated
    // If you didn't do this, you'd get duplicates listed each time a new note is added
    while (list.firstChild) {
        list.removeChild(list.firstChild);
      }
    
      // Open our object store and then get a cursor - which iterates through all the
      // different data items in the store
      const objectStore = db.transaction("saved_articles_os").objectStore("saved_articles_os");
      objectStore.openCursor().addEventListener("success", (e) => {
        // Get a reference to the cursor
        const cursor = e.target.result;
    
        // If there is still another data item to iterate through, keep running this code
        if (cursor) {
          // Create a list item, h3, and p to put each data item inside when displaying it
          // structure the HTML fragment, and append it inside the list
          let listItem = listItemTemplate.cloneNode(true);

          list.appendChild(listItem);
    
          // Put the data from the cursor inside the h3 and para
          listItem.querySelector(".saved-article-card-title").innerHTML = cursor.value.title;

    
          // Store the ID of the data item inside an attribute on the listItem, so we know
          // which item it corresponds to. This will be useful later when we want to delete items
          listItem.setAttribute("data-note-id", cursor.value.id);
    
          // Create a button and place it inside each listItem
          const deleteBtn = document.createElement("button");
          listItem.appendChild(deleteBtn);
          deleteBtn.textContent = "Delete";
    
          // Set an event handler so that when the button is clicked, the deleteItem()
          // function is run
          deleteBtn.addEventListener("click", deleteItem);
    
          // Iterate to the next item in the cursor
          cursor.continue();
        } else {
          // Again, if list item is empty, display a 'No notes stored' message
          if (!list.firstChild) {
            const listItem = document.createElement("li");
            listItem.textContent = "No notes stored.";
            list.appendChild(listItem);
          }
          // if there are no more cursor items to iterate through, say so
          console.log("Notes all displayed");
        }
      });
}

  
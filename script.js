document.addEventListener("DOMContentLoaded", function() {
    const folderList = document.getElementById("folder-list");
    const saveButton = document.getElementById("save-entry");
    const diaryEntryInput = document.getElementById("diary-entry");
    const toggleThemeButton = document.getElementById("toggle-theme");
    const charCounter = document.getElementById("char-counter");
    const searchInput = document.getElementById("search-input");

    // Load entries from localStorage
    loadFolders();
    // Character counter
    diaryEntryInput.addEventListener("input", function() {
        const length = diaryEntryInput.value.length;
        charCounter.textContent = `${length}/500`;
    });

    // Save new entry
    saveButton.addEventListener("click", function() {
        const diaryEntry = diaryEntryInput.value.trim();

        if (diaryEntry === "") {
            alert("Please write something before saving!");
            return;
        }

        const entry = {
            text: diaryEntry,
            date: new Date().toLocaleString(),
            favorite: false
        };

        saveEntry(entry);
        diaryEntryInput.value = "";
        charCounter.textContent = "0/500";
    });

    // Save entry to localStorage and reload folders
    function saveEntry(entry) {
        const date = new Date();
        const folderName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const folders = JSON.parse(localStorage.getItem("folders")) || {};
        
        if (!folders[folderName]) {
            folders[folderName] = [];
        }
        
        folders[folderName].push(entry);
        localStorage.setItem("folders", JSON.stringify(folders));
        loadFolders();
    }

    // Load folders from localStorage
    function loadFolders() {
        const folders = JSON.parse(localStorage.getItem("folders")) || {};
        folderList.innerHTML = "";

        Object.keys(folders).forEach(folderName => {
            const folderItem = document.createElement("li");
            folderItem.classList.add("list-group-item");
            folderItem.innerHTML = `
                <h3>${folderName}</h3>
                <ul class="entry-list list-group"></ul>
            `;

            const entryList = folderItem.querySelector(".entry-list");
            folders[folderName].forEach((entry, index) => {
                const listItem = document.createElement("li");
                listItem.classList.add("list-group-item");
                listItem.innerHTML = `
                    <p>${entry.text}</p>
                    <span class="text-muted">Written on: ${entry.date}</span>
                    <div class="button-container mt-2">
                        <button class="btn btn-outline-warning btn-sm favorite" data-folder="${folderName}" data-index="${index}">${entry.favorite ? "Unfavorite" : "Favorite"}</button>
                        <button class="btn btn-outline-primary btn-sm edit" data-folder="${folderName}" data-index="${index}">Edit</button>
                        <button class="btn btn-outline-danger btn-sm delete" data-folder="${folderName}" data-index="${index}">Delete</button>
                        <button class="btn btn-outline-info btn-sm read-more" data-folder="${folderName}" data-index="${index}">Read More</button>
                    </div>
                `;

                // Favorite button functionality
                listItem.querySelector(".favorite").addEventListener("click", function() {
                    toggleFavorite(folderName, index);
                });

                // Edit button functionality
                listItem.querySelector(".edit").addEventListener("click", function() {
                    diaryEntryInput.value = entry.text;
                    removeEntry(folderName, index);
                });

                // Delete button functionality
                listItem.querySelector(".delete").addEventListener("click", function() {
                    if (confirm("Are you sure you want to delete this entry?")) {
                        removeEntry(folderName, index);
                    }
                });

                // Read More button functionality
                listItem.querySelector(".read-more").addEventListener("click", function() {
                    const p = listItem.querySelector("p");
                    if (p.classList.contains("expanded")) {
                        p.classList.remove("expanded");
                        this.textContent = "Read More";
                    } else {
                        p.classList.add("expanded");
                        this.textContent = "Read Less";
                    }
                });

                entryList.appendChild(listItem);
            });

            folderList.appendChild(folderItem);
        });
    }

    // Remove entry from localStorage and reload folders
    function removeEntry(folderName, index) {
        const folders = JSON.parse(localStorage.getItem("folders")) || {};
        folders[folderName].splice(index, 1);
        if (folders[folderName].length === 0) {
            delete folders[folderName];
        }
        localStorage.setItem("folders", JSON.stringify(folders));
        loadFolders();
    }

    // Toggle favorite status
    function toggleFavorite(folderName, index) {
        const folders = JSON.parse(localStorage.getItem("folders")) || {};
        folders[folderName][index].favorite = !folders[folderName][index].favorite;
        localStorage.setItem("folders", JSON.stringify(folders));
        loadFolders();
    }

    // Toggle dark mode
    toggleThemeButton.addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
        const isDarkMode = document.body.classList.contains("dark-mode");
        toggleThemeButton.textContent = isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
    });

    // Search functionality
    searchInput.addEventListener("input", function() {
        const searchTerm = searchInput.value.toLowerCase();
        const folders = JSON.parse(localStorage.getItem("folders")) || {};
        folderList.innerHTML = "";

        Object.keys(folders).forEach(folderName => {
            const folderItem = document.createElement("li");
            folderItem.classList.add("list-group-item");
            folderItem.innerHTML = `
                <h3>${folderName}</h3>
                <ul class="entry-list list-group"></ul>
            `;

            const entryList = folderItem.querySelector(".entry-list");
            folders[folderName].filter(entry => entry.text.toLowerCase().includes(searchTerm)).forEach((entry, index) => {
                const listItem = document.createElement("li");
                listItem.classList.add("list-group-item");
                listItem.innerHTML = `
                    <p>${entry.text}</p>
                    <span class="text-muted">Written on: ${entry.date}</span>
                    <div class="button-container mt-2">
                        <button class="btn btn-outline-warning btn-sm favorite" data-folder="${folderName}" data-index="${index}">${entry.favorite ? "Unfavorite" : "Favorite"}</button>
                        <button class="btn btn-outline-primary btn-sm edit" data-folder="${folderName}" data-index="${index}">Edit</button>
                        <button class="btn btn-outline-danger btn-sm delete" data-folder="${folderName}" data-index="${index}">Delete</button>
                        <button class="btn btn-outline-info btn-sm read-more" data-folder="${folderName}" data-index="${index}">Read More</button>
                    </div>
                `;

                // Favorite button functionality
                listItem.querySelector(".favorite").addEventListener("click", function() {
                    toggleFavorite(folderName, index);
                });

                // Edit button functionality
                listItem.querySelector(".edit").addEventListener("click", function() {
                    diaryEntryInput.value = entry.text;
                    removeEntry(folderName, index);
                });

                // Delete button functionality
                listItem.querySelector(".delete").addEventListener("click", function() {
                    if (confirm("Are you sure you want to delete this entry?")) {
                        removeEntry(folderName, index);
                    }
                });

                // Read More button functionality
                listItem.querySelector(".read-more").addEventListener("click", function() {
                    const p = listItem.querySelector("p");
                    if (p.classList.contains("expanded")) {
                        p.classList.remove("expanded");
                        this.textContent = "Read More";
                    } else {
                        p.classList.add("expanded");
                        this.textContent = "Read Less";
                    }
                });

                entryList.appendChild(listItem);
            });

            folderList.appendChild(folderItem);
        });
    });
});
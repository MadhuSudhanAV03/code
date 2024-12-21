function fileadd() {
    const fileInput = document.getElementById('reportchoose');
    fileInput.style.display = 'block'; // Make file input visible
}

function displayFileDetails() {
    const fileInput = document.getElementById('reportchoose');
    const fileDetails = document.getElementById('fileDetails');

    // Create or find the existing list
    let list = fileDetails.querySelector('ul');
    if (!list) {
        list = document.createElement('ul');
        fileDetails.appendChild(list);
    }

    // Loop through newly selected files and add them to the list
    for (const file of fileInput.files) {
        // Check if the file is already listed
        const existingItem = Array.from(list.children).find(
            (item) => item.textContent.includes(file.name)
        );

        if (!existingItem) {
            const listItem = document.createElement('li');
            const now = new Date();
            const dateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

            // Create file detail text
            listItem.textContent = `File: ${file.name} | Date and Time: ${dateTime}`;

            // Append new list item
            list.appendChild(listItem);
        }
    }
}

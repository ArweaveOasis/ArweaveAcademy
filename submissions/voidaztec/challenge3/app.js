// Element References
const fetchDataButton = document.getElementById("fetch-data");
const dataContainer = document.getElementById("data-container");

// Fetch and Render Data
fetchDataButton.addEventListener("click", () => {
    dataContainer.innerHTML = "<p>Loading...</p>";
    fetch("https://jsonplaceholder.typicode.com/posts/1")
        .then((response) => response.json())
        .then((data) => {
            dataContainer.innerHTML = `
                <h2>${data.title}</h2>
                <p>${data.body}</p>
            `;
        })
        .catch((error) => {
            dataContainer.innerHTML = `<p>Error fetching data: ${error}</p>`;
        });
});

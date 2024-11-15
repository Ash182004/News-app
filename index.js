const apiKey = '47d2b15880774502bc1dc53b179cf980';
const blogcontainer = document.getElementById('blog-container');
const searchField = document.getElementById('search-field');
const searchbutton = document.getElementById('search-button');

// Fetch random news
async function fetchRandomNews() {
    try {
        const apiUrl = `https://newsapi.org/v2/everything?q=tesla&pageSize=16&apiKey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data);
        return data.articles;
    } catch (error) {
        console.error("try again after sometime", error);
        return [];
    }
}

// Event listener for search button
searchbutton.addEventListener("click", async (event) => {
    event.preventDefault();  // Prevent form submission
    const query = searchField.value.trim();
    if (query !== "") {
        try {
            const articles = await fetchNewsQuery(query);
            displayBlogs(articles);
        } catch (error) {
            console.log("Error fetching news by query", error);
        }
    }
});

// Fetch news based on search query
async function fetchNewsQuery(query) {
    try {
        const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=16&apiKey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data);
        return data.articles;
    } catch (error) {
        console.error("try again after sometime", error);
        return [];
    }
}

// Display news articles
function displayBlogs(articles) {
    blogcontainer.innerHTML = "";  // Clear previous content
    const row = document.createElement("div");
    row.classList.add("row", "row-cols-1", "row-cols-sm-2", "row-cols-md-3", "g-3");  // Bootstrap grid

    // Filter articles with missing or placeholder data
    const validArticles = articles.filter(article => 
        article.title && article.title !== "[Removed]" &&
        article.description && article.description !== "[Removed]" &&
        article.urlToImage && article.urlToImage !== "[Removed]"
    );

    // Display only valid articles
    validArticles.forEach((article) => {
        const blogCard = document.createElement("div");
        blogCard.classList.add("col", "mb-4"); // Bootstrap column and margin for spacing

        const card = document.createElement("div");
        card.classList.add("card", "shadow-sm"); // Bootstrap card with shadow

        // Image
        const img = document.createElement("img");
        img.classList.add("card-img-top");
        img.src = article.urlToImage;
        img.alt = article.title;

        // Card Body
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        // Title
        const title = document.createElement("h5");
        title.classList.add("card-title");
        const truncatedTitle = article.title.length > 30 ? article.title.slice(0, 30) + "...." : article.title;
        title.textContent = truncatedTitle;

        // Description
        const description = document.createElement("p");
        description.classList.add("card-text");
        const truncatedDescription = article.description.length > 120 ? article.description.slice(0, 120) + "...." : article.description;
        description.textContent = truncatedDescription;

        // Button
        const readMore = document.createElement("a");
        readMore.classList.add("btn", "btn-primary", "btn-sm");
        readMore.href = article.url;
        readMore.target = "_blank";
        readMore.textContent = "Read More";

        // Appending elements
        cardBody.append(title, description, readMore);
        card.append(img, cardBody);
        blogCard.append(card);
        row.append(blogCard);  // Append each card to the row
    });

    blogcontainer.appendChild(row);  // Append the row to the container

    // If no valid articles, display a message
    if (validArticles.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No articles available to display.";
        blogcontainer.appendChild(message);
    }
}


// Fetch and display random news on page load
(async () => {
    try {
        const articles = await fetchRandomNews();
        displayBlogs(articles);
    } catch (error) {
        console.error("error fetching random news", error);
    }
})();

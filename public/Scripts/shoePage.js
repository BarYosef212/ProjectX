const NEWSAPI = '451b692b89b63a71cac1af53ad4c43bc'; // Your API key
const baseURL = `https://api.mediastack.com/v1/news`;

// Function to fetch articles about shoes and fashion
function fetchArticles() {
    const query = 'shoes,fashion'; // Keywords for fetching articles
    const url = `${baseURL}?access_key=${NEWSAPI}&keywords=${encodeURIComponent(query)}&sources=cnn,bbc&categories=sports,general&languages=-en`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse the response as JSON
        })
        .then(data => {
            const articlesContainer = document.getElementById('articles-container');
            // Clear existing articles
            articlesContainer.innerHTML = '';

            // Check if there are articles
            if (data.data && data.data.length > 0) {
                data.data.forEach(article => {
                    // Create a new article element
                    const articleDiv = document.createElement('div');
                    articleDiv.classList.add('article');

                    // Create a title element
                    const title = document.createElement('h2');
                    title.classList.add('article-title');
                    title.innerText = article.title;

                    // Create a link to the article
                    const link = document.createElement('a');
                    link.href = article.url; // Link to the article
                    link.target = '_blank'; // Open link in a new tab
                    link.innerText = 'Read more';
                    
                    // Append title and link to the article div
                    articleDiv.appendChild(title);
                    articleDiv.appendChild(link);

                    // Append the article div to the container
                    articlesContainer.appendChild(articleDiv);
                });
            } else {
                articlesContainer.innerHTML = '<p>No articles found.</p>';
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            document.getElementById('articles-container').innerHTML = '<p>Failed to load articles. Please try again later.</p>';
        });
}

// Fetch articles initially and then every 30 seconds
fetchArticles(); // Fetch once on load
setInterval(fetchArticles, 30000); // Fetch every 30 seconds

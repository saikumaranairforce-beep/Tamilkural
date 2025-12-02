document.addEventListener('DOMContentLoaded', () => {
    // 1. Get references to the HTML elements
    const quoteTextElement = document.getElementById('quoteText');
    const quoteAuthorElement = document.getElementById('quoteAuthor');
    const fetchButton = document.getElementById('fetchQuoteButton');
    //const fetchMeanButton = document.getElementById('fetchMeanButton');

    // 2. Define the API endpoint
    const API_URL = 'https://api.adviceslip.com/advice';

    // 3. Define the main function to fetch the quote
    async function fetchNewQuote() {
        // Simple loading state feedback
        quoteTextElement.textContent = "Fetching a wisdom nugget...";
        quoteAuthorElement.textContent = "- Loading";
        fetchButton.disabled = true; // Disable button during fetch
        quantity=document.getElementById("quantity")
        try {
            // Use the fetch() API to get data
            const response = await fetch(API_URL);
            
            // Check if the request was successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse the JSON response body
           // const data = await response.json();
            

            console.log(data);
            console.log(quantity.value);
            // Extract the quote content and author name
            const content =  data.kural[quantity.value-1]["Line1"]+data.kural[quantity.value-1]["Line2"]
            const mv = data.kural[quantity.value-1]['mv']
            const paaliyal =  data.kural[quantity.value-1]["paal_tamil"]+" "+data.kural[quantity.value-1]["iyal"]
            const author = "திருவள்ளுவர் "
            // Update the HTML elements with the new data
            quoteTextElement.innerHTML = content + "<br><br>" + mv;
            //quoteTextElement.Content = paaliyal;
            quoteAuthorElement.textContent = `- ${author}`+paaliyal;
           // quoteTextElement.textContent = mv;
        } catch (error) {
            // Handle any errors during the fetch process
            console.error("Could not fetch quote:", error);
            quoteTextElement.textContent = "Oops! Failed to load quote. Please try again.";
            quoteAuthorElement.textContent = "- System Error";
        } finally {
            // Re-enable the button regardless of success or failure
            fetchButton.disabled = false;
        }
    }

    // 4. Add the event listener to the button
    fetchButton.addEventListener('click', fetchNewQuote);

    // Fetch a quote immediately when the page loads
    fetchNewQuote();
});
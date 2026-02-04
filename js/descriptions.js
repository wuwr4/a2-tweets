
let targetTweets;

function parseTweets(runkeeper_tweets) {
	// Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	// TODO: Filter to just the written tweets

	// Convert all returned tweets to Tweet objects
	let tweet_array = [];
	for(const tweet of runkeeper_tweets) {
		tweet_array.push(new Tweet(tweet.text, tweet.created_at));
	}

	// Filter for only user written tweets
	const written_tweets = tweet_array.filter(tweet => tweet.written);
	targetTweets = written_tweets;

}

function addEventHandlerForSearch() {
	// TODO: Search the written tweets as text is entered into the search box, and add them to the table
	let textField = document.getElementById("textFilter");

	textField.addEventListener("input", (inputEvent) => {

		let tweetTable = document.getElementsByClassName("table")[0];
		let numRows = tweetTable.rows.length;

		// Clear the search
		// tweetTable.replaceChildren();
		document.getElementById("searchCount").innerHTML = 0;
		document.getElementById("searchText").innerHTML = "";

		for(let i = 1; i < numRows; i++) {
			tweetTable.deleteRow(-1);
		}

		// Update table if search query isn't empty
		if(inputEvent.target.value !== "") {

			// Find all the tweets with matching phrases
			let matchingTweets = targetTweets.filter(tweet => tweet.writtenText.includes(inputEvent.target.value));
	
			// Load in new tweets
			let rowNum = 1;
			for(const tweet of matchingTweets) {
				tweetTable.appendChild(tweet.getHTMLTableRow(rowNum));
				// tweetTable.innerHTML += tweet.getHTMLTableRow(rowNum);
	
				rowNum++;
			}

			// Update the tweet count and text
			document.getElementById("searchCount").innerHTML = matchingTweets.length;
			document.getElementById("searchText").innerHTML = inputEvent.target.value;
		}
	})
}

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);

	// Clear the question marks
	document.getElementById("searchCount").innerHTML = 0;
	document.getElementById("searchText").innerHTML = "";
});

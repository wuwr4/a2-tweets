
function parseTweets(runkeeper_tweets) {

	// Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	// An array of the retrieved tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	let num_tweets = tweet_array.length;
	
	// This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	// It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = num_tweets;	

	// Tweet Categories (1pt)

		// Calculate the counts and percentages
		let num_completed_events = 0;
		let num_live_events = 0;
		let num_achievements = 0;
		let num_miscellaneous = 0;

		let num_written = 0;

		let earliest_date = tweet_array[0].time;
		let latest_date = tweet_array[0].time;

		// Go thru each tweet 
		for(const tweet of tweet_array) {

			// Find the earliest and latest date
			if(tweet.time < earliest_date) {
				earliest_date = tweet.time;
			}

			if(tweet.time > latest_date) {
				latest_date = tweet.time;
			}

			switch(tweet.source) {
				case "completed_event":
					num_completed_events++;
					break;
				
				case "live_event":
					num_live_events++;
					break;
				
				case "achievement":
					num_achievements++;
					break;
				
				case "miscellaneous":
					num_miscellaneous++;
					break;
			}

			if(tweet.written) {
				num_written++;
			}
		}

		const formatting = {
			notation: "fixed",
			precision: 2
		};

		let percent_completed_events = math.format(num_completed_events / num_tweets * 100, formatting); 
		let percent_live_events = math.format(num_live_events / num_tweets * 100, formatting); 
		let percent_achievements = math.format(num_achievements / num_tweets * 100, formatting); 
		let percent_miscellaneous = math.format(num_miscellaneous / num_tweets * 100, formatting); 

		let percent_written = math.format(num_written / num_completed_events * 100, formatting);

		// Update the HTML
		document.getElementsByClassName("completedEvents")[0].innerHTML = num_completed_events;
		document.getElementsByClassName("completedEventsPct")[0].innerHTML = percent_completed_events + "%";

		document.getElementsByClassName("liveEvents")[0].innerHTML = num_live_events;
		document.getElementsByClassName("liveEventsPct")[0].innerHTML = percent_live_events + "%";

		document.getElementsByClassName("achievements")[0].innerHTML = num_achievements;
		document.getElementsByClassName("achievementsPct")[0].innerHTML = percent_achievements + "%";

		document.getElementsByClassName("miscellaneous")[0].innerHTML = num_miscellaneous;
		document.getElementsByClassName("miscellaneousPct")[0].innerHTML = percent_miscellaneous + "%";
 	
	// Tweet dates (1pt)

		// Options to format the date string
		const options = {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		};

		// Update the earliest date
		document.getElementById('firstDate').innerHTML = tweet_array[tweet_array.length - 1].time.toLocaleDateString("en-US", options);

		// Update the latest date
		document.getElementById('lastDate').innerHTML = tweet_array[0].time.toLocaleDateString("en-US", options);
	
	// User-written tweets (1pt)
	document.getElementsByClassName("completedEvents")[1].innerHTML = num_completed_events;
	document.getElementsByClassName("written")[0].innerHTML = num_written;
	document.getElementsByClassName("writtenPct")[0].innerHTML = percent_written + "%";
}

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {

	// Gets the tweets, then parses it
	loadSavedRunkeeperTweets().then(parseTweets);
});

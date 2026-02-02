function parseTweets(runkeeper_tweets) {
	// Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	let activities = {};
	let totalDistances = {};
	let timeDistribution = {
		weekdayCount: 0,
		weekdayTotalDistance: 0,
		weekdayAvgDistance: 0,
		weekendCount: 0,
		weekendTotalDistance: 0,
		weekendAvgDistance: 0
	};

	for(const tweet of tweet_array) {
		activity = tweet.activityType;
		distance = tweet.distance;

		// Ignore tweets without activities
		if(activity === "") {
			continue;
		}

		if(activities[activity] === undefined) {
			activities[activity] = 1;
		} else {
			activities[activity]++;
		}

		if(distance != 0) {
			if(totalDistances[activity] === undefined) {
				totalDistances[activity] = distance;
			} else {
				totalDistances[activity] += distance;
			}
		}

		if(tweet.weekday) {
			timeDistribution["weekdayCount"]++;
			timeDistribution["weekdayTotalDistance"] += distance;
		} else if(!tweet.weekday) {
			timeDistribution["weekendCount"]++;
			timeDistribution["weekendTotalDistance"] += distance;
		}
	}

	// Determine the top 3 activities
	let firstActivity;
	let secondActivity;
	let thirdActivity;

	let firstActivityCount = -Infinity;
	let secondActivityCount = -Infinity;
	let thirdActivityCount = -Infinity;

	for(const [activity, count] of Object.entries(activities)) {
		if(count > firstActivityCount) {
			firstActivity = activity;
			firstActivityCount = count;
		}
		else if(count < firstActivityCount && count > secondActivityCount) {
			secondActivity = activity;
			secondActivityCount = count;
		}
		else if(count < firstActivityCount && count < secondActivityCount && count > thirdActivityCount) {
			thirdActivity = activity;
			thirdActivityCount = count;
		}
	}

	// Calculate the average distance for the top three activities
	let firstActivityAvg = totalDistances[firstActivity] / activities[firstActivity];
	let secondActivityAvg = totalDistances[secondActivity] / activities[secondActivity];
	let thirdActivityAvg = totalDistances[thirdActivity] / activities[thirdActivity];

	let longestAvgDisanceActivity;
	let shortestAvgDistanceActivity

	// Determine the activities with the longest and shortest average distance
	
		// Find activity with the longest average distance
		if(firstActivityAvg > secondActivityAvg && firstActivityAvg > thirdActivityAvg) {
			longestAvgDisanceActivity = firstActivity;
		} else if(secondActivityAvg > firstActivityAvg && secondActivityAvg > thirdActivityAvg) {
			longestAvgDisanceActivity = secondActivity;
		} else {
			longestAvgDisanceActivity = thirdActivity;
		}

		// Find activity with the shortest average distance
		if(firstActivityAvg < secondActivityAvg && firstActivityAvg < thirdActivityAvg) {
			shortestAvgDistanceActivity = firstActivity;
		} else if(secondActivityAvg < firstActivityAvg && secondActivityAvg < thirdActivityAvg) {
			shortestAvgDistanceActivity = secondActivity;
		} else {
			shortestAvgDistanceActivity = thirdActivity;
		}

	// Determine whether the longest activities are done on weekdays or weekends
	let longestActivityDays;

	timeDistribution["weekdayAvgDistance"] = timeDistribution["weekdayTotalDistance"] / timeDistribution["weekdayCount"];
	timeDistribution["weekendAvgDistance"] = timeDistribution["weekendTotalDistance"] / timeDistribution["weekendCount"];

	if(timeDistribution["weekdayAvgDistance"] > timeDistribution["weekendAvgDistance"]) {
		longestActivityDays = "weekdays";
	} else {
		longestActivityDays = "weekends";
	}

	// Update the number of activity types logged
	document.getElementById("numberActivities").innerHTML = Object.keys(activities).length;

	// Update the most popular activities
	document.getElementById("firstMost").innerHTML = firstActivity;
	document.getElementById("secondMost").innerHTML = secondActivity;
	document.getElementById("thirdMost").innerHTML = thirdActivity;

	// Update the activities with the longest/shortest average distance
	document.getElementById("longestActivityType").innerHTML = longestAvgDisanceActivity;
	document.getElementById('shortestActivityType').innerHTML = shortestAvgDistanceActivity;

	// Update the days that the longest activities are completed (weekday or weekend)
	document.getElementById("weekdayOrWeekendLonger").innerHTML = longestActivityDays;
	
	
	// activity_vis_spec = {
	//   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	//   "description": "A graph of the number of Tweets containing each type of activity.",
	//   "data": {
	//     "values": tweet_array
	//   }
	//   // TODO: Add mark and encoding
	// };
	// vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	// TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	// Use those visualizations to answer the questions about which activities tended to be longest and when.
}

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
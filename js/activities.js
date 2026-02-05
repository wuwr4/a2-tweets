
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

		// If the activity hasn't been recorded, make a new entry,
		// else increment te existing entry
		if(activities[activity] === undefined) {
			activities[activity] = 1;
		} else {
			activities[activity]++;
		}

		// If the activity has a distance and no existing entry, make a new one,
		// else, add the distance to the existing entry
		if(distance != 0) {
			if(totalDistances[activity] === undefined) {
				totalDistances[activity] = distance;
			} else {
				totalDistances[activity] += distance;
			}

			// Add to the appropriate weekday/weekend counters
			if(tweet.weekday) {
				timeDistribution["weekdayCount"]++;
				timeDistribution["weekdayTotalDistance"] += distance;
			} else if(!tweet.weekday) {
				timeDistribution["weekendCount"]++;
				timeDistribution["weekendTotalDistance"] += distance;
			}
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
	let shortestAvgDistanceActivity;

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


	// Calculate the distances for each day (top 3 activities)
	let dayDistances = [];

	for(const tweet of tweet_array) {

		let activityName = tweet.activityType;
		let activityDate = tweet.time;
		let distanceCompleted = tweet.distance;

		// Check top 3 tweets only
		if(activityName === firstActivity || activityName === secondActivity || activityName === thirdActivity) {
			dayDistances.push({activity: activityName, date: activityDate, distance: distanceCompleted});
		}
	}

	// Convert activities[type, count] into an array of rows for VegaLite
	const activityCountData = Object.entries(activities).map(([key, value]) => 
	(
		{
			activity: key,
			count: value
		}
	));

	// TODO: Add mark and encoding
	// Table #1 - types of activities and their frequencies 
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {"values": activityCountData},
	  "mark": "bar",
	  "encoding": {
		"x": {"field": "activity", "type": "nominal", "sort": "-y"},
		"y": {"field": "count", "type": "quantitative"}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	// TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	// Use those visualizations to answer the questions about which activities tended to be longest and when.

	// Table #2 - days of the week and their distances (top 3 activities only)
	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {"values": dayDistances},
	  "mark": {"type": "bar",
		       "cornerRadiusEnd" : 3,
			   "width": {"band": 0.9}
	  		  },
	  "encoding": {
		"x": {"field": "date",
			  "title": "Day of the Week",
			  "timeUnit": "day",
			  "type": "ordinal",
			 },

		"y": {"field": "distance",
			  "title": "Total Distance (mi)",
			  "type": "quantitative",
			  "aggregate": "count"
			 },

		"color": {"field": "activity", 
			      "type": "nominal"
				 }
	  }
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	// Table #3 - days of the week and their average distances (top 3 activities only)
	distance_vis_aggregated_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {"values": dayDistances},
	  "mark": {"type": "bar",
		       "cornerRadiusEnd" : 3,
			   "width": {"band": 0.9}
	  		  },
	  "encoding": {
		"x": {"field": "date",
			  "title": "Day of the Week",
			  "timeUnit": "day",
			  "type": "ordinal",
			 },

		"y": {"field": "distance",
			  "title": "Average Distance (mi)",
			  "type": "quantitative",
			  "aggregate": "average"
			 },

		"color": {"field": "activity", 
			      "type": "nominal"
				 }
	  }

	};

	// Program the "Show Mean" button
	let switchChartButton = document.getElementById("aggregate");
	let showMean = false; // Start off showing totals

	switchChartButton.addEventListener("click", () => {
		if(showMean === true) {
			vegaEmbed('#distanceVis', distance_vis_aggregated_spec, {actions:false});
			switchChartButton.innerHTML = "Show all activities"
			showMean = false;
		} 
		else {
			vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
			switchChartButton.innerHTML = "Show means"
			showMean = true;
		}
	});
}

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
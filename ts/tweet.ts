
class Tweet {
	
    private text: string;
	time: Date;
    weekday: boolean;
    day: number;

	constructor(tweet_text: string, tweet_time: string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time); // "ddd MMM D HH:mm:ss Z YYYY"

        // Get this event's day of the week
        this.day = this.time.getDay();

        // Determine whether this event happened on a weekday or weekend
        if(this.day === 0 || this.day === 6) {
            this.weekday = false;
        } else {
            this.weekday = true;
        }
	}

	// Returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source(): string {
        if(this.text.startsWith("Just ") && (this.text.includes("completed") || this.text.includes("posted"))) {
            return "completed_event"
        }

        if(this.text.startsWith("Achieved ") && this.text.includes("personal") && this.text.includes("record")) {
            return "achievement"
        }

        if(this.text.startsWith("Watch ") && this.text.includes("#RKLive")) {
            return "live_event"
        }

        return "miscellaneous";
    }

    // Returns a boolean, whether the text includes any content written by the person tweeting.
    get written(): boolean {

        // TODO: identify whether the tweet is written
        if(this.text.includes("-")) {
            return true;
        }

        return false;
    }

    get writtenText(): string {
        if(!this.written) {
            return "";
        }

        // TODO: parse the written text from the tweet
        return this.text.slice(this.text.indexOf("-") + 2);
    }

    get activityType(): string {

        let activity: string = "";

        // We're only looking at the activities of completed_events
        if(this.source === 'completed_event') {

            // TODO: parse the activity type from the text of the tweet

            // Note: [ACTIVITY] can be multiple words
            
            // Patterns 
            // #1 "Just completed a x.xx mi [ACTIVITY] with @Runkeeper"
            // #2 "Just posted a x.xx mi [ACTIVITY] with @Runkeeper"

            // #3 "Just completed a [ACTIVITY] in x:xx:xx with @RunKeeper"
            // #4 "Just completed an [ACTIVITY] in x:xx:xx with @RunKeeper"

            // #5 "Just posted a [ACTIVITY] in x:xx:xx with @RunKeeper"
            // #6 "Just posted an [ACTIVITY] in x:xx:xx with @RunKeeper"


            // #7 "Just completed a x.xx mi [ACTIVITY] - [COMMENT]"
            // #8 "Just posted a x.xx mi [ACTIVITY] - [COMMENT]"

            // #9 "Just completed a [ACTIVITY] in x:xx:xx - [COMMENT]"
            // #10 "Just completed an [ACTIVITY] in x:xx:xx - [COMMENT]"

            // #11 "Just posted a [ACTIVITY] in x:xx:xx - [COMMENT]"
            // #12 "Just posted an [ACTIVITY] in x:xx:xx - [COMMENT]"

            let case1: boolean = this.text.includes("completed a") && (this.text.includes(" mi ") || this.text.includes(" km ")) && this.text.includes("with @Runkeeper");
            let case2: boolean = this.text.includes("posted a") && (this.text.includes(" mi ") || this.text.includes(" km ")) && this.text.includes("with @Runkeeper");
            
            let case3: boolean = this.text.includes("completed a") && this.text.includes("in") && this.text.includes(":") && this.text.includes("with @Runkeeper");
            let case4: boolean = this.text.includes("completed an") && this.text.includes("in") && this.text.includes(":") && this.text.includes("with @Runkeeper");
            
            let case5: boolean = this.text.includes("posted a") && this.text.includes("in") && this.text.includes(":") && this.text.includes("with @Runkeeper");
            let case6: boolean = this.text.includes("posted an") && this.text.includes("in") && this.text.includes(":") && this.text.includes("with @Runkeeper");


            let case7: boolean = this.text.includes("completed a") && (this.text.includes(" mi ") || this.text.includes(" km ")) && this.text.includes("-");
            let case8: boolean = this.text.includes("posted a") && (this.text.includes(" mi ") || this.text.includes(" km ")) && this.text.includes("-");
            
            let case9: boolean = this.text.includes("completed a") && this.text.includes("in") && this.text.includes(":") && this.text.includes("-");
            let case10: boolean = this.text.includes("completed an") && this.text.includes("in") && this.text.includes(":") && this.text.includes("-");
            
            let case11: boolean = this.text.includes("posted a") && this.text.includes("in") && this.text.includes(":") && this.text.includes("-");
            let case12: boolean = this.text.includes("posted an") && this.text.includes("in") && this.text.includes(":") && this.text.includes("-");


            if(case1) {
                activity = this.text.slice(this.text.indexOf(".") + 7, this.text.indexOf(" with"));
            } else if(case2) {
                activity = this.text.slice(this.text.indexOf(".") + 7, this.text.indexOf(" with"));
            } else if(case3) {
                activity = this.text.slice(17, this.text.indexOf(" in"));
            } else if(case4) {
                activity = this.text.slice(18, this.text.indexOf(" in"));
            } else if(case5) {
                activity = this.text.slice(14, this.text.indexOf(" in"));
            } else if(case6) {
                activity = this.text.slice(15, this.text.indexOf(" in"));
            } else if(case7) {
                activity = this.text.slice(this.text.indexOf(".") + 7, this.text.indexOf(" -"));
            } else if(case8) {
                activity = this.text.slice(this.text.indexOf(".") + 7, this.text.indexOf(" -"));
            } else if(case9) {
                activity = this.text.slice(17, this.text.indexOf(" in"));
            } else if(case10) {
                activity = this.text.slice(18, this.text.indexOf(" in"));
            } else if(case11) {
                activity = this.text.slice(14, this.text.indexOf(" in"));
            } else if(case12) {
                activity = this.text.slice(15, this.text.indexOf(" in"));
            }    
        }

        // Some activities are entered with weird white-spacing
        return activity.trim();
    }

    get distance(): number {

        let distance: number = 0;

        // We're only looking at the distance of completed_events
        if(this.source == 'completed_event') {

            // TODO: parse the distance in miles from the text of the tweet
            let conversionRate: number = 1.609

            // Note: [ACTIVITY] can be multiple words

            // Patterns
            // #1 "Just completed a x.xx mi/km [ACTIVITY] ..."
            // #2 "Just posted a x.xx mi/km [ACTIVITY] ..."

            let case1: boolean = this.text.includes("completed a") && (this.text.includes(" mi ") || this.text.includes(" km "));
            let case2: boolean = this.text.includes("posted a") && (this.text.includes(" mi ") || this.text.includes(" km "));

            let inMiles: boolean = this.text.includes(" mi ");

            if(case1) {
                distance = Number(this.text.slice(17, this.text.indexOf(".") + 3));
            }
            else if(case2) {
                distance = Number(this.text.slice(14, this.text.indexOf(".") + 3));
            }

            if(!inMiles) {
                distance /= conversionRate;
            }
        }

        return distance;
    }

    get link(): string {

        let linkStart = this.text.indexOf("https");
        let linkEnd = this.text.indexOf(" ", linkStart);

        let linkString = this.text.slice(linkStart, linkEnd);

        return linkString;

    }

    getHTMLTableRow(rowNumber:number) {
        // TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity

        let tableRow = document.createElement("tr");

        let rowNumberCell = document.createElement("td");
        rowNumberCell.textContent = String(rowNumber);

        let activityTypeCell = document.createElement("td");
        activityTypeCell.textContent = this.activityType;

        let textCell = document.createElement("td");

            let frontChunk = this.text.slice(0, this.text.indexOf("https"));
            let link = this.link;
            let backChunk = this.text.slice(this.text.indexOf(" ", this.text.indexOf("https")));

            let linkTag = `<a href="${link}">${link}</a>`;

        textCell.innerHTML = frontChunk + linkTag + backChunk;

        tableRow.appendChild(rowNumberCell);
        tableRow.appendChild(activityTypeCell);
        tableRow.appendChild(textCell);

        return tableRow;

        // These lines work as well, but makes the table render much, much slower
        // let row = "<tr> <td> " + rowNumber + "</td> <td> " + this.source + "</td> <td> " + this.text + "</td> </tr>";
        // return row;
    }
}
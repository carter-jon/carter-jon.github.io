const apiKey = "YOUR_API_KEY";
const calendarId = "YOUR_CALENDAR_ID";

// Fetch calendar events
fetch(
  `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`
)
  .then((response) => response.json())
  .then((data) => {
    // Parse and display events
    const events = data.items;
    events.forEach((event) => {
      const title = event.summary;
      const startTime = new Date(event.start.dateTime);
      const endTime = new Date(event.end.dateTime);

      // Display event details on your website
      console.log(`Event: ${title}, Start: ${startTime}, End: ${endTime}`);
    });
  })
  .catch((error) => {
    console.error("Error fetching calendar events:", error);
  });

const form = document.getElementById("form");
const result = document.getElementById("result");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(form);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);
  result.innerHTML = "Please wait...";

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: json,
  })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        result.innerHTML = json.message;
        result.classList.remove("text-gray-500");
        result.classList.add("text-green-500");
      } else {
        console.log(response);
        result.innerHTML = json.message;
        result.classList.remove("text-gray-500");
        result.classList.add("text-red-500");
      }
    })
    .catch((error) => {
      console.log(error);
      result.innerHTML = "Something went wrong!";
    })
    .then(function () {
      form.reset();
      setTimeout(() => {
        result.style.display = "none";
      }, 5000);
    });
});


async function getData() {
  try {
    const calendarId =
      "057b6f9a7cd766c8f662565f303a9e0b9db8df6c3dc51f2432dd38cc73f15fdf@group.calendar.google.com";
    const myKey = "AIzaSyCvFYUkBnr1x7HjcjI9chI-8np2K0iisF4";

    // Fetch calendar events from Google Calendar API
    let response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${myKey}`
    );

    // Parse JSON response
    let data = await response.json();

    // Check if the response contains items
    if (data.items && data.items.length > 0) {
      // Get reference to the events container
      const eventsContainer = document.getElementById("events-container");

      // Clear existing content in the events container
      eventsContainer.innerHTML = "";

      // Loop through each event and create HTML elements to display them
      data.items.forEach((event) => {
        // Create a div element for the event
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");

        // Create HTML content for the event
        const htmlContent = `
                    <h2>${event.summary}</h2>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p><strong>Start:</strong> ${new Date(
                      event.start.dateTime
                    ).toLocaleString()}</p>
                    <p><strong>End:</strong> ${new Date(
                      event.end.dateTime
                    ).toLocaleString()}</p>
                `;

        // Set the HTML content of the event div
        eventDiv.innerHTML = htmlContent;

        // Append the event div to the events container
        eventsContainer.appendChild(eventDiv);
      });
    } else {
      console.log("No events found.");
    }
  } catch (error) {
    console.log("Error fetching calendar events:", error);
  }
}

// Call the getData function to fetch and display calendar events
getData();
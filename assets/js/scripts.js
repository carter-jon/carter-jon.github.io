// contact form ************************************************************

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

// calendar ******************************************************************************************
async function getData() {
  try {
    const calendarId =
      "057b6f9a7cd766c8f662565f303a9e0b9db8df6c3dc51f2432dd38cc73f15fdf@group.calendar.google.com";
    const myKey = "AIzaSyCvFYUkBnr1x7HjcjI9chI-8np2K0iisF4";

    // Fetch calendar events from Google Calendar API
    let response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${myKey}`
    );
    let data = await response.json();

    // Check if the response contains items
    if (data.items && data.items.length > 0) {
      // Get reference to the accordion container
      const accordionContainer = document.getElementById("accordionEvents");

      // Group events by month
      const eventsByMonth = {};
      data.items.forEach((event) => {
        const startDate = new Date(event.start.dateTime);
        const monthYear = `${startDate.toLocaleString("default", {
          month: "long",
        })} ${startDate.getFullYear()}`;
        if (!eventsByMonth[monthYear]) {
          eventsByMonth[monthYear] = [];
        }
        eventsByMonth[monthYear].push(event);
      });

      // Get current date
      const currentDate = new Date();
      const currentMonthYear = `${currentDate.toLocaleString("default", {
        month: "long",
      })} ${currentDate.getFullYear()}`;

      let isFirstAccordionItem = true;

      // Extract month-year keys and sort them chronologically
      const sortedMonthKeys = Object.keys(eventsByMonth).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA - dateB;
      });

      // Loop through each month and create accordion items
      sortedMonthKeys.forEach((monthYear, index) => {
        // Create accordion item
        const accordionItem = document.createElement("div");
        accordionItem.classList.add("accordion-item");

        // Create accordion header
        const accordionHeader = document.createElement("h2");
        accordionHeader.classList.add("accordion-header");
        accordionHeader.innerHTML = `
          <button class="accordion-button ${
            index === 0 && monthYear === currentMonthYear
              ? "" // Don't add 'collapsed' class for the first item when it's the current month
              : "collapsed" // Add 'collapsed' class for other items or when the first item is not the current month
          }" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${monthYear.replace(
          /\s/g,
          ""
        )}" aria-expanded="${
          index === 0 && monthYear === currentMonthYear ? "true" : "false"
        }" aria-controls="collapse${monthYear.replace(/\s/g, "")}">
            ${monthYear}
        </button>
        `;

        // Create accordion collapse container
        const accordionCollapse = document.createElement("div");
        accordionCollapse.id = `collapse${monthYear.replace(/\s/g, "")}`;
        accordionCollapse.classList.add("accordion-collapse", "collapse");
        if (monthYear === currentMonthYear) {
          accordionCollapse.classList.add("show"); // Open current month accordion item
        }
        accordionCollapse.setAttribute(
          "aria-labelledby",
          `heading${monthYear.replace(/\s/g, "")}`
        );
        accordionCollapse.setAttribute("data-bs-parent", "#accordionEvents");

        // Create accordion body
        const accordionBody = document.createElement("div");
        accordionBody.classList.add("accordion-body");

        // Add events to the accordion body
        eventsByMonth[monthYear].forEach((event) => {
          const startDate = formatDate(new Date(event.start.dateTime));
          const endDate = new Date(event.end.dateTime).toLocaleString();
          const eventHtml = `
            <div class="event-item">
              <div class="event-title">${event.summary}</div>
              <div class="event-date">${startDate}</div>
              <div class="event-location">${event.location}</div>
              <div class="map-link"><a href="https://www.google.com/maps/search/?api=1&query=${encodeURI(
                event.location
              )}" target="_blank">Show Map</a></div>
            </div>
          `;
          accordionBody.innerHTML += eventHtml;
        });

        // Append accordion header, body, and collapse container
        accordionItem.appendChild(accordionHeader);
        accordionCollapse.appendChild(accordionBody);
        accordionItem.appendChild(accordionCollapse);

        // Append accordion item to the container
        accordionContainer.appendChild(accordionItem);

        isFirstAccordionItem = false;
      });
    } else {
      console.log("No events found.");
    }
  } catch (error) {
    console.log("Error fetching calendar events:", error);
  }
}

function formatDate(date) {
  const optionsDate = {
    // day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
  };
  const optionsDay = { weekday: "long" };
  const formattedDate = date.toLocaleDateString("en-GB", optionsDate);
  const day = date.toLocaleDateString("en-GB", optionsDay);

  // Add suffix to day of the month
  const dayOfMonth = date.getDate();
  let suffix = "th";
  if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
    suffix = "st";
  } else if (dayOfMonth === 2 || dayOfMonth === 22) {
    suffix = "nd";
  } else if (dayOfMonth === 3 || dayOfMonth === 23) {
    suffix = "rd";
  }

  // Construct the formatted date string
  const formattedDay = day.charAt(0).toUpperCase() + day.slice(1); // Capitalize the first letter
  return `${formattedDay}, ${dayOfMonth}${suffix} ${formattedDate}`;
}

// Call the getData function to fetch and display calendar events
getData();



// scroll
 let scrollpos = window.scrollY;
  const header = document.querySelector("nav");
 const dropdown = document.querySelector("navbar-collapse");

//  window.addEventListener("scroll", function () {
//    scrollpos = window.scrollY;
//    if (scrollpos >= 200) {
//      header.classList.add("active");
//    } else {
//      header.classList.remove("active");
//    }

//    console.log(scrollpos);
//  });


// $(function () {
//   $('.nav-link').on('click', function (event) {
//     event.preventDefault();
//     $(".navbar-collapse").collapse("hide");
//     $("html, body").animate(
//       {
//         scrollTop: $("#band").offset().top - 80,
//       },
//       1000
//     );
//   });
// });

document
  .getElementById("band-link")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    const bandSection = document.getElementById("band");
    bandSection.scrollIntoView({ behavior: "smooth" }); // Scroll to the band section smoothly
  });
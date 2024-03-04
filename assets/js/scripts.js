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
      // Group events by year
      const eventsByYear = {};
      data.items.forEach((event) => {
        const startDate = new Date(event.start.dateTime);
        const year = startDate.getFullYear();

        if (!eventsByYear[year]) {
          eventsByYear[year] = [];
        }
        eventsByYear[year].push(event);
      });

      // Get reference to the accordion container
      const accordionContainer = document.getElementById("accordionEvents");

      // Get current month and year
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // Month is zero-indexed, so we add 1

      // Loop through each year and create accordion items
      for (const year in eventsByYear) {
        // Create accordion item for the year
        const accordionItem = document.createElement("div");
        accordionItem.classList.add("accordion-item");

        // Create year header
        const yearHeader = document.createElement("h3");
        yearHeader.innerHTML = year;
        accordionItem.appendChild(yearHeader);

        // Get months with events for the current year
        const monthsWithEvents = [];
        eventsByYear[year].forEach((event) => {
          const startDate = new Date(event.start.dateTime);
          const month = startDate.getMonth() + 1; // Month is zero-indexed, so we add 1
          if (!monthsWithEvents.includes(month)) {
            monthsWithEvents.push(month);
          }
        });

        // Sort months chronologically
        monthsWithEvents.sort((a, b) => a - b);

        // Create accordion body
        const accordionBody = document.createElement("div");
        accordionBody.classList.add("accordion-body");

        // Loop through months with events and create accordion items
        monthsWithEvents.forEach((month) => {
          // Create accordion header
          const startDate = new Date(year, month - 1); // Month is zero-indexed, so we subtract 1
          const monthString = startDate.toLocaleString("en-US", {
            month: "long",
          });
          const accordionHeader = document.createElement("h2");
          accordionHeader.classList.add("accordion-header");
          accordionHeader.innerHTML = `
            <button class="accordion-button ${
              year === currentYear && month === currentMonth ? "" : "collapsed"
            }" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${year}-${month}" aria-expanded="${
            year === currentYear && month === currentMonth ? "true" : "false"
          }" aria-controls="collapse${year}-${month}">
              ${monthString}
            </button>
          `;

          // Create accordion collapse container
          const accordionCollapse = document.createElement("div");
          accordionCollapse.id = `collapse${year}-${month}`;
          accordionCollapse.classList.add("accordion-collapse", "collapse");
          if (year === currentYear && month === currentMonth) {
            accordionCollapse.classList.add("show"); // Open current month initially
          }
          accordionCollapse.setAttribute(
            "aria-labelledby",
            `heading${year}-${month}`
          );
          accordionCollapse.setAttribute("data-bs-parent", "#accordionEvents");

          // Create accordion body
          const monthEvents = eventsByYear[year].filter((event) => {
            const startDate = new Date(event.start.dateTime);
            return startDate.getMonth() + 1 === month; // Month is zero-indexed, so we add 1
          });

          // Sort events by start date
          monthEvents.sort((a, b) => {
            return new Date(a.start.dateTime) - new Date(b.start.dateTime);
          });

          // Add events to the accordion body
          monthEvents.forEach((event) => {
            const startDate = formatDate(new Date(event.start.dateTime));
            const endDate = new Date(event.end.dateTime).toLocaleString();
            const isExpired = new Date(event.start.dateTime) < currentDate;
            const eventHtml = `
              <div class="event-item ${isExpired ? "expired" : ""}">
                <div class="event-item-header">
                  <div class="event-title">${event.summary}</div>
                  <div class="map-link"><a href="https://www.google.com/maps/search/?api=1&query=${encodeURI(
                    event.location
                  )}" target="_blank"><i class="fa-solid fa-location-dot"></i> Map</a></div>
                </div>
                <div class="event-date">${startDate}</div>
                <div class="event-location">${event.location}</div>
              </div>
            `;
            accordionCollapse.innerHTML += eventHtml;
          });

          // Append accordion header and collapse container to accordion body
          accordionBody.appendChild(accordionHeader);
          accordionBody.appendChild(accordionCollapse);
        });

        // Append accordion body to accordion item
        accordionItem.appendChild(accordionBody);

        // Append accordion item to the container
        accordionContainer.appendChild(accordionItem);
      }
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

  let suffix = "th";
  const dayOfMonth = date.getDate();
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










// scroll *******************************************************************************************
let scrollpos = window.scrollY;
const header = document.querySelector(".navbar-brand");
const dropdown = document.querySelector("navbar-collapse");

 window.addEventListener("scroll", function () {
   scrollpos = window.scrollY;
   if (scrollpos >= 500) {
     header.classList.add("active");
   } else {
     header.classList.remove("active");
   }
 });

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

const menuItems = document.querySelectorAll(".nav-link");

// Loop through each menu item and attach click event listener
menuItems.forEach(function (menuItem) {
  menuItem.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    const targetId = this.getAttribute("href").substring(1); // Get target section id
    const targetSection = document.getElementById(targetId);
    let offset = 90;
    if (targetId == "about") {
      offset = 40;
    }
    const scrollPosition = targetSection.offsetTop - offset;
    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });

    const navbarCollapses = document.querySelectorAll(".navbar-collapse");

    // Iterate over each element and remove the "show" class
    navbarCollapses.forEach(function (navbarCollapse) {
      navbarCollapse.classList.remove("show");
    });
  });
});



// gallery
const imageWrapper = document.querySelector(".images");
const images = document.querySelectorAll(".images img");
const overlay = document.getElementById("overlay");
var overlayImage = overlay.querySelector("img");
images.forEach(function (image) {
  image.addEventListener("click", function (event) {
    const target = this.getAttribute("src");
    overlayImage.setAttribute("src", target);
    overlay.classList.add('active');
    imageWrapper.classList.add("dark");
  });
});

overlay.addEventListener("click", function (event) {
  overlay.classList.remove("active");
  imageWrapper.classList.remove("dark");
});
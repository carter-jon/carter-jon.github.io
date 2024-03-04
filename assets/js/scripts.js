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
    const myKey =
      "AIzaSyCvFYUkBnr1x7HjcjI9chI-8np2K0iisF4";

    // Fetch calendar events from Google Calendar API
    let response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${myKey}`
    );
    let data = await response.json();

    // Check if the response contains items
    if (data.items && data.items.length > 0) {
      // Group events by year and month
      const eventsByYear = {};
      data.items.forEach((event) => {
        const startDate = new Date(event.start.dateTime);
        const year = startDate.getFullYear();
        const month = startDate.getMonth() + 1; // Month is zero-indexed, so we add 1
        const monthYear = `${year}-${month.toString().padStart(2, "0")}`; // Format as 'YYYY-MM'

        if (!eventsByYear[year]) {
          eventsByYear[year] = {};
        }
        if (!eventsByYear[year][monthYear]) {
          eventsByYear[year][monthYear] = [];
        }
        eventsByYear[year][monthYear].push(event);
      });

      // Get reference to the accordion container
      const accordionContainer = document.getElementById("accordionEvents");

      // Get current year and month
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // Month is zero-indexed, so we add 1
      const currentMonthYear = `${currentYear}-${currentMonth.toString().padStart(2, "0")}`;

      // Sort years chronologically
      const sortedYears = Object.keys(eventsByYear).sort((a, b) => a - b);

      // Loop through each year and create accordion items
      sortedYears.forEach((year) => {
        // Create accordion item for the year
        const accordionItemYear = document.createElement("div");
        accordionItemYear.classList.add("accordion-item");

        // Create accordion header for the year
        const accordionHeaderYear = document.createElement("h2");
        accordionHeaderYear.classList.add("accordion-header");
        accordionHeaderYear.innerHTML = `
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseYear${year}" aria-expanded="true" aria-controls="collapseYear${year}">
            ${year}
          </button>
        `;

        // Create accordion collapse container for the year
        const accordionCollapseYear = document.createElement("div");
        accordionCollapseYear.id = `collapseYear${year}`;
        accordionCollapseYear.classList.add("accordion-collapse", "collapse", "show");
        accordionCollapseYear.setAttribute("aria-labelledby", `headingYear${year}`);
        accordionCollapseYear.setAttribute("data-bs-parent", "#accordionEvents");

        // Create accordion body for the year
        const accordionBodyYear = document.createElement("div");
        accordionBodyYear.classList.add("accordion-body");

        // Sort months chronologically within the year
        const sortedMonths = Object.keys(eventsByYear[year]).sort((a, b) => {
          const [monthA] = a.split("-").map(Number);
          const [monthB] = b.split("-").map(Number);
          return monthA - monthB;
        });

        // Loop through each month and create accordion items within the year
        sortedMonths.forEach((monthYear) => {
          // Create accordion item for the month within the year
          const accordionItemMonth = document.createElement("div");
          accordionItemMonth.classList.add("accordion-item");

          // Create accordion header for the month within the year
          const [month] = monthYear.split("-");
          const startDate = new Date(year, parseInt(month) - 1); // Month is zero-indexed, so we subtract 1
          const monthString = startDate.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          });
          const accordionHeaderMonth = document.createElement("h2");
          accordionHeaderMonth.classList.add("accordion-header");
          accordionHeaderMonth.innerHTML = `
            <button class="accordion-button ${
              monthYear === currentMonthYear ? "" : "collapsed"
            }" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${monthYear}" aria-expanded="${
            monthYear === currentMonthYear ? "true" : "false"
          }" aria-controls="collapse${monthYear}">
              ${monthString}
            </button>
          `;

          // Create accordion collapse container for the month within the year
          const accordionCollapseMonth = document.createElement("div");
          accordionCollapseMonth.id = `collapse${monthYear}`;
          accordionCollapseMonth.classList.add("accordion-collapse", "collapse");
          if (monthYear === currentMonthYear) {
            accordionCollapseMonth.classList.add("show"); // Open current month initially
          }
          accordionCollapseMonth.setAttribute("aria-labelledby", `heading${monthYear}`);
          accordionCollapseMonth.setAttribute("data-bs-parent", `#collapseYear${year}`);

          // Create accordion body for the month within the year
          const accordionBodyMonth = document.createElement("div");
          accordionBodyMonth.classList.add("accordion-body");

          // Sort events by start date
          eventsByYear[year][monthYear].sort((a, b) => {
            return new Date(a.start.dateTime) - new Date(b.start.dateTime);
          });

          // Add events to the accordion body for the month within the year
          eventsByYear[year][monthYear].forEach((event) => {
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
            accordionBodyMonth.innerHTML += eventHtml;
          });

          // Append accordion header, body, and collapse container for the month within the year
          accordionCollapseMonth.appendChild(accordionBodyMonth);
          accordionItemMonth.appendChild(accordionHeaderMonth);
          accordionItemMonth.appendChild(accordionCollapseMonth);

          // Append accordion item for the month within the year to the accordion body for the year
          accordionBodyYear.appendChild(accordionItemMonth);
        });

        // Append accordion header, body, and collapse container for the year
        accordionCollapseYear.appendChild(accordionBodyYear);
        accordionItemYear.appendChild(accordionHeaderYear);
        accordionItemYear.appendChild(accordionCollapseYear);

        // Append accordion item for the year to the accordion container
        accordionContainer.appendChild(accordionItemYear);
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
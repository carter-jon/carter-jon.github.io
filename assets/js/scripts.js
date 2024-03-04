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
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${myKey}`
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const eventsByYear = {};

      // Group events by year
      data.items.forEach((event) => {
        const startDate = new Date(event.start.dateTime);
        const year = startDate.getFullYear();
        const month = startDate.getMonth() + 1; // Month is zero-indexed, so add 1

        if (!eventsByYear[year]) {
          eventsByYear[year] = {};
        }
        if (!eventsByYear[year][month]) {
          eventsByYear[year][month] = [];
        }
        eventsByYear[year][month].push(event);
      });

      // Get the container element
      const container = document.getElementById("accordionEvents");

      // Output events by year and month, filtering out past months
      Object.entries(eventsByYear).forEach(([year, eventsByMonth]) => {
        // Create an h3 tag for the year
        const yearHeader = document.createElement("h3");
        yearHeader.textContent = year;
        container.appendChild(yearHeader);

        // Create accordion element for the year
        const accordion = document.createElement("div");
        accordion.classList.add("accordion", "mb-3");

        // Get the current date
        const currentDate = new Date();

        // Loop through each month in the year
        for (let month = 1; month <= 12; month++) {
          // Check if the month has events
          if (eventsByMonth[month]) {
            // Create accordion item for the month
            const accordionItem = document.createElement("div");
            accordionItem.classList.add("accordion-item");

            // Create accordion header
            const accordionHeader = document.createElement("h2");
            accordionHeader.classList.add("accordion-header");
            accordionHeader.innerHTML = `
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${year}${month}" aria-expanded="false" aria-controls="collapse${year}${month}">
                ${new Date(`${year}-${month}-01`).toLocaleString("en-US", {
                  month: "long",
                })}
              </button>
            `;

            // Create accordion collapse container
            const accordionCollapse = document.createElement("div");
            accordionCollapse.id = `collapse${year}${month}`;
            accordionCollapse.classList.add("accordion-collapse", "collapse");
            accordionCollapse.setAttribute(
              "aria-labelledby",
              `heading${year}${month}`
            );
            accordionCollapse.setAttribute(
              "data-bs-parent",
              `#accordionEvents`
            );

            // Create accordion body
            const accordionBody = document.createElement("div");
            accordionBody.classList.add("accordion-body");

            // Add events as list items
            eventsByMonth[month].forEach((event) => {
              const eventItem = document.createElement("div");
              eventItem.textContent = event.summary;
              accordionBody.appendChild(eventItem);
            });

            // Append accordion header, body, and collapse container
            accordionCollapse.appendChild(accordionBody);
            accordionItem.appendChild(accordionHeader);
            accordionItem.appendChild(accordionCollapse);

            // Append accordion item to the accordion
            accordion.appendChild(accordionItem);
          }
        }

        // Append the accordion to the container
        container.appendChild(accordion);
      });
    } else {
      console.log("No events found.");
    }
  } catch (error) {
    console.log("Error fetching calendar events:", error);
  }
}

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
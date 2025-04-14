import promotions from "./promotions.js";
import specialPromotions from "./specialPormotions.js";

const giftImages = [
  "img/icon1.png",
  "img/icon2.png",
  "img/icon3.png",
  "img/icon4.png",
  "img/icon5.png",
  "img/icon6.png",
  "img/icon7.png",
  "img/icon8.png",
  "img/icon9.png",
  "img/icon10.png",
  "img/icon11.png",
  "img/icon12.png",
  "img/icon13.png",
  "img/icon14.png",
  "img/icon15.png",
  "img/icon16.png",
  "img/icon17.png",
  "img/icon18.png",
  "img/icon19.png",
  "img/icon20.png",
  "img/icon21.png",
  "img/icon22.png",
  "img/icon23.png",
  "img/icon24.png",
  "img/icon25.png",
  "img/icon26.png",
  "img/icon27.png",
  "img/icon28.png",
];


const promotionStartDate = new Date(2025, 3, 15);
const promotionEndDate = new Date(2025, 4, 4);


let currentImageIndex = 0;
window.onload = function () {
  const today = new Date(2025, 3, 30);
const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();


  if (currentMonth === 3) {
    currentImageIndex = 8;
  } else {
    currentImageIndex = 0;
  }

  generateCalendar(currentMonth, currentYear);
};

function generateCalendar(month, year) {
  const calendarWeeksContainer = document.getElementById("calendar-weeks");
 
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const startDay = firstDay === 0 ? 7 : firstDay;

  let weekHtml = '<div class="week">';


  for (let i = 1; i < startDay; i++) {
    weekHtml += '<div class="day noDate"></div>';
  }

  for (let day = 1; day <= daysInMonth; day++) {
    weekHtml += `
      <div class="day" data-day="${day}" data-month="${month}" data-year="${year}" onclick="togglePopup(event)">
        <span class="date">${day}</span>
        <div class="surprise">
          <a class="close-btn" href="#"></a>
        </div>
      </div>
    `;
    if ((startDay + day - 1) % 7 === 0) {
      weekHtml += '</div><div class="week">';
    }
  }
  

  const remainingCells = (startDay + daysInMonth - 1) % 7;
  if (remainingCells !== 0) {
    for (let i = remainingCells; i < 7; i++) {
      weekHtml += '<div class="day noDate"></div>';
    }
  }
  weekHtml += "</div>";
  calendarWeeksContainer.innerHTML = weekHtml;

  updateCalendarStates(month, year);
}

let isAnimating = false;
function togglePopup() {
  const modal = document.getElementById("modal");

  if (isAnimating) return;
  isAnimating = true;

  if (!modal.classList.contains("active")) {
    modal.classList.add("active");
    modal.addEventListener("animationend", function handleAnimationEnd() {
      modal.removeEventListener("animationend", handleAnimationEnd);
      isAnimating = false;
    });
  } else {
    modal.classList.add("moveOut");
    modal.addEventListener("animationend", function handleAnimationEnd() {
      modal.removeEventListener("animationend", handleAnimationEnd);
      modal.classList.remove("active", "moveOut");
      isAnimating = false;
    });
  }
}
window.togglePopup = togglePopup;


function getPromotionForDate(date, promotionStartDate, promotionEndDate) {
  if (date < promotionStartDate || date >= promotionEndDate) {
    return null;
  }
  
  if (date.getFullYear() === 2025 && date.getMonth() === 3) {
    if (date.getDate() === 26 || date.getDate() === 27) {
      return specialPromotions[date.getDate()];
    }
  }
  
  let day = date.getDay();
  if (day === 0) day = 7;
  const index = day - 1;
  return promotions[index];
}

function updateCalendarStates(month, year) {

  const today = new Date(2025, 3, 30); 
  const target = $("#calendar .week .day");

  target.each(function () {
    const dayNumber = parseInt($(this).data("day"), 10);
    const cellMonth = parseInt($(this).data("month"), 10);

    const cellDate = new Date(year, cellMonth, dayNumber);
    const giftElement = $(this);

    if (cellDate.toDateString() === today.toDateString()) {
      giftElement.find(".date").addClass("today");
      giftElement.addClass("past");
    }
    if (cellDate > today) {
      giftElement.addClass("future no-click");
      giftElement.css({
        "background-image": "url(img/gift.png)",
        "background-repeat": "no-repeat",
        "background-size": "contain",
        "background-position": "center",
      });
      return;
    }


    const promo = getPromotionForDate(cellDate, promotionStartDate, promotionEndDate);
    if (promo) {
      if (giftElement.find(".surprise").html().trim() !== "") {
        giftElement.addClass("gift-open");
        if (currentImageIndex < giftImages.length) {
          const currentImage = giftImages[currentImageIndex];
          giftElement.css({
            "background-image": `url(${currentImage})`,
            "background-repeat": "no-repeat",
            "background-size": "contain",
            "background-position": "center",
          });
          currentImageIndex++; 
        }
      }
      giftElement.data("promo", promo);
    } else {
      giftElement.addClass("no-click");
      giftElement.css({
        "background-image": "none",
      });
    }
  });


  $(".day").click(function () {
    if ($(this).hasClass("future") || $(this).hasClass("no-click")) return;
    const promo = $(this).data("promo");
    if (!promo) {
      console.log("Nema promocije za ovaj dan.");
      return;
    }
    
    // Izvlačenje podataka o datumu iz data atributa
    const dayNumber = $(this).data("day");
    const monthNumber = $(this).data("month");
    const yearNumber = $(this).data("year");
    const cellDate = new Date(yearNumber, monthNumber, dayNumber);
    
    // Formatiranje datuma u željenom formatu, npr. "30. april 2025"
    const formattedDate = cellDate.toLocaleDateString("sr-RS", { day: "numeric", month: "numeric", year: "numeric" });
    
    // Generisanje popup sadržaja sa ispisanim datumom
    const popupContent = `
      <div class="header-flex ${promo.headerClass ? promo.headerClass : ''}">
        <h2><i>${promo.title}</i></h2>
        <p>${formattedDate}</p>
      </div>
      <ul class="list-top">
        <h3>${promo.subtitle}</h3>
        ${promo.description
          .map((item, index) => {
            if (index === promo.description.length - 1) {
              return `
                <div class="list-rules">
                  <i class="fa-solid fa-check"></i>
                  <li>${item}</li>
                </div>
                ${
                  promo.description1
                    ? `<ul class="sub-list">
                         ${promo.description1.map(subItem => `<li>${subItem}</li>`).join('')}
                       </ul>`
                    : ""
                }
              `;
            }
            return `
              <div class="list-rules">
                <i class="fa-solid fa-check"></i>
                <li>${item}</li>
              </div>
            `;
          })
          .join("")}
      </ul>
      <a href="${promo.link}" class="promo-link">${promo.button}</a>
    `;
    $("#modal .wrapper .content .box").html(popupContent);
    $(".header-flex").css({
      "background": `url(${promo.image})`,
      "background-size": "contain",
      "background-position": "center",
      "background-repeat": "no-repeat",
    });
    togglePopup();
  });
  
}

document.addEventListener("DOMContentLoaded", function () {
  const yearElement = document.getElementById("current-year");
  yearElement.textContent = new Date().getFullYear();
});

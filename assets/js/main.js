// --------------------------------------------------------------------------------------
//  Script for header when we scroll down it gets sticky and for navigation bar top right
let navbar = document.querySelector(".header .navbar");
document.querySelector("#nav-close").onclick = () => {
  navbar.classList.remove("active");
};
window.onscroll = () => {
  navbar.classList.remove("active");

  if (window.scrollY > 0) {
    document.querySelector(".header").classList.add("active");
  } else {
    document.querySelector(".header").classList.remove("active");
  }
};
window.onload = () => {
  if (window.scrollY > 0) {
    document.querySelector(".header").classList.add("active");
  } else {
    document.querySelector(".header").classList.remove("active");
  }
};

// --------------------------------------------------------------------------------------
//                Top right - "hamburger" script
const hamburger = document.querySelector(".hamburger");
const navigation = document.querySelector(".navigation__menu");
const header = document.querySelector(".header");
const IS_ACTIVE = "is-active"; // for hamburger
const SHOW = "show";
const WITH_BACKGROUND = "with__background";
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle(IS_ACTIVE); // for hamburger
  navigation.classList.toggle("open"); // for navigation menu
});

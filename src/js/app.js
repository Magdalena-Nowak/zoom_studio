gsap.registerPlugin(ScrollTrigger);

const titleText = "ZOOM Studio";
const titleDiv = document.querySelector(".home__title");
const time = 100;
const images = document.querySelectorAll(".team img");
const userName = document.querySelector("#name");
const userEmail = document.querySelector("#email");
const submitBtn = document.querySelector(".contact__submit");
const textArea = document.querySelector(".input-group textarea");
const confirmPopup = document.querySelector(".popup");
const confirmBtn = document.querySelector(".popup__btn");
const min = 5;
let errMessage = "";
let writing = "";
let indexText = 0;

$(document).click(function (event) {
  var clickover = $(event.target);
  var _opened = $(".navbar-collapse").hasClass("show");
  if (_opened === true && !clickover.hasClass("navbar-toggler")) {
    $(".navbar-toggler").click();
  }
});

const addLetter = () => {
  titleDiv.textContent += titleText[indexText];
  indexText++;
  if (indexText === titleText.length) clearInterval(indexTyping);
};

const indexTyping = setInterval(addLetter, time);

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#home",
    start: "top top",
    end: "+=500",
    snap: {
      snapTo: "labels",
      duration: { min: 0.2, max: 3 },
      delay: 0.2,
      ease: "power1.inOut",
    },
  },
});

tl.addLabel("start")
  .from(".home__text", { yPercent: 100, rotation: 45, opacity: 0 })
  .addLabel("position")
  .from(".home__button", { yPercent: 100, opacity: 0 })
  .addLabel("end");

let newTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#about",
    start: "top center",
    end: "+=500",
    snap: {
      snapTo: "labels",
      duration: { min: 0.2, max: 3 },
      delay: 0.2,
      ease: "power1.inOut",
    },
  },
});

newTl
  .addLabel("start")
  .from(".about h2", { yPercent: 100, opacity: 0 })
  .addLabel("position")
  .from(".about__card", {
    yPercent: -300,
    xPercent: 200,
    stagger: 0.4,
    duration: 1.5,
  })
  .addLabel("header")
  .fromTo(
    ".collapse__wrapper h2",
    { yPercent: 100, opacity: 0, delay: 1 },
    { yPercent: 0, opacity: 1 }
  )
  .addLabel("nextHeader")
  .from(".team h2", { yPercent: 100, opacity: 0, delay: 1 })
  .addLabel("end");

images.forEach((image) => {
  ScrollTrigger.create({
    trigger: image,
    start: "top center",
    end: "bottom top",
    animation: gsap.from(image, {
      skewY: "25deg",
      opacity: 0,
      stagger: 0.4,
    }),
  });
});

ScrollTrigger.create({
  trigger: "#contact",
  start: "top center",
  animation: gsap.from(".contact h2", { yPercent: 100, opacity: 0 }),
});

const showErr = (input, message) => {
  input.classList.add("alert-warning");
  input.nextElementSibling.classList.add("error");
  input.nextElementSibling.textContent = message;
};

const clearInput = (input) => {
  input.value = "";
  input.nextElementSibling.classList.remove("error");
  input.classList.remove("alert-warning");
};

const checkEmail = (input) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (emailRegex.test(input.value)) {
    input.nextElementSibling.classList.remove("error");
  } else {
    showErr(input, "E-mail jest niepoprawny");
  }
};

const checkForm = (input) => {
  input.forEach((input) => {
    if (input.value === "") {
      showErr(input, input.placeholder);
    }
  });
};

const checkLength = (input, min) => {
  if (input.value.length < min) {
    const inputAttribute = input.getAttribute("placeholder");
    errMessage = `${inputAttribute} musi składać się z min. ${min} znaków`;
    showErr(input, errMessage);
  } else {
    input.nextElementSibling.classList.remove("error");
  }
};

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  checkForm([userName, userEmail]);
  checkLength(userName, min);
  checkLength(textArea, min);
  checkEmail(userEmail);
});

confirmBtn.addEventListener("click", () => {
  confirmPopup.classList.remove("active");
});
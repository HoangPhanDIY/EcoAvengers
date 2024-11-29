let currentIndex = 0;
const slides = document.querySelectorAll(".banner-image");
const dots = document.querySelectorAll(".dot");
const slidesContainer = document.querySelector(".slides");

function showSlide(index) {
  if (index >= slides.length) {
    currentIndex = 0;
  } else if (index < 0) {
    currentIndex = slides.length - 1;
  } else {
    currentIndex = index;
  }

  slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

  updateDots();
}

function updateDots() {
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentIndex);
  });
}

function nextSlide() {
  showSlide(currentIndex + 1);
}

function prevSlide() {
  showSlide(currentIndex - 1);
}

document.querySelector(".next").addEventListener("click", nextSlide);
document.querySelector(".prev").addEventListener("click", prevSlide);

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const index = parseInt(dot.getAttribute("data-index"));
    showSlide(index);
  });
});

let slideInterval = setInterval(nextSlide, 3000);

document.querySelector(".banner").addEventListener("mouseover", () => {
  clearInterval(slideInterval);
});

document.querySelector(".banner").addEventListener("mouseout", () => {
  slideInterval = setInterval(nextSlide, 3000);
});

showSlide(0);

// thông tin sản phẩm

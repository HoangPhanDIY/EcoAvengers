const menuItems = document.querySelectorAll(".main-menu > li");
menuItems.forEach((item) => {
  let timeout;

  item.addEventListener("mouseenter", () => {
    clearTimeout(timeout);
    const submenu = item.querySelector("#sub-menu");
    if (submenu) submenu.style.display = "block";
  });

  item.addEventListener("mouseleave", () => {
    const submenu = item.querySelector("#sub-menu");
    timeout = setTimeout(() => {
      if (submenu) submenu.style.display = "none";
    }, 300); // 300ms trễ
  });
});

// search
const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-icon");
const cancelBtn = document.querySelector(".cancel-icon");
const searchInput = document.querySelector("input");
const searchData = document.querySelector(".search-data");
const social = document.querySelector(".social-media");
const account = document.querySelector(".header-list");
searchBtn.onclick = () => {
  searchBox.classList.add("active");
  searchBtn.classList.add("active");
  searchInput.classList.add("active");
  cancelBtn.classList.add("active");
  searchInput.focus();
  if (searchInput.value.trim() !== "" && social) {
    let values = searchInput.value.trim();
    social.style.display = "none";
    account.style.display = "none";
    searchData.classList.remove("active");
    searchData.innerHTML =
      "You just typed " +
      "<span style='font-weight: 500;'>" +
      values +
      "</span>";
  } else {
    searchData.textContent = "";
    social.style.display = "none";
    account.style.display = "none";
  }
};
cancelBtn.onclick = () => {
  searchBox.classList.remove("active");
  searchBtn.classList.remove("active");
  searchInput.classList.remove("active");
  cancelBtn.classList.remove("active");
  searchData.classList.toggle("active");
  searchInput.value = "";
  social.style.display = "block";
  account.style.display = "flex";
};

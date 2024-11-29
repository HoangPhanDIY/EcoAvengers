// avatar
const avatarInput = document.getElementById("avatar-input");
const avatar = document.getElementById("avatar");
const userIcon = document.getElementById("user-icon");
const userName = document.getElementById("user-name");

avatarInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatar.src = e.target.result;
      avatar.style.display = "block";
      userIcon.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

// Lấy dữ liệu tên người dùng từ file JSON
async function loadUserData() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    userName.textContent = data.fullName;
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
    userName.textContent = "Không thể tải tên";
  }
}

loadUserData();

// container
function showSection(section) {
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((sec) => (sec.style.display = "none"));

  const activeSection = document.getElementById(section);
  if (activeSection) activeSection.style.display = "block";

  updateActiveLink(section);
}

function updateActiveLink(section) {
  const links = document.querySelectorAll(".sidebar a");
  links.forEach((link) => link.classList.remove("active"));

  const linkId = `${section}-link`;
  const activeLink = document.getElementById(linkId);
  if (activeLink) activeLink.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  showSection("points");
});

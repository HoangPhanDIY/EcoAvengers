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
  showSection("account");
});

// cập nhật thông tin
// ngày sinh
document.addEventListener("DOMContentLoaded", function () {
  populateDays();
  populateMonths();
  populateYears();
});

function populateDays() {
  const daySelect = document.getElementById("day");
  for (let i = 1; i <= 31; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    daySelect.appendChild(option);
  }
}

function populateMonths() {
  const monthSelect = document.getElementById("month");
  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    monthSelect.appendChild(option);
  }
}

function populateYears() {
  const yearSelect = document.getElementById("year");
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= 1900; i--) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    yearSelect.appendChild(option);
  }
}

// cam
let video = document.getElementById("preview");
let canvas = document.getElementById("canvas");
let canvasContext = canvas.getContext("2d");
let scanning = false;
let stream;
let scanInterval;

const formContainer = document.getElementById("personal_info_form");
const cameraContainer = document.getElementById("camera-container");

document.getElementById("startButton").addEventListener("click", function () {
  if (!video.srcObject) {
    startCamera();
  }
});

function startCamera() {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    })
    .then((s) => {
      stream = s;
      video.srcObject = stream;
      video.setAttribute("playsinline", true);
      video.style.display = "block";
      scanqr.style.display = "block";
      personal_info_form.style.display = "none";
      preview.style.display = "block";
      video.play();
      scanning = true;
      startScanning();
    })
    .catch((err) => {
      console.error("Lỗi khi mở camera:", err);
      alert("Không thể truy cập camera, vui lòng kiểm tra quyền truy cập.");
    });
}

function startScanning() {
  scanInterval = setInterval(function () {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const width = video.videoWidth;
      const height = video.videoHeight;
      canvas.width = width;
      canvas.height = height;

      canvasContext.drawImage(video, 0, 0, width, height);

      let imageData = canvasContext.getImageData(0, 0, width, height);

      let code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        let data = code.data.replace(/\|+/g, "||").split("||");
        fillFormData(data);
        stopCamera();
        video.style.display = "none";
        personal_info_form.style.display = "block";
        preview.style.display = "none";
        scanqr.style.display = "none";
      }
    }
  }, 100);
}

function stopCamera() {
  scanning = false;
  clearInterval(scanInterval);
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
}

// ảnh
function scanQRCodeFromFile(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const canvasContext = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        canvasContext.drawImage(img, 0, 0, canvas.width, canvas.height);

        let imageData = canvasContext.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        let code = jsQR(imageData.data, imageData.width, imageData.height);

        if (!code) {
          const rotatedImageData = rotateImageData(imageData);
          code = jsQR(
            rotatedImageData.data,
            rotatedImageData.width,
            rotatedImageData.height
          );
        }

        if (code) {
          let data = code.data.replace(/\|+/g, "||").split("||");
          fillFormData(data);
        } else {
          document.getElementById("result").textContent =
            "Không tìm thấy mã QR trong ảnh. Vui lòng kiểm tra lại.";
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  } else {
    document.getElementById("result").textContent = "Chưa chọn ảnh.";
  }
}

function rotateImageData(imageData) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = imageData.height;
  canvas.height = imageData.width;

  context.rotate(Math.PI / 2);
  context.drawImage(imageData, 0, -canvas.height);

  return context.getImageData(0, 0, canvas.width, canvas.height);
}
// form điền
function fillFormData(data) {
  document.getElementById("idNumber").value = data[0] || "";
  document.getElementById("fullName").value = data[1] || "";

  const gender = data[3]?.trim().toLowerCase();
  const genderOptions = document.getElementsByName("gender");
  genderOptions.forEach((option) => (option.checked = false));

  if (gender === "nam") {
    document.getElementById("male").checked = true;
  } else if (gender === "nữ") {
    document.getElementById("female").checked = true;
  } else if (gender === "khác") {
    document.getElementById("other").checked = true;
  }

  const birthDate = data[2] || "";
  if (birthDate.length === 8) {
    const birthDay = birthDate.substring(0, 2);
    const birthMonth = birthDate.substring(2, 4);
    const birthYear = birthDate.substring(4, 8);

    document.getElementById("day").value = birthDay;
    document.getElementById("month").value = birthMonth;
    document.getElementById("year").value = birthYear;
  }

  const address = data[4] || "";
  if (address) {
    const addressParts = address.split(",");
    if (addressParts.length >= 3) {
      document.getElementById("province").value =
        addressParts[addressParts.length - 1]?.trim() || "";
      document.getElementById("district").value =
        addressParts[addressParts.length - 2]?.trim() || "";
      document.getElementById("ward").value =
        addressParts[addressParts.length - 3]?.trim() || "";
      document.getElementById("address").value =
        addressParts.slice(0, -3).join(",").trim() || "";
    }
  }

  const issueDate = data[5] || "";
  if (issueDate.length === 8) {
    const formattedDate = `${issueDate.slice(0, 2)}/${issueDate.slice(
      2,
      4
    )}/${issueDate.slice(4)}`;
    document.getElementById("issueDate").value = formattedDate;
  }
}

// mua hàng
// hover nav
const tabs = document.querySelectorAll(".tab-btn");

tabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    tabs.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");
  });
});

// chọn
function showTab(tabId) {
  var tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach(function (tabContent) {
    tabContent.classList.remove("active-tab");
  });

  var tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach(function (tabButton) {
    tabButton.classList.remove("active");
  });

  document.getElementById(tabId).classList.add("active-tab");
  var activeButton = document.querySelector(
    `.tab-btn[onclick="showTab('${tabId}')"]`
  );
  activeButton.classList.add("active");
}

document.addEventListener("DOMContentLoaded", function () {
  showTab("order-placed");
});

// xem chi tiết đơn hàng
// Hiển thị chi tiết đơn hàng và ẩn danh sách
function showOrderDetails(orderDetailsId) {
  // Ẩn danh sách đơn hàng
  document.getElementById("order-list").style.display = "none";

  // Hiển thị chi tiết đơn hàng tương ứng
  var orderDetails = document.getElementById(orderDetailsId);
  if (orderDetails) {
    orderDetails.style.display = "block";
  } else {
    console.error("Không tìm thấy thông tin chi tiết với ID:", orderDetailsId);
  }
}

// Quay lại danh sách đơn hàng và ẩn chi tiết
function backToOrders() {
  // Hiển thị danh sách đơn hàng
  document.getElementById("order-list").style.display = "flex";

  // Ẩn tất cả các chi tiết đơn hàng
  var allDetails = document.querySelectorAll(".order-details");
  allDetails.forEach(function (detail) {
    detail.style.display = "none";
  });
}

// Dữ liệu tiến trình giao hàng

const deliveryProgress = {
  currentStep: 2,
};

// Hàm cập nhật tiến trình giao hàng
function updateProgress() {
  const steps = document.querySelectorAll(".progress-container .step");
  steps.forEach((step, index) => {
    if (index < deliveryProgress.currentStep) {
      step.classList.add("completed");
      step.classList.remove("active");
    } else if (index === deliveryProgress.currentStep) {
      step.classList.add("active");
      step.classList.remove("completed");
    } else {
      step.classList.remove("active", "completed");
    }
  });
}

// Gọi hàm cập nhật tiến trình
updateProgress();

// Xử lý nút bấm
document.getElementById("cancel-btn").addEventListener("click", () => {
  alert("Bạn đã hủy đơn hàng!");
});

document.getElementById("contact-btn").addEventListener("click", () => {
  alert("Liên hệ người bán...");
});

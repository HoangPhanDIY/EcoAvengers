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

const formContainer = document.getElementById("personal_info_form");
const cameraContainer = document.getElementById("camera-container");

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

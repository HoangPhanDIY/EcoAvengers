// cập nhật avt
function updateAvatarPreview(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      // Hiển thị ảnh đại diện mới
      document.getElementById("avatarPreview").src = e.target.result;
    };

    reader.readAsDataURL(file);
  }
}

// hàm để chọn ảnh có QR hehe
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

//chọn quê quán

// Global variables to store the JSON data
let provincesData = [];
let districtsData = [];
let wardsData = [];

// Load data from the JSON sources
async function loadData() {
  try {
    const provincesResponse = await fetch(
      "https://api.npoint.io/ac646cb54b295b9555be"
    );
    provincesData = await provincesResponse.json();

    const districtsResponse = await fetch(
      "https://api.npoint.io/34608ea16bebc5cffd42"
    );
    districtsData = await districtsResponse.json();

    const wardsResponse = await fetch(
      "https://api.npoint.io/dd278dc276e65c68cdf5"
    );
    wardsData = await wardsResponse.json();

    // After loading data, populate the provinces dropdown
    populateProvinces();
  } catch (error) {
    console.error("Failed to load location data:", error);
  }
}

// Populate Provinces Dropdown
function populateProvinces() {
  const provinceSelect = document.getElementById("province");
  provinceSelect.innerHTML = "<option value=''>Chọn tỉnh/thành</option>";

  provincesData.forEach((province) => {
    const option = document.createElement("option");
    option.value = province.id;
    option.textContent = province.name;
    provinceSelect.appendChild(option);
  });
}

// Populate Districts Dropdown based on selected province
function populateDistricts() {
  const provinceId = document.getElementById("province").value;
  const districtSelect = document.getElementById("district");
  districtSelect.innerHTML = "<option value=''>Chọn quận/huyện</option>";
  document.getElementById("ward").innerHTML =
    "<option value=''>Chọn xã/phường</option>";

  if (provinceId) {
    const filteredDistricts = districtsData.filter(
      (district) => district.province_id === provinceId
    );

    filteredDistricts.forEach((district) => {
      const option = document.createElement("option");
      option.value = district.id;
      option.textContent = district.name;
      districtSelect.appendChild(option);
    });
  }
}

// Populate Wards Dropdown based on selected district
function populateWards() {
  const districtId = document.getElementById("district").value;
  const wardSelect = document.getElementById("ward");
  wardSelect.innerHTML = "<option value=''>Chọn xã/phường</option>";

  if (districtId) {
    const filteredWards = wardsData.filter(
      (ward) => ward.district_id === districtId
    );

    filteredWards.forEach((ward) => {
      const option = document.createElement("option");
      option.value = ward.id;
      option.textContent = ward.name;
      wardSelect.appendChild(option);
    });
  }
}

// Initialize the data loading process
loadData();

let videoStream;

// camera
function startCamera() {
  const video = document.getElementById("video");
  video.style.display = "block";

  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then((stream) => {
      videoStream = stream;
      video.srcObject = stream;
      requestAnimationFrame(scanQRCode);
    })
    .catch((error) => {
      console.error("Error accessing camera:", error);
      document.getElementById("result").innerText = "Cannot access camera.";
    });
}

let videoElement = document.getElementById("preview");
let canvasElement = document.createElement("canvas");
let canvasContext = canvasElement.getContext("2d");

let scanning = false;
let stream = null;

function startCamera() {
  if (scanning) return;

  scanning = true;
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (mediaStream) {
      stream = mediaStream;
      videoElement.srcObject = mediaStream;
      videoElement.play();
      scanQRCode();
    })
    .catch(function (err) {
      console.error("Không thể truy cập camera: ", err);
    });
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  videoElement.srcObject = null;
  scanning = false;
}

function scanQRCode() {
  if (!scanning) return;

  // Cập nhật kích thước canvas để vẽ ảnh từ video
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;

  canvasContext.drawImage(
    videoElement,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  let imageData = canvasContext.getImageData(
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  let code = jsQR(imageData.data, imageData.width, imageData.height);

  if (code) {
    // Khi mã QR được quét, điền thông tin vào form
    fillFormData(code.data);
  } else {
    // Tiếp tục quét mã QR
    requestAnimationFrame(scanQRCode);
  }
}

function fillFormData(data) {
  // Giả sử mã QR có định dạng sau: "054206007778||Phan Trần Hoàng|16082006|Nam|Thôn Chánh Nam, Xuân Thọ 1, Sông Cầu, Phú Yên|17062021"
  const normalizedData = data.split("||");

  // Điền vào các trường input
  document.getElementById("idNumber").value = normalizedData[0] || ""; // Căn cước công dân
  document.getElementById("fullName").value = normalizedData[1] || ""; // Họ tên

  // Điền giới tính (radio buttons)
  const gender = normalizedData[3]?.trim().toLowerCase();
  const genderOptions = document.getElementsByName("gender");
  genderOptions.forEach((option) => (option.checked = false)); // Bỏ chọn tất cả radio button
  if (gender === "nam") {
    document.getElementById("male").checked = true;
  } else if (gender === "nữ") {
    document.getElementById("female").checked = true;
  } else if (gender === "khác") {
    document.getElementById("other").checked = true;
  }

  // Điền ngày sinh
  const birthDate = normalizedData[2] || ""; // Ngày sinh
  if (birthDate.length === 8) {
    const day = birthDate.substring(0, 2); // Ngày
    const month = birthDate.substring(2, 4); // Tháng
    const year = birthDate.substring(4, 8); // Năm

    // Điền ngày tháng năm vào các <select>
    document.getElementById("day").value = day;
    document.getElementById("month").value = month;
    document.getElementById("year").value = year;
  }

  // Tách và điền địa chỉ
  const address = normalizedData[4] || "";
  const addressParts = address.split(",");
  if (addressParts.length >= 3) {
    document.getElementById("province").value =
      addressParts[addressParts.length - 1]?.trim();
    document.getElementById("district").value =
      addressParts[addressParts.length - 2]?.trim();
    document.getElementById("ward").value =
      addressParts[addressParts.length - 3]?.trim();
    document.getElementById("address").value = addressParts
      .slice(0, -3)
      .join(",")
      .trim();
  }

  // Điền ngày cấp
  const issueDate = normalizedData[5] || "";
  if (issueDate.length === 8) {
    document.getElementById("issueDate").value = issueDate;
  }
}

function scanQRCodeFromFile(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      const img = new Image();
      img.onload = function () {
        // Đặt kích thước canvas dựa trên ảnh
        canvas.width = img.width;
        canvas.height = img.height;
        canvasContext.drawImage(img, 0, 0, canvas.width, canvas.height);

        let imageData = canvasContext.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        // Quét mã QR từ dữ liệu hình ảnh
        let code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          // Chuẩn hóa chuỗi dữ liệu từ mã QR, thay thế dấu phân tách "|" thành "||"
          let normalizedData = code.data.replace(/\|+/g, "||").split("||");

          // Điền thông tin vào các trường input
          document.getElementById("idNumber").value = normalizedData[0] || ""; // Số CCCD
          document.getElementById("fullName").value = normalizedData[1] || ""; // Tên

          // Điền thông tin vào giới tính (radio buttons)
          const gender = normalizedData[3]?.trim().toLowerCase(); // Giới tính từ mã QR
          const genderOptions = document.getElementsByName("gender");
          genderOptions.forEach((option) => (option.checked = false)); // Bỏ chọn tất cả radio button

          if (gender === "nam") {
            document.getElementById("male").checked = true;
          } else if (gender === "nữ") {
            document.getElementById("female").checked = true;
          } else if (gender === "khác") {
            document.getElementById("other").checked = true;
          }

          // Tách ngày sinh
          const birthDate = normalizedData[2] || ""; // Ngày sinh
          if (birthDate.length === 8) {
            const day = birthDate.substring(0, 2); // Ngày
            const month = birthDate.substring(2, 4); // Tháng
            const year = birthDate.substring(4, 8); // Năm

            // Điền ngày tháng năm vào các <select>
            document.getElementById("day").value = day;
            document.getElementById("month").value = month; // Đảm bảo tháng được điền chính xác
            document.getElementById("year").value = year;
          }

          // Tách địa chỉ thành các phần
          const address = normalizedData[4] || ""; // Địa chỉ
          if (address) {
            const addressParts = address.split(","); // Tách địa chỉ theo dấu phẩy
            if (addressParts.length >= 3) {
              document.getElementById("province").value =
                addressParts[addressParts.length - 1]?.trim() || ""; // Tỉnh
              document.getElementById("district").value =
                addressParts[addressParts.length - 2]?.trim() || ""; // Quận
              document.getElementById("ward").value =
                addressParts[addressParts.length - 3]?.trim() || ""; // Xã
              document.getElementById("address").value =
                addressParts.slice(0, -3).join(",").trim() || ""; // Đường và số nhà
            }
          }

          // Ngày cấp (17062021)
          const issueDate = normalizedData[5] || "";
          if (issueDate.length === 8) {
            document.getElementById("issueDate").value = issueDate; // Ngày cấp
          }
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

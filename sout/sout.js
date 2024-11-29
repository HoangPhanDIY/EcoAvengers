document.querySelector(".checkout-btn").addEventListener("click", function () {
  const overlay = document.querySelector(".checkout-overlay");
  const checkoutContent = document.querySelector(".checkout-content");
  const cart = document.querySelector(".cart");

  // Kiểm tra nếu overlay đang hiển thị
  if (overlay.style.display === "flex") {
    // Nếu overlay đang hiển thị, chỉ ẩn overlay mà không ẩn phần thanh toán
    overlay.style.display = "none";
    cart.style.opacity = 1; // Khôi phục giỏ hàng
  } else {
    // Nếu overlay chưa hiển thị, hiển thị overlay và phần thanh toán
    overlay.style.display = "flex";
    checkoutContent.style.display = "block"; // Hiển thị phần thanh toán
    cart.style.opacity = 0.5; // Làm mờ giỏ hàng
  }
});

document.querySelector(".close-btn").addEventListener("click", function () {
  const overlay = document.querySelector(".checkout-overlay");
  const cart = document.querySelector(".cart");
  const checkoutContent = document.querySelector(".checkout-content");

  // Ẩn overlay và phần thanh toán khi đóng
  overlay.style.display = "none";
  checkoutContent.style.display = "none";
  cart.style.opacity = 1;
});

// giỏ hàng
let cartItems = [];
let totalAmount = 0;

function addToCart(checkbox) {
  const productElement = checkbox.closest(".product-list");
  const productImageSrc = productElement.querySelector(".product-image").src;
  const productName = productElement.querySelector(".product-name").innerText;
  const productPrice = parseInt(
    productElement.querySelector(".new-price").innerText.replace(/[^0-9]/g, "")
  );

  if (checkbox.checked) {
    cartItems.push({
      image: productImageSrc,
      name: productName,
      price: productPrice,
    });
    totalAmount += productPrice;
  } else {
    const itemIndex = cartItems.findIndex((item) => item.name === productName);
    if (itemIndex !== -1) {
      totalAmount -= cartItems[itemIndex].price;
      cartItems.splice(itemIndex, 1);
    }
  }

  updateCart();
}

function updateCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalAmountElement = document.getElementById("total-amount");

  cartItemsContainer.innerHTML = cartItems
    .map(
      (item) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">${item.price.toLocaleString()} VNĐ</span>
      </div>`
    )
    .join("");

  totalAmountElement.innerText = `${totalAmount.toLocaleString()} VND`;
}

function updateFinalAmount() {
  let finalAmount = productTotal - discountAmount + shippingFee;
  document.getElementById("final-amount").textContent =
    finalAmount.toLocaleString("vi-VN") + " VND";
}
updateFinalAmount();

// thoát
document.querySelector(".close-btn").addEventListener("click", function () {
  document.querySelector(".payment-info").style.display = "none";
});

let cartItems = []; // Giỏ hàng ban đầu trống
let totalAmount = 0; // Tổng tiền ban đầu là 0

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(checkbox) {
  const productElement = checkbox.closest(".product-list");
  const productImageSrc = productElement.querySelector(".product-image").src;
  const productName = productElement.querySelector(".product-name").innerText;
  const productPrice = parseInt(
    productElement.querySelector(".new-price").innerText.replace(/[^0-9]/g, "")
  );

  if (checkbox.checked) {
    // Thêm sản phẩm vào giỏ khi checkbox được chọn
    cartItems.push({
      image: productImageSrc,
      name: productName,
      price: productPrice,
    });
    totalAmount += productPrice;
  } else {
    // Xóa sản phẩm khỏi giỏ khi checkbox bị bỏ chọn
    const itemIndex = cartItems.findIndex((item) => item.name === productName);
    if (itemIndex !== -1) {
      totalAmount -= cartItems[itemIndex].price;
      cartItems.splice(itemIndex, 1);
    }
  }

  updateCart();
}

// Hàm cập nhật giỏ hàng
function updateCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalAmountElement = document.getElementById("total-amount");

  // Hiển thị các sản phẩm trong giỏ hàng
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

  // Cập nhật giá tổng
  totalAmountElement.innerText = `${totalAmount.toLocaleString()} VND`;
}

// tính tiền

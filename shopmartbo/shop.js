// Giỏ hàng sẽ được lưu trữ trong một mảng
let cart = [];

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
  // Lấy thông tin sản phẩm từ dữ liệu sản phẩm (ở đây giả sử mỗi sản phẩm có ID duy nhất)
  const product = getProductById(productId);

  // Thêm sản phẩm vào giỏ
  cart.push(product);

  // Cập nhật giỏ hàng hiển thị
  updateCart();
}

// Hàm lấy thông tin sản phẩm theo ID (dữ liệu sản phẩm sẽ được lưu trữ trong một mảng hoặc lấy từ API)
function getProductById(id) {
  const products = [
    // Các sản phẩm trong hệ thống (ví dụ)
    {
      id: 1,
      name: "Sản phẩm A",
      image: "image-a.jpg",
      sellerName: "Người bán A",
      price: 100000,
      oldPrice: 120000,
    },
    {
      id: 2,
      name: "Sản phẩm B",
      image: "image-b.jpg",
      sellerName: "Người bán B",
      price: 200000,
      oldPrice: 250000,
    },
    // Thêm các sản phẩm khác vào đây
  ];

  return products.find((product) => product.id === id);
}

// Hàm cập nhật giỏ hàng hiển thị
function updateCart() {
  const cartContainer = document.getElementById("cart");
  cartContainer.innerHTML = ""; // Xóa giỏ hàng cũ trước khi cập nhật lại

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Giỏ hàng trống</p>";
  } else {
    cart.forEach((product) => {
      const productRow = document.createElement("div");
      productRow.classList.add("product-row");

      productRow.innerHTML = `
        <div class="product-checkbox">
          <input type="checkbox" />
        </div>
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" />
        </div>
        <div class="product-details">
          <p class="product-name">${product.name}</p>
        </div>
        <a href="#" class="seller-name">${product.sellerName}</a>
        <div class="product-size">Size: L</div>
        <div class="product-quality">100%</div>
        <div class="product-price">
          <span class="old-price">${product.oldPrice} VNĐ</span>
          <span class="new-price">${product.price} VNĐ</span>
        </div>
        <div class="product-options">
          <button class="delete-button" onclick="removeFromCart(${product.id})">Xóa</button>
        </div>
      `;
      cartContainer.appendChild(productRow);
    });
  }
}

// Hàm xóa sản phẩm khỏi giỏ
function removeFromCart(productId) {
  cart = cart.filter((product) => product.id !== productId);
  updateCart(); // Cập nhật giỏ hàng sau khi xóa
}

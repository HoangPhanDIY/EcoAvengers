// Hàm tính toán tổng tiền cuối cùng
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

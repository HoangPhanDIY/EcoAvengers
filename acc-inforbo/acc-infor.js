document.getElementById("save-referral").onclick = function () {
  const referralCode = document.getElementById("referral-code").value;
  alert(`Referral code saved: ${referralCode}`);
};

document.getElementById("update-personal").onclick = function () {
  const displayName = document.getElementById("display-name").value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const idNumber = document.getElementById("id-number").value;
  const dob = document.getElementById("dob").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  alert(
    `Personal Info:\nDisplay Name: ${displayName}\nGender: ${gender}\nID Number: ${idNumber}\nDOB: ${dob}\nPhone: ${phone}\nEmail: ${email}`
  );
};

document.getElementById("update-payment").onclick = function () {
  const bankName = document.getElementById("bank-name").value;
  const accountNumber = document.getElementById("account-number").value;
  const accountHolder = document.getElementById("account-holder").value;
  alert(
    `Payment Info:\nBank Name: ${bankName}\nAccount Number: ${accountNumber}\nAccount Holder: ${accountHolder}`
  );
};

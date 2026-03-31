const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;

  const userDetails = {
    id: Date.now(),
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  localStorage.setItem("userDetails", JSON.stringify(userDetails));

  registerForm.reset();

  alert("User Registered ✅");
});

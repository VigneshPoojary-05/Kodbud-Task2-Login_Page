// Store user data
let users = [];
let currentView = "login";

// Form elements
const loginForm = document.getElementById("loginForm");
const registrationForm = document.getElementById("registrationForm");
const welcomeSection = document.getElementById("welcomeSection");
const mobileWelcome = document.getElementById("mobileWelcome");

// Show/Hide functions
function showLogin() {
  loginForm.classList.remove("hidden");
  registrationForm.classList.add("hidden");
  welcomeSection.classList.remove("hidden");
  mobileWelcome.classList.add("hidden");
  currentView = "login";
  updateWelcomeMessage();
}

function showRegistration() {
  loginForm.classList.add("hidden");
  registrationForm.classList.remove("hidden");

  if (window.innerWidth < 768) {
    welcomeSection.classList.add("hidden");
    mobileWelcome.classList.remove("hidden");
  }
  currentView = "registration";
  updateWelcomeMessage();
}

function updateWelcomeMessage() {
  const welcomeTitle = document.querySelector("#welcomeSection h1");
  const welcomeText = document.querySelector("#welcomeSection p");
  const welcomeButton = document.querySelector("#welcomeSection button");

  if (currentView === "login") {
    welcomeTitle.textContent = "Hello, Welcome!";
    welcomeText.textContent = "Don't have an account?";
    welcomeButton.textContent = "Register";
    welcomeButton.onclick = showRegistration;
  } else {
    welcomeTitle.textContent = "Welcome Back!";
    welcomeText.textContent = "Already have an account?";
    welcomeButton.textContent = "Login";
    welcomeButton.onclick = showLogin;
  }
}

// Alert functions
function showAlert(title, message, type = "success") {
  const modal = document.getElementById("alertModal");
  const icon = document.getElementById("alertIcon");
  const titleEl = document.getElementById("alertTitle");
  const messageEl = document.getElementById("alertMessage");

  titleEl.textContent = title;
  messageEl.textContent = message;

  if (type === "success") {
    icon.className = "fas fa-check-circle text-green-500 text-2xl mr-3";
  } else {
    icon.className = "fas fa-exclamation-circle text-red-500 text-2xl mr-3";
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeAlert() {
  const modal = document.getElementById("alertModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// Validation functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: minLength && hasUppercase && hasNumber && hasSymbol,
    errors: {
      minLength: !minLength,
      hasUppercase: !hasUppercase,
      hasNumber: !hasNumber,
      hasSymbol: !hasSymbol,
    },
  };
}

// Login form handler
document
  .getElementById("loginFormElement")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!username || !password) {
      showAlert("Error", "Please fill in all fields.", "error");
      return;
    }

    // Check if user exists
    const user = users.find((u) => u.username === username);

    if (!user) {
      showAlert(
        "Login Failed",
        "User not found. Please register first.",
        "error"
      );
      return;
    }

    if (user.password !== password) {
      showAlert(
        "Login Failed",
        "Password not matched. Please try again.",
        "error"
      );
      return;
    }

    showAlert("Success", "Login successful! Welcome back.", "success");
  });

// Registration form handler
document
  .getElementById("registrationFormElement")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;

    // Check if all fields are filled
    if (!username || !email || !password) {
      showAlert("Error", "Please fill in all fields.", "error");
      return;
    }

    // Validate email
    if (!validateEmail(email)) {
      showAlert(
        "Invalid Email",
        "Please enter a valid email address with @ symbol and proper domain.",
        "error"
      );
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      let errorMessage = "Password must contain:\n";
      if (passwordValidation.errors.minLength)
        errorMessage += "• At least 8 characters\n";
      if (passwordValidation.errors.hasUppercase)
        errorMessage += "• One uppercase letter\n";
      if (passwordValidation.errors.hasNumber) errorMessage += "• One number\n";
      if (passwordValidation.errors.hasSymbol) errorMessage += "• One symbol\n";

      showAlert("Invalid Password", errorMessage.replace(/\n/g, " "), "error");
      return;
    }

    // Check if user already exists
    if (users.find((u) => u.username === username)) {
      showAlert(
        "Registration Failed",
        "Username already exists. Please choose a different username.",
        "error"
      );
      return;
    }

    if (users.find((u) => u.email === email)) {
      showAlert(
        "Registration Failed",
        "Email already registered. Please use a different email.",
        "error"
      );
      return;
    }

    // Add user to storage
    users.push({ username, email, password });

    showAlert(
      "Success",
      "Registration successful! You can now login.",
      "success"
    );

    // Clear form
    document.getElementById("registrationFormElement").reset();

    // Show login form after successful registration
    setTimeout(() => {
      showLogin();
    }, 2000);
  });

// Handle responsive behavior
window.addEventListener("resize", function () {
  if (window.innerWidth >= 768) {
    welcomeSection.classList.remove("hidden");
    mobileWelcome.classList.add("hidden");
  } else if (currentView === "registration") {
    welcomeSection.classList.add("hidden");
    mobileWelcome.classList.remove("hidden");
  }
});

// Close alert when clicking outside
document.getElementById("alertModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeAlert();
  }
});

// Initialize
showLogin();

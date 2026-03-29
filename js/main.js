const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const yearNodes = document.querySelectorAll(".js-year");
const cookieBanner = document.getElementById("cookie-banner");
const acceptCookies = document.getElementById("accept-cookies");
const declineCookies = document.getElementById("decline-cookies");
const forms = document.querySelectorAll(".js-lead-form");

yearNodes.forEach((node) => {
  node.textContent = new Date().getFullYear();
});

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    siteNav.classList.toggle("is-open");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const cookiePreference = localStorage.getItem("powerguard-cookie-choice");
if (cookieBanner && cookiePreference) {
  cookieBanner.classList.add("hidden");
}

function setCookiePreference(value) {
  localStorage.setItem("powerguard-cookie-choice", value);
  if (cookieBanner) {
    cookieBanner.classList.add("hidden");
  }
}

if (acceptCookies) {
  acceptCookies.addEventListener("click", () => setCookiePreference("accepted"));
}

if (declineCookies) {
  declineCookies.addEventListener("click", () => setCookiePreference("declined"));
}

function isValidPhone(value) {
  return value.replace(/[^\d]/g, "").length >= 10;
}

forms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const status = form.querySelector(".form-status");
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const service = String(data.get("service") || "").trim();
    const preferredContact = String(data.get("preferred_contact") || "").trim();
    const formName = form.dataset.formName || "Website Form";

    if (!name || !phone || !email || !message || !service) {
      status.textContent = "Please complete all required fields before submitting.";
      status.className = "form-status error";
      return;
    }

    if (!isValidPhone(phone)) {
      status.textContent = "Please enter a valid phone number with at least 10 digits.";
      status.className = "form-status error";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      status.textContent = "Please enter a valid email address.";
      status.className = "form-status error";
      return;
    }

    const bodyLines = [
      `Form: ${formName}`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Service: ${service}`
    ];

    if (preferredContact) {
      bodyLines.push(`Preferred Contact: ${preferredContact}`);
    }

    bodyLines.push("", "Message:", message);

    const subject = encodeURIComponent(`New lead from ${formName}`);
    const body = encodeURIComponent(bodyLines.join("\n"));
    window.location.href = `mailto:info@powerguardpest.site?subject=${subject}&body=${body}`;

    status.textContent = "Your email app is opening so you can send this request. If it does not open, please call us directly.";
    status.className = "form-status success";
    form.reset();
  });
});

/* DEVELOPER: Aidan Heaney, IS117, Fall 2026 */
(function () {
  "use strict";

  /* Contact form: prepares a formatted mailto draft and confirmation summary */
  var contactForm = document.getElementById("contact-archive-form");
  var contactStatus = document.getElementById("contact-form-status");
  if (contactForm && contactStatus) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = (document.getElementById("contact-name").value || "").trim();
      var email = (document.getElementById("contact-email").value || "").trim();
      var topic = (document.getElementById("contact-topic").value || "").trim();
      var era = (document.getElementById("contact-era").value || "").trim();
      var message = (document.getElementById("contact-message").value || "").trim();

      var subject = "[NLR History] " + topic + (era ? " (" + era + ")" : "");
      var body =
        "Sender: " + name + "\n" +
        "Reply Email: " + email + "\n" +
        "Topic: " + topic + "\n" +
        "Related Era: " + era + "\n\n" +
        message;

      var mailtoHref =
        "mailto:adh34@njit.edu?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      contactStatus.hidden = false;
      contactStatus.innerHTML =
        "<strong>Draft prepared for archival review.</strong> Click " +
        '<a href="' + mailtoHref + '">open this message in your email app</a> ' +
        "or send directly to <code>adh34@njit.edu</code>.";
    });
  }

  /* Advocate page: personalizes template placeholders and copies letter text */
  var nameInput = document.getElementById("advocate-name");
  var townInput = document.getElementById("advocate-town");
  var letterBodies = document.querySelectorAll("[data-letter-template]");

  function renderLetters() {
    var senderName = (nameInput && nameInput.value.trim()) || "[Your Name]";
    var senderTown = (townInput && townInput.value.trim()) || "[Your Municipality, NJ]";
    letterBodies.forEach(function (el) {
      var template = el.getAttribute("data-letter-template") || "";
      el.textContent = template
        .replace(/\[Your Name\]/g, senderName)
        .replace(/\[Your Municipality, NJ\]/g, senderTown);
    });
  }

  if (letterBodies.length > 0) {
    letterBodies.forEach(function (el) {
      el.setAttribute("data-letter-template", el.textContent);
    });
    if (nameInput) nameInput.addEventListener("input", renderLetters);
    if (townInput) townInput.addEventListener("input", renderLetters);
  }

  document.querySelectorAll("[data-copy-letter]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetId = btn.getAttribute("data-copy-letter");
      var targetEl = targetId ? document.getElementById(targetId) : null;
      var feedback = btn.parentElement ? btn.parentElement.querySelector(".copy-feedback") : null;
      if (!targetEl) return;

      var text = targetEl.textContent || "";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          if (feedback) feedback.textContent = "Copied to clipboard.";
        }).catch(function () {
          if (feedback) feedback.textContent = "Select the letter text above and copy manually.";
        });
      } else if (feedback) {
        feedback.textContent = "Select the letter text above and copy manually.";
      }
    });
  });

  document.querySelectorAll("[data-email-letter]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetId = btn.getAttribute("data-email-letter");
      var subject = btn.getAttribute("data-letter-subject") || "Support for New Jersey Light Rail Expansion";
      var targetEl = targetId ? document.getElementById(targetId) : null;
      if (!targetEl) return;
      var text = targetEl.textContent || "";
      window.location.href =
        "mailto:?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text);
    });
  });
})();

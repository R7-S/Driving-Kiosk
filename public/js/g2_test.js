$(document).ready(function () {
  const appointmentSection = $("#appoint-det");
  const experienceCheckbox = $("#experience");
  const form = $("#g2TestForm");

  // Toggle appointment section
  if (experienceCheckbox.is(":checked")) {
    appointmentSection.hide();
  }

  experienceCheckbox.on("change", function () {
    if (this.checked) {
      appointmentSection.hide();
    } else {
      appointmentSection.show();
    }
  });

  form.on("submit", function (e) {
    e.preventDefault();

    const isExperienced = experienceCheckbox.is(":checked");
    const firstName = $("#first-name").val().trim();
    const lastName = $("#last-name").val().trim();
    const licenseNumber = $("#license-number").val().trim();
    const age = $("#age").val().trim();
    const make = $("#make").val().trim();
    const model = $("#model").val().trim();
    const year = $("#year").val().trim();
    const plateno = $("#plate-number").val().trim();
    const appointmentDate = $("#appointment-date").val();
    const selectedSlotButton = $(".slot-button.selected");
    const appointmentTime = selectedSlotButton.text();
    const appointmentId = selectedSlotButton.data("appointmentId"); // NEW

    let valid = true;
    $(".alert").remove();

    if (!firstName || !lastName || !licenseNumber || !age || !make || !model || !year || !plateno) {
      valid = false;
      $("<div class='alert'>Please fill all required fields.</div>").insertBefore("#submit");
    }

    if (!isExperienced && (!appointmentDate || !appointmentTime || !appointmentId)) {
      valid = false;
      $("<div class='alert'>Please select appointment date and time.</div>").insertBefore("#submit");
    }

    if (!valid) return;

    const payload = {
      firstName,
      lastName,
      licenseNumber,
      age,
      make,
      model,
      year,
      plateno,
      experience: isExperienced ? "yes" : "no",
    };

    if (!isExperienced) {
      payload.appointmentDate = appointmentDate;
      payload.appointmentTime = appointmentTime;
      payload.appointmentId = appointmentId; // ✅ Add to payload
    }

    fetch("/g2_test/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.redirected) {
          window.location.href = res.url;
        } else {
          return res.json();
        }
      })
      .catch((err) => console.error("Submission failed", err));
  });
});

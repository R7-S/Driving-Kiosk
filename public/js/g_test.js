$(document).ready(() => {
  $("#update").click((evt) => {
    evt.preventDefault();

    let isValid = true;

    const make = $("#make").val().trim();
    const model = $("#model").val().trim();
    const year = $("#year").val().trim();
    const plateno = $("#plate-number").val().trim();

    const appointmentDate = $("#appointment-date").val();
    const selectedSlotButton = $(".slot-button.selected");
    const appointmentTime = selectedSlotButton.text();
    const appointmentId = selectedSlotButton.data("appointmentId");

    $(".alert").remove();

    // Validate car fields
    if (!make) {
      isValid = false;
      $('<div style="color:red;" class="alert">Car Make is required.</div>').insertAfter("#make");
    }

    if (!model) {
      isValid = false;
      $('<div style="color:red;" class="alert">Car Model is required.</div>').insertAfter("#model");
    }

    const currentYear = new Date().getFullYear();
    if (!year) {
      isValid = false;
      $('<div style="color:red;" class="alert">Car Year is required.</div>').insertAfter("#year");
    } else if (!/^\d{4}$/.test(year)) {
      isValid = false;
      $('<div style="color:red;" class="alert">Car Year must be in YYYY format.</div>').insertAfter("#year");
    } else if (currentYear - year > 10) {
      isValid = false;
      $('<div style="color:red;" class="alert">Car is more than 10 years old.</div>').insertAfter("#year");
    }

    if (!plateno) {
      isValid = false;
      $('<div style="color:red;" class="alert">Plate Number is required.</div>').insertAfter("#plate-number");
    }

    // Validate appointment if booking section is visible
    if ($("#appoint-det").length && !appointmentDate) {
      isValid = false;
      $('<div style="color:red;" class="alert">Appointment date is required.</div>').insertAfter("#appointment-date");
    }

    if ($("#appoint-det").length && (!appointmentTime || !appointmentId)) {
      isValid = false;
      $('<div style="color:red;" class="alert">Please select an available time slot.</div>').insertAfter("#slot-buttons");
    }

    if (!isValid) return;

    if (!window.userData?._id) {
      alert("Session expired or user not found.");
      return;
    }

    const payload = {
      id: window.userData._id,
      carDetails: { make, model, year, plateno },
      TestType: "G", // Always mark as G Test
    };

    // Only add appointment if visible (on g_test_details.ejs)
    if ($("#appoint-det").length && appointmentId) {
      payload.appointment = {
        date: appointmentDate,
        time: appointmentTime,
        appointmentId,
      };
    }

    fetch("/g_test/update", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed.");
        return res.json();
      })
      .then(() => {
        alert("G Test booked successfully.");
        window.location.href = "/";
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Error booking G Test.");
      });
  });
});

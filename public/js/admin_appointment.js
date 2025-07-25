// public/js/admin_appointment.js
$(document).ready(function () {
  const availableTimes = [
    "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30"
  ]; // Customize as needed

  const slotButtonsContainer = $("#slot-buttons");

  function renderAdminSlotButtons() {
    slotButtonsContainer.empty();
    availableTimes.forEach((time) => {
      const button = $("<button>")
        .text(time)
        .addClass("slot-button")
        .attr("type", "button");

      button.on("click", function () {
        $(this).toggleClass("selected"); // allow multiple selection
      });

      slotButtonsContainer.append(button);
    });
  }

  $("#appointment-date").on("change", function () {
    const selectedDate = $(this).val();
    if (selectedDate) {
      $("#time-slots").removeClass("hidden");
      renderAdminSlotButtons();
    } else {
      $("#time-slots").addClass("hidden");
    }
  });

  $("#submit-button").on("click", function () {
    const selectedDate = $("#appointment-date").val();
    const selectedTimes = $(".slot-button.selected").map(function () {
      return $(this).text();
    }).get();

    if (!selectedDate || selectedTimes.length === 0) {
      alert("Please select a date and at least one time slot.");
      return;
    }

    const payload = {
      date: selectedDate,
      slots: selectedTimes,
    };

    fetch("/create-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
      })
      .catch((err) => {
        console.error("Error saving appointments:", err);
        alert("Failed to save appointments.");
      });
  });
});

$(document).ready(function () {
  // 🔄 Fetch available slots from backend for selected date
  function fetchAvailableSlots(selectedDate) {
    fetch(`/get-available-slots/${selectedDate}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.slots.length > 0) {
          renderSlotButtons(data.slots);
        } else {
          $("#slot-buttons").html("<p>No available slots for this date.</p>");
        }
      })
      .catch((error) => {
        console.error("Error fetching available slots:", error);
        alert("Error fetching available slots.");
      });
  }

  // 🔘 Render time slot buttons with correct appointmentId
  function renderSlotButtons(slots) {
    const slotButtonsContainer = $("#slot-buttons");
    slotButtonsContainer.empty();

    slots.forEach((slot) => {
      const button = $("<button>")
        .text(slot.time)
        .addClass("slot-button")
        .attr("type", "button") // ✅ Prevent accidental form submission
        .data("appointmentId", slot._id || slot.id); // ✅ Use _id, not slot.id

      button.on("click", function () {
        $(".slot-button").removeClass("selected");
        $(this).addClass("selected");

        $("#appointment-time").text(`Selected Time: ${slot.time}`);
      });

      slotButtonsContainer.append(button);
    });
  }

  // 📅 When date is changed by user
  $("#appointment-date").on("change", function () {
    const selectedDate = $(this).val();
    if (selectedDate) {
      $("#time-slots").removeClass("hidden");
      fetchAvailableSlots(selectedDate);
    } else {
      $("#time-slots").addClass("hidden");
    }
  });
});

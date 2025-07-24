$(document).ready(() => {
  $("#update").click((evt) => {
    evt.preventDefault();

    let isValid = true;

    const makeUp = $("#make").val().trim();
    const modelUp = $("#model").val().trim();
    const yearUp = $("#year").val().trim();
    const plateUp = $("#plate-number").val().trim();

    $(".alert").remove();

    if (makeUp === "") {
      isValid = false;
      $('<div style="color:red;" class="alert">Car Make is required.</div>').insertAfter('#make');
    }

    if (modelUp === "") {
      isValid = false;
      $('<div style="color:red;" class="alert">Car Model is required.</div>').insertAfter('#model');
    }

    const currentYear = new Date().getFullYear();
    if (yearUp === "") {
      isValid = false;
      $('<div style="color:red;" class="alert">Car Year is required.</div>').insertAfter('#year');
    } else if (!/^\d{4}$/.test(yearUp)) {
      isValid = false;
      $('<div style="color:red;" class="alert">Car Year must be in YYYY format.</div>').insertAfter('#year');
    } else if (currentYear - yearUp > 10) {
      isValid = false;
      $('<div style="color:red;" class="alert">Car is more than 10 years old.</div>').insertAfter('#year');
    }

    if (plateUp === "") {
      isValid = false;
      $('<div style="color:red;" class="alert">Plate Number is required.</div>').insertAfter('#plate-number');
    }

    if (!isValid) return;

    const car = {
      make: makeUp,
      model: modelUp,
      year: yearUp,
      plateno: plateUp,
    };

    if (!window.userData?._id) {
      alert("Session expired or user not found.");
      return;
    }

    const dataUpdate = {
      id: window.userData._id,
      licenseNumber: window.userData.licenseNumber,
      carDetails: car,
    };

    fetch("/g_test/update", {
      method: "POST",
      body: JSON.stringify(dataUpdate),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed.");
        return res.text();
      })
      .then((msg) => {
        alert("G Test details submitted successfully.");
        window.location.href = "/";
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Error submitting G Test details.");
      });
  });
});

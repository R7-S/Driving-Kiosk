
$(document).ready(() => {
    $("form").submit((evt) => {
      let isValid = true;
  
      const password = $("#password").val();
      const confirmPassword = $("#confirmPassword").val();
  
     
      $(".alert").remove();
  
      
      if (password !== confirmPassword) {
        isValid = false;
        $('<div style="color:red;" class="alert">Passwords do not match.</div>')
          .insertAfter("#confirmPassword");
      }
  
      if (!isValid) {
        evt.preventDefault();
      }
    });
  });
  

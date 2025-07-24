$(document).ready(function () {
    
    function fetchExaminerDashboard() {
        $.ajax({
            url: "/examiner-dashboard", 
            method: "GET",
            dataType: "html", 
            success: function (response) {
                
                $(".appointments-container").html($(response).find(".appointments-container").html());
            },
            error: function (xhr, status, error) {
                console.error("Error fetching dashboard data:", error);
                
                $(".appointments-container").html(
                    `<div class="error-message">Failed to load dashboard data. Please try again later.</div>`
                );
            },
        });
    }

    
    fetchExaminerDashboard();

    
    $("#refresh-dashboard").click(function () {
        fetchExaminerDashboard();
    });
});

function viewleader(){
    let o=document.getElementById("over").style;

    o.display="block";
}
function clo(){
    let o=document.getElementById("over").style;

    o.display="none";
}

$(document).ready(function(){
    // Function to get and display leaderboard
    function getLeaderboard() {
        $.ajax({
            type: 'GET',
            url: '/getL',
            success: function(response){
                console.log("Success. Response:", response);

                // Clear existing leaderboard rows
                $("#leaderboardBody").empty();

                // Check if the response is an array
                if (Array.isArray(response)) {
                    // Add new rows to the leaderboard table
                    $.each(response, function(index, entry) {
                        // Accessing the inner array elements
                        $("#leaderboardBody").append(
                            "<tr><td>" + entry[0] + "</td>" +
                            "<td>" + entry[1] + "</td>" +
                            "<td>" + entry[3] + "</td>" +
                            "<td>" + entry[4] + "</td>" +
                            "<td><img src='" + entry[5] + "' alt='Profile' class='profile'></td></tr>"
                        );
                    });
                } else {
                    console.error("Invalid response format. Expected an array.");
                }
            },
            error: function(error){
                console.error("Error fetching leaderboard: ", error);
            }
        });
    }

    // Call the function to get and display the leaderboard on page load
    getLeaderboard();

    // Set up interval to update leaderboard every 2 seconds
    setInterval(function() {
        getLeaderboard();
    }, 2000);
});
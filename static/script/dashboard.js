function opt(le,wi,bl,bh,h,i,d){
    var l=document.getElementById("line").style;

    l.left=le;
    l.width=wi;
    document.getElementById("home").style.color=bh;
    document.getElementById("leadbod").style.color=bl;
    document.getElementById(h).style.display="block";
    document.getElementById(i).style.display="none";
    setTimeout(function(){
        document.getElementById(h).style.opacity="1";
    document.getElementById(i).style.opacity="0";
    },100)
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

    // Submit form function remains unchanged
    $("#gameForm").submit(function(e){
        e.preventDefault();

        var val = $("#val").val();
        $.ajax({
            type: 'POST',
            url: '/game',
            data: { val: val },
            success: function(response){
                if (response.continue === "false"){
                    window.location = "/ended";
                }
                document.getElementById("congrats").style.display="block";
                document.getElementById("overlay").style.display="block";
                document.body.style.overflowY="hidden";
                $("#val").val("");
                $("#profileImage").fadeOut(300, function() {
                    $(this).attr("src", response.filepath).fadeIn(300);
                });
                $("#img_puzzle").fadeOut(300, function() {
                    $(this).attr("src", response.filepath).fadeIn(300);
                });
                console.log(response.level);
                $("#check").fadeOut(300, function() {
                    $(this).text(response.level).fadeIn(300);
                    document.getElementById("left").innerHTML="Digits left: "+check.innerHTML;
                });

                $("#tries").fadeOut(300, function() {
                    $(this).text(response.tries).fadeIn(300);
                });
            },
            error: function(error){
                if (error.responseJSON.continue === "false"){
                    document.body.innerHTML = '';

                    window.location = "/ended";
                }
                $("#error").fadeOut(300, function() {
                    document.getElementById("error").style.display="block";
                    document.getElementById("overlay").style.display="block";
                    document.body.style.overflowY="hidden";
                });
                if (error.responseJSON && error.responseJSON.tries) {
                    $("#tries").fadeOut(300, function() {
                        $(this).text(error.responseJSON.tries).fadeIn(300);
                    });
                }
            }
        });
    });
});


$(document).ready(function() {
    // Set the initial number of digits
    document.getElementById("left").innerHTML="Digits left: "+check.innerHTML;

    var initialDigits = parseInt($("#check").text());

    // Function to update the number of digits left
    function updateDigitsLeft() {
        var currentLength = $("#val").val().length;
        var digitsLeft = initialDigits - currentLength;

        // Ensure digitsLeft is non-negative
        digitsLeft = Math.max(0, digitsLeft);

        $("#left").text("Digits left: " + digitsLeft);

        // Check if the displayed count is not accurate, update it in a loop
        while (parseInt($("#check").text()) !== initialDigits) {
            initialDigits = parseInt($("#check").text());
            updateDigitsLeft();
        }
    }

    // Event handler for input and keydown events
    $("#val").on("input keydown", function() {
        updateDigitsLeft();
    });
});

    function zoom() {
        let overlays=document.getElementById("overlay").style;
        $('meta[name=viewport]').remove();
        $('head').append( '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">' );
        overlays.display = "block";
        overlays.backgroundColor = "rgba(0,0,0,0.5)";
        document.getElementById("img_puzzle").style.display = "block";
        document.getElementById("close").style.display = "block";
        }

        function clo(){
            console.log("?")
            let overlay=document.getElementById("overlay").style;
        $('meta[name=viewport]').remove();
        $('head').append( '<meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1.0, user-scalable=no">' );
        overlay.display = "none";
        document.getElementById("img_puzzle").style.display = "none";
        document.getElementById("close").style.display = "none";
       let w= document.body.offsetWidth;
       console.log(w);
        }

function bodhiet(){
    let bodheight=document.body.offsetHeight;
    let home = document.getElementById("homepage").style;
    let lead = document.getElementById("leaderboardpage").style;
    home.height=bodheight-20+"px";
    if(lead.height<=bodheight-200){
        lead.height="fit-content";
    }
    else{
        lead.height=bodheight+"px";
    }
    

}
function overlay() {
    // Add an AJAX request to /resumeTime
    $.ajax({
        type: 'POST',
        url: '/resumeTime',
        success: function(response) {
            if (response.done === 1) {
                // Server is up, execute inner procedures
                console.log("Resume time success:", response);
                document.getElementById("congrats").style.display = "none";
                document.getElementById("error").style.display = "none";
                document.getElementById("overlay").style.display = "none";
                document.body.style.overflowY="visible";
                document.getElementById("profileImage").style.width = "100%";
                document.getElementById("profileImage").style.height = "fit-content";
            } else {
                // Server is down or response.done !== 1, handle accordingly
                console.error("Server response indicates an issue:", response);
                document.getElementById("error").style.display = "none";
                document.getElementById("overlay").style.display = "none";
            }
        },
        error: function(error) {
            // Handle error response if needed
            document.getElementById("img_puzzle").style.display = "none";

            console.error("Error resuming time:", error);
            document.getElementById("congrats").style.display = "none";
                document.getElementById("error").style.display = "none";
                document.getElementById("overlay").style.display = "none";
                document.getElementById("img_puzzle").style.display = "block";

        }
    });
}


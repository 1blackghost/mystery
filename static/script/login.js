function doThis() {
	console.log("hi");
    var phone = $('#phone').val();
    var name = $('#name').val();

    $.ajax({
        type: 'POST',
        url: '/getDetails', 
        data: { phone: phone, name: name },
        success: function(response) {
            document.getElementById("continue-with-google").style.display="block";
            $("#user-info-form").fadeOut(500, function() {
                $("#continue-with-google").removeClass("hidden").hide().fadeIn(500);
            });
        },
        error: function(error) {
            $("#error").text("Error or Number Already exists!");
            document.getElementById("erro").style.display="block"
        }
    });
}

function onNextButtonClick(){
    var phone = $('#phone').val();
    var name = $('#name').val();
    if (!(phone === "" || name === "")) {
    
        doThis();
    }

}


function login(){
    var r=document.getElementById("rules");
    var l=document.getElementById("login");

    l.style.visibility="visible"
    r.style.transform="translateX(100%)";
    setTimeout(function (){r.style.display="none"},500);
    
}
function bodhiet(){
    let bodheight=document.body.offsetHeight;
    let margin = document.getElementById("reg").style;
    let back = document.getElementById("login").style;
    margin.marginTop=bodheight-700+"px";
    back.height=bodheight+"px";
}
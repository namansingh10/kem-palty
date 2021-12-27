$("#uploaddp").click(function (){
    $("#selectdp").click();
    
})

$("#uploaddp2").click(function (){
    $("#selectdp").click();
    
})
// when the user selects a file
$("#selectdp").change(function (){
    s = confirm("Are you sure you want to change your profile picture?");
    if (s == true){
      $("#okok").click();
      swal("Success!", "Your profile picture has been changed.", "success");
    }
    else{
        swal("Cancelled", "Your profile picture is safe :)", "error");
    }
});

function removedp(){
var t = confirm("Are you sure you want to remove your profile picture?");
if (t == true) {
    swal("Success!", "Your profile picture has been removed.", "success");
   setTimeout(function(){
   window.location.href = "user/dpremove";
   }, 4000);
}
else{
    swal("Cancelled", "Your profile picture is safe :)", "error");
}
}
$("#savedetta").click(function(){
    var t = confirm("Are you sure you want to save your changes?");
    if (t == true) {
        // submit form id edda
        $("#edda").submit();
    }
    else{
        swal("Cancelled", "Your changes are safe :)", "error");
    }
})

$("#media202").change(function(){
    $("#mediatemp").css("display", "none");
    $("#biotemp").css("display", "block");
    $("#biotemp").focus();
    $("#postbtn").css("display", "block");
    $("#imgshowoff").css("display", "block");

    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        // if file is an image
        if(file.type.match('image.*')) {
            $("#imgshowoff").attr('src', e.target.result);
        }
        else{
            swal("Error!", "Your file is not an image.", "error");
            setTimeout(function(){
                window.location.reload();
            }, 2000);
        }
    }
    reader.readAsDataURL(file);

})

$("#postbtn").click(function(){
    // submit form id mediaform
    $("#mediaform").submit();
    swal("Success!", "Your post has been posted.", "success");
})
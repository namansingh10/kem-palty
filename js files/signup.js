function clearerrors(){
    errors = document.getElementsByClassName('formerror');
    for(let item of errors){
        item.innerHTML = "";
    }
}
function seterror(id,error){
    //sets error inside tag of id
   element = document.getElementById(id);
   element.getElementsByClassName('formerror')[0].innerHTML = error;
}

function validateform(){
var returnval = true;
clearerrors();
var name = document.forms['myform']["name"].value;
if(name.length<5){
    seterror("name", "*Length of name is too short!!")
    returnval = false;
}
/* if(name.length==0){
    seterror("name", "*Enter your name")
    returnval = false;
}*/
var email = document.forms['myform']["email"].value;
if(email.length>50){
    seterror("email", "*Length of email is too long!!")
    returnval = false;
}
var phone = document.forms['myform']["phone"].value;
if(phone.length>12 || phone.length<10){
    seterror("phone", "*Enter a valid Phone number!!")
    returnval = false;
}

var password = document.forms['myform']["password"].value;
if(password.length<6){
    seterror("password", "*Password must contain 8 characters!!")
    returnval = false;
}
var confirm = document.forms['myform']["confirm"].value;
if(confirm != password){
    seterror("confirm", "*Passwords are not matching!!")
    returnval = false;
}
// var tick = document.forms['myform']["check"].value;
return returnval;
}

function submitform(){
    console.log("submitted");
    if(validateform()){
       uname = $('#inname').val();
       uemail = $('#inemail').val();
       uphone = $('#inphone').val();
       ugender = $('#ingender').val();
       upassword = $('#inpassword').val();
       uconfirm = $('#inc_password').val();

         $.ajax({
              url: '/signup',
              type: 'POST',
              data: {
                name: uname,
                email: uemail,
                phone: uphone,
                gender: ugender,
                password: upassword,
                confirm: uconfirm
              },
              success: (data) => {
                  data = JSON.parse(data)
                var code = data.code;
                var message = data.message;
                if(code == 200){
                    var html = '<div class="" style="background-color:white; colorblack"> '+ message +' </div>';
                    swal({
                        html: html,
                    })
                    .then((value) => {
                        window.location.href = "/pref";
                    });
                }
               
              },
              error: (err) => {
                var message = JSON.parse(err).message;
                var html = '<div class="" style="background-color:white; colorblack"> '+ message +' </div>';
                    swal({
                        html: html,
                    });
              }
            })
    }
}

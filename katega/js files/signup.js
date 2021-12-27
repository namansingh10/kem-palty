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
var tick = document.forms['myform']["check"].value;
return returnval;
}

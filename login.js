var attempt = 3; // Variable to count number of attempts.
// Below function Executes on click of login button.
var username;
var password;
var http = require('http');
function validate(){
username = document.getElementById("username").value;
password = document.getElementById("password").value;
if ( username == "admin" && password == "pwd123"){
alert ("Login successfully");
if(username == "admin"){
	http.createServer(function (req, res) {
		return res.redirect('/adminHome.html');
	}


}else{
	window.location = "studentHome.html";
}

return true;
}
else{
attempt --;// Decrementing by one.
alert("You have left "+attempt+" attempt;");
// Disabling fields after 3 attempts.
if( attempt == 0){
document.getElementById("username").disabled = true;
document.getElementById("password").disabled = true;
document.getElementById("submit").disabled = true;
return false;
}
}
}
function next(){

}


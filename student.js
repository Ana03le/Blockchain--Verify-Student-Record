var formidable = require('formidable');
var fs = require('fs');
var http = require('http');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
var defaultAcc = "";
var crypto = require('crypto');




const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Anagha123#',
  database: 'blockchain'
});


http.createServer(function (req, res) {
  if (req.url == '/filedownload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var firstname1 = fields.firstname;
      var lastname1 = fields.lastname;
      var key1 = fields.key;

      console.log(firstname1);
     
      
      setDefaultAccount();
      
    var selectQuery = 'SELECT * FROM student_data where firstname = ? AND hashvalue = ? ';
    console.log(selectQuery);
   connection.query(selectQuery, [firstname1,key1],function (err, result) {
    if (err) throw err;
    var cert = result[0].certificate;
    var buffer1 = new Buffer( cert );
    var firstname1 = result[0].firstname;
    var filename = result[0].filename;
    var newpath = __dirname + '/'+filename;

    console.log(firstname1);
    console.log(filename);
    console.log(newpath);
    res.write('<body style="background-color:#F7DC6F">');
    res.write('<a href="'+newpath+'" download="Anagha_Fatale_Transcripts.pdf"> Download it!</a>');
    res.write('</body>');
  });

});
} else {
   res.writeHead(200, {'Content-Type': 'text/html'});
   res.write('<body style="background-color:#E6E6FA">');
   res.write('<font size="7" color="#FF4500">Syracuse University</font><br><br>');
   res.write('<font size="6" color="black">Verify Student Academic Records</font>');
   res.write('<form action="filedownload" method="post" enctype="multipart/form-data">');
   res.write('<label for="uname"><b>First Name</b></label> <input type="text" placeholder="Enter First Name" name="firstname" id="firstname" required><br><br>');
   res.write(' <label for="lname"><b>Last Name</b></label> <input type="text" placeholder="Enter Last Name" name="lastname" id="lastname" required><br><br>');
   res.write('<label for="hash"><b>Certificate Key</b></label> <input type="text" placeholder="Enter Certificate Key" name="key" id="key" required><br><br>');
   res.write('<input type="submit">');
   res.write('</form></body>');
    return res.end();
  }
}).listen(8080);


function generate_hash_value(newpath){

  var fd = fs.createReadStream(newpath);
  var hash = crypto.createHash('sha1');
  var hashValueGenerated;
  hash.setEncoding('hex');
  
  fd.on('end', function() {
      hash.end();
      console.log(hash.read()); // the desired sha1sum
      hashValueGenerated=hash.read();
  });
  fd.pipe(hash);
  console.log(defaultAcc);

  var hexStr = web3.toHex({test:newpath});
  web3.eth.sendTransaction({from:defaultAcc,data:hexStr,to:defaultAcc},function(error, success) {
      if (error)
        console.log("Error Detected" + "for data:" + hashValueGenerated + " from account" 
  + web3.eth.defaultAccount );
      else 
        console.log("Successful transaction" + "for data:" +  hashValueGenerated + " from account" 
  + web3.eth.defaultAccount );
    });
     return hashValueGenerated;

  }

  /*Function to get a account from local blockchain*/
function setDefaultAccount(){
  web3.eth.getAccounts(function(error, result){
    if(!error){
      defaultAcc  = result[0];
    
    }}
  );
}
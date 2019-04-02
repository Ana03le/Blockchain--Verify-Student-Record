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


http.createServer( function (req, res) {


  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;

      newpath = __dirname + '/'+files.filetoupload.name;
      var file_name = files.filetoupload.name;
      var firstname1 = fields.firstname;
      var lastname1 = fields.lastname;
      //res.write(newpath);
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('<br><br>Certificate Uploaded!');
      });

      var buffer = fs.readFileSync(newpath);
      setDefaultAccount();
      var HashValue = generate_hash_value(res,newpath);

      var fileInsertSQL = "insert ignore into student_data(firstname, lastname, filename,hashvalue, certificate) values(?,?,?,?,?)";
    connection.query(fileInsertSQL, [firstname1 ,lastname1,file_name,HashValue,fs.readFileSync(newpath)], function (err, dbRes) {

    if(err){
        console.error(err);
    } else {
        //Do something
    }
  });

  connection.query("SELECT * FROM student_data ", function (err, result, fields) {
    if (err) throw err;
    var cert = result[0].certificate;
    var tittle = result[0].filename;
    console.log(tittle);
    console.log(cert);
    console.log(buffer);
    var buffer1 = new Buffer( cert );
    //fs.writeFileSync('anagha.pdf', buffer1);
    console.log(buffer1);
  });

});
} else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<body style="background-color:#E6E6FA">');
    res.write('<font size="7" color="#FF4500">Syracuse University</font><br><br>');
    res.write('<font size="6" color="black">Verify Student Academic Records</font>');
    res.write('<form style="background-color:#E6E6FA" action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<label for="uname"><b>First Name</b></label> <input type="text" placeholder="Enter First Name" name="firstname" id="firstname" required><br><br>');
    res.write(' <label for="lname"><b>Last Name</b></label> <input type="text" placeholder="Enter Last Name" name="lastname" id="lastname" required><br><br>');
    res.write('<input style=" width: 600px;" type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    res.write('</body>');
    return res.end();
  }
}).listen(8087);


function generate_hash_value(res,newpath){

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
  res.write('<body style="background-color:#E6E6FA">');
  res.write('<br>Generated Certificate Key: ');
  res.write(hexStr);

   web3.eth.sendTransaction({from:defaultAcc,data:hexStr,to:defaultAcc},function(error, success) {
      if (error)
        console.log("Error Detected" + "for data:" + hexStr + " from account" 
  + web3.eth.defaultAccount );
      else 
        console.log("Successful transaction" + "for data:" +  hexStr + " from account" 
  + web3.eth.defaultAccount );
    });
     return hexStr;

  }

  /*Function to get a account from local blockchain*/
function setDefaultAccount(){
  
  defaultAcc = '0x588cbbc4edaf40d7cc8667e12f04b95f14b27448';
  
}
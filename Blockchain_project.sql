create database blockchain;

use blockchain;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Anagha123#';

create table users ( username VARCHAR(25) not null,  password  varchar(25) not null);


create table student_data ( firstname VARCHAR(25) not null, lastname VARCHAR(25) not null, filename VARCHAR(100) not null,
 hashvalue VARCHAR(500) not null, certificate BLOB not null);


select * from student_data;


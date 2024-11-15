create database jurema_viva;
use jurema_viva;

create table usuario(
IdUsuario int auto_increment primary key,
nome varchar(45),
telefone char(12),
religiao varchar(45)
);

create table login(
Idlogin int auto_increment,
FkUsuario int,
email varchar(45),
senha char(8),
primary key(Idlogin,FkUsuario),
constraint FKUsuario foreign key (FkUsuario) references usuario(idUsuario)
);


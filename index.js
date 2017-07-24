let express = require('express');
let request = require('request');
let fs = require('fs');

var app = express();

// Will change in further implementation
let strCiclo = '1617';
let strPlan = '2';

let baseUrl = 'http://controlescolarmsys.edomex.gob.mx/';
let cookies = 'JSESSIONID="Vl-xd17fhm4Ou92zH6QFSyGl.host6616:server66161"; TS01631198=01df7d6382424f0e88169cfa64edd9d265cca5e4f4a515f2c2f8df5132c93db43c95d9418b9c5e0384fd935dd39b9a74b5fccd9083104cf354caad2911626ab2802d670e96; BIGipServerpool_ControlEscolarSMS=557845002.20480.0000; TS01a47c45=01df7d6382c4d0c32faa19339f5696793d2565f190fa83f089010a8cc323b4b7f44eb8d6d7ac98e465f3dca266f64e4fe1f1874213; cookiesession1=53C3C8C3QQYESRN1EAPPB1ZETART5714'

function getGroups(grado) { 
	return new Promise (function (resolve, reject) {
		request.get({
			url: `${baseUrl}SIASEBasCE/consultaGrupos/?strCiclo=${strCiclo}&strPlan=${strPlan}&strGrado=${grado}`,
			contentType : "application/json",
			dataType : "JSON",
			headers: {'cookie': cookies}
		}, function successCallback(data, status, stuff){
			let options = JSON.parse(status.body).grupos.split('"');

			let groupId = options.filter((item, index) => index === 1 || index === 3);
			let groups = options.filter((item, index) => index === 2 || index === 4)
								      .map((item, index) => {
								      	return {id: groupId[index], verb: grado + item.substring(2, 1)}
								      });



			resolve(groups);

		}, function errorCallback(error) {
			reject(JSON.stringify({'error': error}));
		})
	});
}

function getAlumnos () {

	for (let i = 1; i <= 6; i++) {

		getGroups(String(i))
		.then(gruposArr => {
			let alumnos = {};
			
			gruposArr.forEach((item, index) => {
				fs.mkdirSync(`${__dirname}/files/${item.verb}/`, 0744, function (err) {
					console.log(err);
				});
				alumnosAjax(item)
				.then(alumnos => generatePDFS(alumnos, item))
				.catch()
			});
		})
		.catch(error => res.json(error));

	}
	
}

function alumnosAjax(grupo) {
return new Promise (function (resolve, reject) {
		request.get({
		url: `${baseUrl}SIASEBasCE/escuela/cargaAlumnosConsultaReporteEval/?strGrupo=${grupo.id}`,
		contentType : "application/json",
		dataType : "JSON",
		headers: {'cookie': cookies}
	}, function successCallback(data, status, stuff){
		let alumnos = JSON.parse(status.body).alumnos;
		alumnos = alumnos.map(item => ({clave: item.strClave, nombre: `${item.strApellidoPaterno} ${item.strApellidoMaterno} ${item.strNombre}`}));
		resolve(alumnos);
	}, function errorCallback(error) {
		reject(JSON.stringify({'error': error}));
	});
});
}

function generatePDFS (alumnos, grupo) {

	alumnos.forEach((item, index) => {

		request.get({
			url: `${baseUrl}SIASEBasCE/generaReportePDF?reporte.strReporte=REPORTE_EVALUACION&reporte.grupo.strClave=${grupo.id}&reporte.alumno.strClave=${item.clave}`,
			encoding: 'binary',
			headers: {'cookie': cookies}
		}, function successCallback (response, status) {
			if (status && status.statusCode === 200 && grupo.verb && item.nombre) {
				console.log(`Creando: Grupo ${grupo.verb}, Niño ${item.nombre}`);
				fs.writeFileSync(`${__dirname}/files/${grupo.verb}/${item.nombre}.pdf`, status.body, 'binary', function (err) {
					console.log(err);
				});
			} else {
				// console.log(status);
			}
			
		}, function errorCallback (response, status) {
			console.log(response);
		});

	});

}

getAlumnos();

app.listen('3000').setMaxListeners(100);
function consultaGrupos()
{
	if($("#selCiclo").val() != "0" && $("#selPlan").val() != "0" && $("#selGrado").val() != "0")
	{
		datos = {"strCiclo"	:$("#selCiclo").val(),
				 "strPlan"	:$("#selPlan").val(),
				 "strGrado"	:$("#selGrado").val()}
		
		ejecutaAjax($("#hddPath").val() + "/consultaGrupos",datos,"GET","JSON",function(data){
			if(existe(data.session))
			{
				enviaMensajeSession(data.session)
			}
			if(existe(data.excepcion))
			{
				enviaMensajeSession(data.excepcion)
			}
			else
			{
				if(existe(data.grupos))
				{
					cargaSelect("selGrupos",data.grupos,"SELECCIONE GRUPO")
				}
			}
		})	
	}
}

function cargaAlumnos()
{
	datos = "strGrupo=" + $("#selGrupos").val();
	ejecutaAjax($("#hddPath").val() + "/escuela/cargaAlumnosConsultaReporteEval",datos,"GET","JSON",function(data){
		if(existe(data.session))
		{
			enviaMensajeSession(data.session)
		}
		if(existe(data.excepcion))
		{
			enviaMensajeSession(data.excepcion)
		}
		else
		{
			if(existe(data.alumnos) && data.alumnos.length === 0)
			{
				enviaMensaje("Mensaje","No se encontraron alumnos registrados en el grupo seleccionado")			
			}
			else
			{
				muestraAlumnosReporteEval(data)
			}
		}
	})
}

function muestraAlumnosReporteEval(datos)
{
	clase = "class=\"celdaBlanco\"";
	contenido = "<table align=\"center\" border=\"1\" width=\"80%\">"
		+"  <tr>"
		+"		<td colspan=\"6\" class=\"encabezadoTabla\" align=\"center\" >ALUMNOS</td>"
		+"  </tr>"
		+"  <tr>"	
		+"		<td width=\"25%\" class=\"celdaGrisT\" align=\"center\">Clave del Alumno</td>"
		+"		<td width=\"35%\" class=\"celdaGrisT\" align=\"center\">Nombre del Alumno</td>"
		+"		<td width=\"30%\" class=\"celdaGrisT\" align=\"center\">CURP</td>"	
		+"		<td width=\"10%\" class=\"celdaGrisT\" align=\"center\">VER REPORTE</td>"	
		+"  </tr>"
	
	$.each(datos.alumnos, function(index,alumno){
		contenido +=
		 "	</td>"
		+ "	<td align=\"center\" "+ clase +">" + alumno.strClave + "</td>"
		+ "	<td align=\"left\" " + clase +"> " + $.trim(alumno.strApellidoPaterno) + " " + $.trim(alumno.strApellidoMaterno) + " " + $.trim(alumno.strNombre) + "</td>"
		+ "	<td align=\"left\" " + clase +"> " + $.trim(alumno.strCURP) + "</td>"
		+ " <td align=\"center\" " + clase +" style='height:40px'>" 
		+ " <a href=\"#\" onclick=\"muestraReporteEvaluacion('"+ alumno.strClave +"')\" > <img alt=\"\" width='30px' height='25px' src=\"http://siase2.edomex.gob.mx/documents/ESTILOS/images/pdf.png\"></a>"
		+ " </td>"
		+ " </tr>";
		clase = clase=="class=\"celdaGris\""?"class=\"celdaBlanco\"":"class=\"celdaGris\"";
	});
	
	contenido += "</table>";

    $("#divAlumnosReporte").html(contenido)
}

function datoAlumno(cveAlumno)
{
	datos = "strClave=" + cveAlumno;
	ejecutaAjax($("#hddPath").val() + "/escuela/llamaInfoAlumnos",datos,"GET","JSON",function(data){ //petición a un metodo enviando parametros

		enviaMensaje("Mensaje","El parametro que llego es: "+data.cvealum);
		//enviaMensaje("Mensaje","Función");
	})
}

function muestraReporteEvaluacion(cveAlumno)
{
//	alert("El alumno es:" + cveAlumno)
	TINY.box.show({iframe:$("#hddPath").val() + "/generaReportePDF?reporte.strReporte=REPORTE_EVALUACION&reporte.grupo.strClave=" + $("#selGrupos").val() + "&reporte.alumno.strClave=" + cveAlumno ,boxid:'frameless',width:800,height:600,fixed:false,maskid:'bluemask',maskopacity:60})
}
	
$(function(){
// $("#frmRegistroAlumno").submit(function(event) {
// event.preventDefault();
// })
})
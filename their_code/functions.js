
	function curpValida(cadenaCURP)
	{
		var resultado = false;
		var patronCURP = "[a-zA-Z]{4,4}[0-9]{6}[a-zA-Z]{6,6}[0-9a-zA-Z]{2}";
		var expresionRegular = new RegExp(patronCURP);
		if(cadenaCURP.match(expresionRegular))
			{
				resultado = true;
			}
		
		return resultado;
	}
	
	function numeroOrdinalSemestre(strSemestre)
	{
		var strOrdinarioSemestre = "NUMERO_INVALIDO";
		var intSemestre = parseInt(strSemestre);
		switch(intSemestre)
		{
			case 1:
				strOrdinarioSemestre = "PRIMER";
				break;
			case 2:
				strOrdinarioSemestre = "SEGUNDO";
				break;
			case 3:
				strOrdinarioSemestre = "TERCER";
				break;
			case 4:
				strOrdinarioSemestre = "CUARTO";
				break;
			case 5:
				strOrdinarioSemestre = "QUINTO";
				break;
			case 6:
				strOrdinarioSemestre = "SEXTO";
				break;
		}
		return strOrdinarioSemestre;
	}
	
	function validaExpresionRegular(strCampo,strExpresionRegular)
	{
		var resultado = false;
		var expresionRegular = new RegExp(strExpresionRegular);
		if(strCampo.match(expresionRegular))
		{
			resultado = true;
		}
		return resultado;
	}
	
	function cctValida(cadenaCCT)
	{
		var resultado = false;
		var patronCCT = "15[ECT,PCT,EBH,PBH,EBP]+[0-9]{4}[A-Z]{1}";
		var expresionRegular = new RegExp(patronCCT);
		if(cadenaCCT.match(expresionRegular))
		{
			resultado = true;
		}
		return resultado;
	}
	
	//onkeypress='return validaNumero(this,event)'
	function validaNumero(obj, e){
		var retorno = true;
		var tecla = (document.all) ? e.keyCode : e.which;
		if(tecla < 48 || tecla > 57){
			if (tecla != 0 && tecla != 8)
				retorno = false;
		}
		return retorno;
	}
	
	function validaDecimal(element,event ){
		event = event || window.event;
		var charCode = event.which || event.keyCode;
		if (charCode == 8 || charCode == 13 || charCode == 48 || charCode == 46)
			return true;
		else if ((charCode < 48) || (charCode > 57) )
			return false;
	}
	
	$.fn.serializeObject = function()
	{
	   var o = {};
	   var a = this.serializeArray();
	   $.each(a, function() {
	       if (o[this.name]) {
	           if (!o[this.name].push) {
	               o[this.name] = [o[this.name]];
	           }
	           o[this.name].push(this.value || '');
	       } else {
	           o[this.name] = this.value || '';
	       }
	   });
	   return o;
	};	
	
	function enviaMensaje(tituloPopUp, mensaje )
	{
		$("#mensajes").attr("title",tituloPopUp);
		$("#mensajes").html("<div id=\"mensajes\">" + mensaje + "</div>");
		$("#mensajes").dialog({
			width: 500,
			modal: true,
			resizable: true,
			buttons: {"Aceptar":function() {$( this ).dialog( "close" )}},
			position: {
                my: "center top", 
                at: "center top",
                of: window }

		});	
	}
	
	function enviaMensajeSession( mensaje )
	{
		$("#mensajes").attr("title","SESION FINALIZADA");
		$("#mensajes").html("<div id=\"mensajes\">" + mensaje + "</div>");
		$("#mensajes").dialog({
			width: 300,
			modal: true,
			resizable: true,
			close: function(event, ui) { window.location.href = "../finalizaSesion";},
			buttons: {
				"Aceptar":function() {
					$( this ).dialog( "close" )
				} 
			}
		});	
	}

	
	function limpiaSelect(id,textoPrimeraOpcion)
	{
		$("#" + id + " option").remove();
		$("#" + id).append("<option value=''> [ " + textoPrimeraOpcion + " ] </option>");
	}
	
	function cambiaMayusculas(campo) 
	{
        campo.value = campo.value.toUpperCase()
	}
	
	function aMayusculas(campo) {
		if (campo.inchange)
			return;
		campo.inchange = true;
		campo.value = campo.value.toUpperCase();
		campo.inchange = false;
	}
	
	function cargaSelect(id,strValores,strPrimeraOpcion)
	{
		limpiaSelect(id,strPrimeraOpcion);
		$("#" + id).append(strValores,strPrimeraOpcion);
	}
	
	function cargaSelectSimple(id,strValores)
	{
		$("#" + id + " option").remove();
		$("#" + id).append(strValores);
	}
	
	function existe(valor)
	{
		if(valor !== undefined && valor !== null && valor != "")
			return true;
		else
			return false;
	}
	
	function ejecutaAjax(action,datos,tipoEnvio,tipoDatos,handleData)
	{

		$.ajax({
			url : action,
			type : tipoEnvio,
			data : datos,
			contentType : "application/json",
			dataType : tipoDatos
		}).done(function(data, textStatus, jqXHR) {
			try
			{
				if(!existe(data.excepcion))
				{
					 handleData(data); 
				}
				else
				{
					enviaMensaje("MENSAJE",data.excepcion);
				}
			}
			catch(e)
			{
				enviaMensaje("EXCEPCION","EXCEPCION DURANTE LA EJECUCION DEL METODO  <br> (EXC): " + e);
			}
			
		}).fail(function(jqXHR, textStatus, errorThrown) {
			enviaMensaje("ERROR","ERROR DURANTE LA EJECUCION DEL METODO <br> (ERR): " + errorThrown);
		});		
	}

	
	function popUp(pagina,opciones,ancho,largo)
	{
		if(opciones != "")
		{
			opciones =  "?" + opciones; 
		}
		
		TINY.box.show({iframe: pagina + opciones ,boxid:'frameless',width:ancho,height:largo,fixed:false,maskid:'bluemask',maskopacity:60})
	}
	
	function formatoNumero(numero, cuantosDigitos) {
	    var strResultado = "" + numero;
	    while (strResultado.length < cuantosDigitos) {
	    	strResultado = "0" + strResultado;
	    }
	    return strResultado;
	}
	
		
	$(function(){
		$( "<div id='mensajes' style='opacity: 0.6'></div>" ).appendTo( "form" );
		
//		$(document).ajaxStart().ajaxStop($.unblockUI).ajaxComplete($.unblockUI);
		$(document).ajaxStart().ajaxStop($.unblockUI);
		
		$(document).ajaxStart(function(){
			$.blockUI(
					{ message: "<br><br><img src='../recursos/image/imgEspera.gif'/><br><br><h4>Un momento por favor...<h4>",
						css: { 
				            border: 'none', 
				            padding: '0px', 
				            '-webkit-border-radius': '10px', 
				            '-moz-border-radius': '10px', 
				            opacity: .9,
				            color: '#000000' 
				        }
					}
			);
		});
	})

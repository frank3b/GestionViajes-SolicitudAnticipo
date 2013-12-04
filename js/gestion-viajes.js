/**
 * 
 */

function validarUsuario(){  
	
	try {
		$.mobile.loading('show');
	    limpiarMensaje( $('#mensaje') );
	    
	    var usuario = $('#usuario').val();
	    var password = $('#password').val();
	    
	    if(usuario != null && password != null && usuario != '' && password != ''){
	        
	        
	        Kinvey.User.logout({
	            success: function() {
	                    console.log("Desconectando");
	            },
	            error: function(e) {
	                    console.log("Usuario no conectado");
	            }
			});
			
			Kinvey.User.login(usuario, password, {
				
			            success: function() {
			            console.log("Loggeado.");
			            		var user = Kinvey.getActiveUser();
			            
					            var query = new Kinvey.Query();
						        query.equalTo('idUsuario', user._id);
								Kinvey.DataStore.find('UsuarioRol', query, {
						            success: function(response) {
						                
						                if('PETITIONER' == response[0].rol){
						                    $.mobile.changePage("#listaViajesAprobados", {
						                            transition: "pop",
						                            reverse: false,
						                	        changeHash: false
						                	});
						                    
						                    var txtBienv = "Bienvenido: " + user.first_name + " " + user.last_name;
						    				$('#bienvenidaText').text(txtBienv);
						    				$.mobile.loading('hide');
						                } else {
						                	$.mobile.loading('hide');
						                	agregarMensaje($('#mensaje'), 'W', 'No tiene permisos para acceder a legalizar gastos.');
						                }                
						                $.mobile.loading('hide');
						            },
						            error: function(error){
						    			console.log(error);
						    			agregarMensaje($('#mensaje'), 'W', 'No tiene permisos para acceder a legalizar gastos..');
						    	        $.mobile.loading('hide');
									}
						        });
			            
			            },
			            error: function(error){
			            	console.log(error);
			    	        agregarMensaje($('#mensaje'), 'W', 'El nombre de usuario o la contrase\u00F1a introducidos no son correctos.');
			    	        $.mobile.loading('hide');
			            }
			});
	        
	    } else {
	        agregarMensaje($('#mensaje'), 'W', 'Debe ingresar el nombre de usuario y la contrase\u00F1a.');
	        $.mobile.loading('hide');
	    }  
	} catch (e) {
		console.log(error);
		agregarMensaje($('#mensaje'), 'E', 'Error de conexi\u00F3n, verifique por favor.');
		$.mobile.loading('hide');
	}
    
}

function salir(){
	$("#mensaje").hide();
	$("#mensaje").hide();
	
	$('#mensaje').text("");
	$('#mensaje').text("");
	
	$('#usuario').val("");
	$('#password').val("");
	
}

function iniciarCampos(){
	
	$("#mensaje").hide();
	$("#mensaje").hide();
	
}

function abrirAdjunto(url){
	window.open(url, '_system');
}

function limpiarMensaje(objeto){
	objeto.removeClass("error");
	objeto.removeClass("success");
	objeto.removeClass("warning");
	objeto.removeClass("info");
	objeto.text( ' ' );
	objeto.hide();
}

function agregarMensaje(objeto, tipoError, mensaje){
	objeto.removeClass("error");
	objeto.removeClass("success");
	objeto.removeClass("warning");
	objeto.removeClass("info");
	
	if(tipoError == 'W'){
		objeto.addClass('warning');
	} else if(tipoError == 'S'){
		objeto.addClass('success');
	} if(tipoError == 'I'){
		objeto.addClass('info');
	} if(tipoError == 'E'){
		objeto.addClass('error');
	}
	objeto.text( mensaje );
	objeto.show();
	
}

/*
var idImagen = 0;
function tomarFoto(){
	console.log('Por tomar foto...');
	if (!navigator.camera) {
		alert("Camera API not supported", "Error");
		return;
	}
	var options =   {   quality: 50,
						destinationType: Camera.DestinationType.FILE_URI,
						sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
						encodingType: 0     // 0=JPG 1=PNG
					};
	navigator.camera.getPicture(
		function(imageData) {
			idImagen += 1;
			//$('#foto').attr('src', "data:image/jpeg;base64," + imageData);
			
			//alert(JSON.stringify(imageData));
			//alert(imageData);
			var item = "<li><a href=\"#popupFoto\" onclick=\"verFoto('"+ imageData +"');\" data-rel=\"popup\" data-position-to=\"window\"> "+
			"<img id='img' " + idImagen + " src='"+ imageData +"'/> " +
			//"<h3>Nombre Imagen</h3>" +
			//"<p><strong>Cedula:</strong> "+ obj.cliente.cedula +"</p>" +
			//"<p class=\"ui-li-aside\"><strong>"+ obj.cliente.estado +"</strong></p>" +
			"</a></li>";
			//alert(item);
			$('#listaAnexos').append(item).listview('refresh');
			//$('#img' + idImagen).attr('src', "data:image/jpeg;base64," + imageData);
			
		},
		function() {
			alert('Error tomando foto. Intente de nuevo más tarde', "Error");
		},
		options);
	return false;
}

function verFoto(src){
	$('#imagenPopup').attr('src', src);
	//$('#popupFoto').popup( "open" );
}
*/


/*
var listaVinculados = null;
function consultarSolicitudes() {

			$("#listaSolicitudes li").remove();
			
			try{
				$.mobile.loading('show');
				limpiarMensaje($('#mensaje'));	
				
			    var primer_nombre = $('#primerNombre').val();
				var primer_apellido = $('#primerApellido').val();
				
				var queryName = new Kinvey.Query();
				var queryApellido = new Kinvey.Query();
				queryName.matches('primer_nombre', primer_nombre);
				queryApellido.matches('primer_apellido', primer_apellido);
				queryName.and(queryApellido);
				
				//alert(JSON.stringify(queryName));
			    Kinvey.DataStore.find('Solicitudes', queryName, {
			        success: function(response) {
			        	//alert(JSON.stringify(response));
			           if(response.length > 0){
				           $.mobile.loading('hide');
				           
				           listaVinculados = response;
				           
				           $("#listaVinculados").append("<li data-role=\"list-divider\" role=\"heading\">Seleccione un registro</li>").listview('refresh');
				           var isPopupEnabled = false;
				           $.each(response, function(index, obj) {

								var item = "<li><a href=\"#vinculacion\" onclick=\"verVinculado('"+ obj._id +"');\"> "
										+ "<p><strong>Documento:</strong> " + obj.numero_documento + "</p>"
										+ "<p><strong>"
										+ obj.primer_nombre + " " + obj.segundo_nombre
										+ " " + obj.primer_apellido + " "
										+ obj.segundo_apellido + "</strong></p>"
										+ "<p><strong>Estado:</strong> " + obj.estado + "</p>"
										//+ "<p class=\"ui-li-aside\"><strong>" + obj.estado + "</strong></p>" 
										+ "</a></li>";
								
								$("#listaVinculados").append(item).listview('refresh');
								
								if(!isPopupEnabled){
									$( "#listaVinculadosPopup" ).popup( "open" );
									isPopupEnabled = true;
								}
								
							});
				           
			           } else {
			        	 agregarMensaje($('#mensaje'), 'W', 'No se encontr\u00F3 registros ');
			        	 $('#guardar').button('enable');
				          $.mobile.loading('hide');
			           }
			           
			        },
			        error: function(error){
						console.log(error);
						agregarMensaje($('#mensaje'), 'E', 'Error de conexi\u00F3n, verifique por favor.' );
				        $.mobile.loading('hide');
				        $('#guardar').button('enable');
					}
			    });
			} catch (e) {
				$.mobile.loading('hide');
				$('#guardar').button('enable');
				console.log(error);
			}

		}
	}
}
*/	
	
function readDataUrl(file) {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
}

function onFileSystemSuccess(fileSystem) {
    console.log(fileSystem.name);
    console.log(fileSystem.root.name);
}

function fail(evt) {
    console.log(evt.target.error.code);
}

function init() {
	
	var promise = Kinvey.init({
        appKey    : 'kid_PPwwzftRG9',
        appSecret : 'a5f7bc254fea41da8364e4bc7064c096'
    });
    
    $("#ingresar").on("click", function() {
    	validarUsuario();
    });
	
}
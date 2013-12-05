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
	        
	        
	        var promise = Kinvey.User.logout({
	            success: function() {
	                    console.log("Desconectando");
	                    validarRol(usuario, password);
	            },
	            error: function(e) {
	                    console.log("Usuario no conectado");
	                    validarRol(usuario, password);
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

function validarRol(usuario, password){
	Kinvey.User.login(usuario, password, {
		
        success: function() {
        console.log("Loggeado.");
        		var user = Kinvey.getActiveUser();
        
        		 var query = new Kinvey.Query();
                 query.equalTo('IdUsuario', user._id);
                 var query2 = new Kinvey.Query();
                 query2.equalTo('Rol', 'PETITIONER');
                 query.and(query2);
				Kinvey.DataStore.find('UsuarioRol', query, {
		            success: function(response) {
		            	
		            	if(response.length > 0) {
		            		cargarMotivosViaje();
		            		cargarTiposGasto();
		            		
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

var listaSolicitudes = null;
function consultarSolicitudes() {

	$("#lstViajesAprobados li").remove();

	try {
		$.mobile.loading('show');
		limpiarMensaje($('#mensajeViajes'));

		var user = Kinvey.getActiveUser();
		var query = new Kinvey.Query();
		query.equalTo('id_usuario', user.username);
		var query2 = new Kinvey.Query();
		query2.equalTo('Estado', '1');
		query.and(query2);

		Kinvey.DataStore.find('Solicitudes', query,	{
							success : function(response) {
								
								if (response.length > 0) {

									listaSolicitudes = response;

									$("#lstViajesAprobados")
											.append(
													"<li data-role=\"list-divider\" role=\"heading\">Viajes aprobados</li>")
											.listview('refresh');
									$.each(response, function(index, obj) {
										
										$.each(listaMotivos, function(index, objMotivo) {
											if(objMotivo.id_motivo == obj.id_motivo){
												var item = "<li><a href=\"#gastosViaje\" onclick=\"consultarGastos('" + obj.id_solicitud + "');\"> "
													+ "<p><strong>Solicitud #:</strong> " + obj.id_solicitud + "</p>"
													+ "<p><strong>Motivo:</strong> " + objMotivo.motivo +	"</p>"
													+ "<p class=\"ui-li-aside\"><strong>" + obj.fecha_inicio + "</strong></p>"
													+ "</a></li>";	
												$("#lstViajesAprobados").append(item).listview('refresh');
											}
										});

									});
									$.mobile.loading('hide');
								} else {
									agregarMensaje($('#mensajeViajes'), 'W',
											'No se encontr\u00F3 registros ');
									$.mobile.loading('hide');
								}

							},
							error : function(error) {
								console.log(error);
								agregarMensaje($('#mensajeViajes'), 'E',
										'Error de conexi\u00F3n, verifique por favor.');
								$.mobile.loading('hide');
							}
						});
	} catch (e) {
		$.mobile.loading('hide');
		console.log(error);
	}
}

var idViaje = null;
function consultarGastos(id_solicitud) {
	
	$("#lstGastos li").remove();

	try {
		$.mobile.loading('show');
		limpiarMensaje($('#mensajeGastos'));
		
		var user = Kinvey.getActiveUser();
		var query = new Kinvey.Query();
		query.equalTo('id_solicitud', id_solicitud);
		query.ascending('fecha');
		
		Kinvey.DataStore.find('gastos', query, {
			success : function(response) {
				if (response.length > 0) {
					idViaje = id_solicitud;
					$('#txtViaje').text("Viaje Nro: " + id_solicitud);
					
					var fechaAnterior = null;
					$.each(response, function(index, obj) {
						
						if(fechaAnterior == null || fechaAnterior != obj.fecha){
							$("#lstGastos").append("<li data-role=\"list-divider\" role=\"heading\">" +
									"Gastos " + obj.fecha + "</li>").listview('refresh');
							esFechaInicial = false;
							fechaAnterior = obj.fecha;
						} 
						
						var item = "<li><a href=\"#gastosViaje\" onclick=\"consultarGastos('" + obj._id + "');\"> "
							+ "<p><strong>" + obj.descripcion + "</strong></p>"
							+ "<p><strong>$ " + obj.monto + " " + obj.tipo_moneda + "</strong></p>"
							+ "</a></li>";
						$("#lstGastos").append(item).listview('refresh');

					});
					$.mobile.loading('hide');
				} else {
					agregarMensaje($('#mensajeGastos'), 'W',
							'No se encontr\u00F3 gastos para la solicitud: ' + id_solicitud);
					$.mobile.loading('hide');
				}
			},
			error : function(error) {
				console.log(error);
				agregarMensaje($('#mensajeGastos'), 'E',
						'Error de conexi\u00F3n, verifique por favor.');
				$.mobile.loading('hide');
			}
		});
	} catch (e) {
		$.mobile.loading('hide');
		console.log(error);
	}
}

function nuevoGasto(){
	//FIXME - Implementar
}
	
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

var listaMotivos = null;
function init() {
	
	var promise = Kinvey.init({
        appKey    : 'kid_PPwwzftRG9',
        appSecret : 'a5f7bc254fea41da8364e4bc7064c096'
    });
    
    $("#ingresar").on("click", function() {
    	validarUsuario();
    });
    
    $(document).on("pageshow", "#listaViajesAprobados", function () {
    	consultarSolicitudes();
    });
	
    
}

var listaTiposGastos = null;
function cargarTiposGasto()
{
	Kinvey.DataStore.find('tiposgasto', null, {
		success : function(response) {
			listaTiposGastos = null;
			listaTiposGastos = response;
		},
		error : function(error) {
			console.log(error);
		}
	});
}

function cargarMotivosViaje()
{
	Kinvey.DataStore.find('motivos', null, {
		success : function(response) {
			listaMotivos = null;
			listaMotivos = response;
		},
		error : function(error) {
			console.log(error);
		}
	});
}

function consultarNombreMotivo(idMotivo){
	
	//alert(idMotivo + '-->'+ JSON.stringify(listaMotivos));
	$.each(listaMotivos, function(index, obj) {
		if(obj.id_motivo == idMotivo){
			console.log(obj.motivo);
			return obj.motivo;
		}
	});
	
}
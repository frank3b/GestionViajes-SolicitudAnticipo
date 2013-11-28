/**
 * 
 */

var vinculado = null;

function validarUsuario(){	
	$.mobile.loading('show');
	limpiarMensaje($('#mensaje'));
	
	var usuario = $('#usuario').val();
    var password = $('#password').val();
    
    if(usuario != null && password != null && usuario != '' && password != ''){
        
        var query = new Kinvey.Query();
        query.equalTo('usuario', usuario);
        Kinvey.DataStore.find('usuarios', query, {
            success: function(response) {
               
                if(password == response[0].contrasena){
                    $.mobile.changePage("#solicitud", {
                            transition: "pop",
                            reverse: false,
                	        changeHash: false
                	});
                    
                    var txtBienv = "Bienvenido: " + response[0].nombre_usuario;
    				$('#bienvenidaText').text(txtBienv);
    				
    				$( "#resetButton" ).click();
                } else {
                    $('#mensaje').show();
                    $('#mensaje').addClass('warning');
                    $('#mensaje').text( 'El nombre de usuario o la contrase\u00F1a introducidos no son correctos.' );
                }                
                $.mobile.loading('hide');
            },
            error: function(error){
    			console.log(error);
				$('#mensaje').show();
				$('#mensaje').addClass('warning');
    	        $('#mensaje').text( 'El nombre de usuario o la contrase\u00F1a introducidos no son correctos.' );
    	        $.mobile.loading('hide');
			}
        });
       
        
	} else {
		$('#mensaje').show();
		$('#mensaje').addClass('warning');
		$('#mensaje').text( 'Debe ingresar el nombre de usuario y la contrase\u00F1a.' );
		$.mobile.loading('hide');
	}  
	
}

/**
 * 
 */

var vinculado = null;
var idUsuario = null;
var nombreUsuario = null;

function validarIngreso(){  
    $.mobile.loading('show');
    limpiarMensaje($('#mensaje'));
    
    var usuario = $('#usuario').val();
    var password = $('#password').val();
    
    if(usuario != null && password != null && usuario != '' && password != ''){
        
        var query = new Kinvey.Query();
        query.equalTo('login', usuario);
        Kinvey.DataStore.find('USUARIOS', query, {
            success: function(response) {
                
                if(password == response[0].contrasena){
                    $.mobile.changePage("#vinculacion", {
                            transition: "pop",
                            reverse: false,
                            changeHash: false
                    });
                    idUsuario = response[0].id_usuario;
                    nombreUsuario = response[0].nombre_usuario;
                   
                    $( "#resetButton" ).click();
                } else {
                    $('#mensaje').show();
                    $('#mensaje').addClass('warning');
                    $('#mensaje').text( 'El nombre de usuario o la contrase\u00F1a introducidos no son correctos.' );
                }                
                $.mobile.loading('hide');
            },
            error: function(error){
                console.log(error);
                $('#mensaje').show();
                $('#mensaje').addClass('warning');
                $('#mensaje').text( 'El nombre de usuario o la contrase\u00F1a introducidos no son correctos.' );
                $.mobile.loading('hide');
            }
        });
       
        
    } else {
        $('#mensaje').show();
        $('#mensaje').addClass('warning');
        $('#mensaje').text( 'Debe ingresar el nombre de usuario y la contrase\u00F1a.' );
        $.mobile.loading('hide');
    }  
    
}


function salir(){
    $("#mensaje").hide();
    $("#mensajeVinculacion").hide();
    
    $('#mensaje').text("");
    $('#mensajeVinculacion').text("");
    
    $('#usuario').val("");
    $('#password').val("");
    
}

function iniciarCampos(){
    
    $("#mensaje").hide();
    $("#mensajeVinculacion").hide();
    
    $("#segmento").attr('readonly', true);
    $("#subsegmento").attr('readonly', true);
    $("#tamanoComercial").attr('readonly', true);
    $("#llaveCRM").attr('readonly', true);
    $("#calificacionInterna").attr('readonly', true);
    $("#estado").attr('readonly', true);
}

function consultarSolicitud(){
    
    var query = new Kinvey.Query();
    query.equalTo('EstadoRequerimiento', idUsuario);
    
    var promiseSolicitudes = Kinvey.DataStore.find('Solicitudes', query, {
           success: function(solicitud) {
              console.log("Consulta satisfactoria de Solicitudes");
              for (var i = 0; i < solicitud.length; i++){
                  $('#ListaSolicitudess').append('<li data-role="list-divider" role="heading">Seleccione Para Desistir</li>');
                  $.each(items, function(index, item) {
                     console.log(item.CodigoSIC);
                     $('#ListaSolicitudes').append('<li data-theme="c"><a href="" data-transition="slide" data-id="' +solicitud[i].id_solicitud
                     + '"><b class="highlight">IDSol:</b>  ' + solicitud[i].id_solicitud + '<br/><b class="highlight">Fecha:</b>  ' + solicitud[i].fecha_inicio+ '<br/><b class="highlight">Estado:</b>  '  + solicitud[i].Estado
                     +'</a></li>');
                  });
                  $('#ListaSolicitudes').listview('refresh');
                  $.mobile.loading('hide');
              }
           },
           error: function(e) {
               console.log("No ");
               $.mobile.loading('hide');
           }
        });
    $.mobile.loading('show');
   
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
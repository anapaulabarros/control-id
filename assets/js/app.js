jQuery(function($){
    
    var SISTEMA = window.LOAD || {};
    var session = '';
 
    SISTEMA.validate = function(){

        jQuery.validator.addMethod("alphanumeric", function(value, element) {
            return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
        }, 'Só são permitidos letras ou números');

        $('.form-submit').each(function(){
            $(this).validate();
        });

    }

    SISTEMA.login = function() {

         $('.btn-login').on('click', function(e){

            e.preventDefault();

            var login = $('#login').val();
            var password = $('#password').val();

            if(login != '' && password != ''){
                
                var urlLogin = "http://177.189.250.178:55555/login.fcgi";

                $.ajax({
                  url: urlLogin,
                  type: 'POST',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    login: login,
                    password: password
                  }),
                  error: function(data) {
                        $('.notification-text-login').show();
                        setTimeout(function (){
                            $('.notification-text-login').hide();
                        }, 3000);
                   }, success(data) {
                        session = data.session;
                        window.location.href = base_url+'/dashboard.html'; //mudar url
                   }
                 
                });

                return false;
            } else {

                $('.notification-text').show();
                setTimeout(function (){
                    $('.notification-text').hide();
                }, 3000);
            }   

        });
    }


    SISTEMA.cadastro_usuarios = function(){

        $('body').on('click', '.btn-save-user', function(e){

            e.preventDefault();

            var sessionToken = '';

            let nome = $('#nome').val();
            let senha = $('#senha').val();
            let matricula = $('#matricula').val();


            if(nome != '' && senha != '') {

               var settingsLogin = {
                  "url": "http://177.189.250.178:55555/login.fcgi",
                  "method": "POST",
                  "timeout": 0,
                  "headers": {
                    "Content-Type": "application/json"
                  },
                  "data": JSON.stringify({"login":"admin","password":"admin"}),
                };

                $.ajax(settingsLogin).done(function (response) {
                  sessionToken = response.session;
                });

                //RegisteUser
                setTimeout(function (){
                    var settings = {
                      "url": "http://177.189.250.178:55555/create_objects.fcgi?session="+sessionToken,
                      "method": "POST",
                      "timeout": 0,
                      "headers": {
                        "Content-Type": "application/json"
                    },
                      "data": JSON.stringify({"object":"users","values":[{"name": nome,"registration":matricula,"password":senha,"salt":""}]}),
                    };

                    $.ajax(settings).done(function (response) {
                      if(response.ids.length > 0) {
                        clearInputs();
                        $('.notification-text-sucess').show();
                        setTimeout(function (){
                            $('.notification-text-sucess').hide();
                        }, 3000);
                      }
                    });
                }, 400);
 
            } else {

                $('.notification-text').show();
                setTimeout(function (){
                    $('.notification-text').hide();
                }, 3000);
            }

            
            return false;

        });

    }
		

    /* ==================================================
    Init
    ================================================== */

    $(document).ready(function(){

        $('div[onload]').trigger('onload');

        SISTEMA.login();
        SISTEMA.cadastro_usuarios();
        loadUsers();
    });    
});


//utils
function clearInputs() {

    $('#nome').val('');
    $('#senha').val('');
    $('#matricula').val('');
}

function loadUsers() {

    var sessionToken = '';

    var settingsLogin = {
      "url": "http://177.189.250.178:55555/login.fcgi",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({"login":"admin","password":"admin"}),
    };

    $.ajax(settingsLogin).done(function (response) {
      sessionToken = response.session;
    });

    //loadUsers
    setTimeout(function (){
        var settings = {
          "url": "http://177.189.250.178:55555/load_objects.fcgi?session="+sessionToken,
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({"object":"users"}),
        };

        $.ajax(settings).done(function (response) {
            $.each(response.users, function(index, elem){
                $('#list-users').append("<tr><td>"+index+"</td><td>"+elem.name+"</td><td>"+elem.registration+"</td></tr>");
            });
        });
    }, 400);

}

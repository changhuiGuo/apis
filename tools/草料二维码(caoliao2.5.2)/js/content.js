$(function() {
    $('body').append('<div id="cli_dialog_div"></div>');
});
chrome.extension.onRequest.addListener(function(message, sender, sendResponse) {
    var version="2.5.2";
    var type = message['type'];
    var url = message['url'];
    if (type == 'getimage') {
        var api='https://cli.im/api/browser/deqr';
        $.post(api, {data: url,version:version}, function(response) {
            if (response.status != 1) {
                $('#cli_dialog_div').html('<p>二维码获取失败，请稍候再试！</p>');
            } else {
                var RawData = response['data']['RawData'];
                var regex = "http://(([a-zA-z0-9]|-){1,}\\.){1,}[a-zA-z0-9]{1,}-*";
                if(RawData.match(regex)){
                    $('#cli_dialog_div').html('<p class="result"><h2>该二维码扫码内容</h2></p><div class="rdata"><a href="'+RawData+'">'+RawData+'</a></div>');
                }else {
                    $('#cli_dialog_div').html('<p class="result"><h2>该二维码扫码内容</h2></p><div class="rdata">'+RawData+'</div>');
                }  
            }
            if(response['data']['new_version']){
                $("#cli_dialog_div").prepend('<div id="header"><p>'+response['data']['new_descr']+'</p></div>');
            }
        }, 'json');
    } else {       
        var api = 'https://cli.im/api/browser/generate';
        var regex = "http://(([a-zA-z0-9]|-){1,}\\.){1,}[a-zA-z0-9]{1,}-*";
        $.post(api, {data:url,version:version}, function(response) {
            if (response.status != 1) {
                $('#cli_dialog_div').html('<p>二维码获取失败，请稍候再试！</p>');
                if(response['data']['new_version']){
                    $("#cli_dialog_div").prepend('<div id="header"><p>'+response['data']['new_descr']+'</p></div>');
                }
            }else {
                 var zm,dwz;
                 var urls = response['data']['qr_data'];
                 var src = response['data']['qr_filepath'];
                 if(url.match(regex)&&type!='image'){//网址
                    var tpls = '<div id="header"></div><br/><img src="' + src + '" id="img"/><div class="check" id="check">';
                     tpls+= '<input type="checkbox" class="regular-checkbox" retd="bdzm" id="bdzm" /><label for="bdzm" id="bdzmtwo"></label>优化阅读　　';
                     tpls+= '<input type="checkbox" class="regular-checkbox" retd="dwz" id="dwz"/><label for="dwz" id="dwztwo"></label>短网址';
                     tpls+= '</div><div class="footer-menu"><a href="https://cli.im/deqr/camdecord" target="_blank"><span class="sm">扫码</span></a>';
                     tpls+= '<a href="https://cli.im/mh?text='+urls+'" target="_blank" id="mhx"><span class="mh">美 化</span></a>';
                     tpls+= '<a href="'+src+'" target="_blank"><span class="xz"> 下 载</span></a><a href="https://cli.im" target="_blank"><span class="cli">草料网</span></a></div>';
                 }else{//图片、文字
                    var tpls = '<div id="header"></div><br/><img src="' + src + '" id="img"/>';  
                     tpls+= '<div class="footer-menu"><a href="https://cli.im/deqr/camdecord" target="_blank"><span class="sm">扫码</span></a>';
                     tpls+= '<a href="https://cli.im/mh?text='+urls+'" target="_blank" id="mhx"><span class="mh">美 化</span></a>';
                     tpls+= '<a href="'+src+'" target="_blank"><span class="xz"> 下 载</span></a><a href="https://cli.im" target="_blank"><span class="cli">草料网</span></a></div>';
                 }
				     var tpl = $(tpls).find(".regular-checkbox").click(function(){
					 if($(this).attr("retd")=='bdzm'){ //优化阅读
                        if($(this).is(":checked")){
                            $('#dwz').attr('disabled','disabled');
                            zm=1;
                            dwz=1;
                        }else{
                            $('#dwz').removeAttr('disabled','');
                            zm=0;
                            dwz=0;
                        }
                        $.post(api,{data:urls,zm:zm,dwz:dwz},function(response){
                        if(response.status != 1){
                            $('#header').html('<p>二维码获取失败，请稍候再试！</p>');
                        }else{
                            var urls2=response['data']['qr_data'];
                            var src=response['data']['qr_filepath'];
                            $("#img").attr('src',src);
                            $("#mhx").attr('href',"https://cli.im/mh?text="+urls2);
                        }
                        },'json');
					}else{ //短网址
                        var check=document.getElementById('dwz');
                        if(check.checked){
                            dwz=1;
                        }else dwz=0;
						$.post(api,{data:urls,zm:0,dwz:dwz},function(response){
                        if(response.status != 1){                            
                              $('#header').html('<p>该地址无法生成短网址！</p>');
                        }else{
                            var urls2=response['data']['qr_data'];
                            var src=response['data']['qr_filepath'];
                            $("#img").attr('src',src);
                            $("#mhx").attr('href',"https://cli.im/mh?text="+urls2);
                            $('#header').html('');
                        }
                    },'json');    
					}
				}).end();
                $('#cli_dialog_div').html(tpl);
                if(response['data']['new_version']){
                    $("#header").html('<p>'+response['data']['new_descr']+'</p>');
                }
                $('.ui-dialog').css({'position':'fixed','top':"50%",'left':'50%','margin-left':'-!important','margin-top':'-229px!important'});
            }
        }, 'json');
    }
    $('#cli_dialog_div').dialog({
        'title': '草料二维码'
    });
    
});



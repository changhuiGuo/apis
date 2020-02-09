chrome.tabs.getSelected(function(tab){
    var version="2.5.2";
    var url=encodeURI(tab.url);
    var api='https://cli.im/api/browser/generate';
    $.post(api,{data:url,version:version},function(response){
        if(response.status != 1){
            $('#image').html('<p>二维码获取失败，请稍候再试！</p>');
            if(response['data']['new_version']){
                $("#header").prepend('<p>'+response['data']['new_descr']+'</p>');
            }
        }else{
            if(response['data']['new_version']){
                $("#header").html('<p>'+response['data']['new_descr']+'</p>');
            }
            var data=response['data']['qr_data'];
            var src=response['data']['qr_filepath'];
            $('#image').html('<img src="'+src+'"/>');
            $('#download').attr('href',src);
            $('#mh').attr('href',"https://cli.im/mh?text="+data);
        }
    },'json');
    /*
    **@authur thirdlife
    **add baidu gate :zm
    **add baidu dwz  :dwz
    */

    $('#bdzm').click(function(){
        var zm,dwz;
       if($(this).is(":checked")){ 
            $('#dwz').attr('disabled','disabled');
            zm = 1;
            dwz = 1;
       }else {
            $('#dwz').removeAttr('disabled','');
            zm = 0;
            dwz = 0;
       }
        $.post(api,{data:url,zm:zm,dwz:dwz,version:version},function(response){
                if(response.status != 1){
                    $('#image').html('<p>二维码获取失败，请稍候再试！</p>');
                    if(response['data']['new_version']){
                        $("#header").prepend('<p>'+response['data']['new_descr']+'</p>');
                    }
                }else{
                    if(response['data']['new_version']){
                        $("#header").html('<p>'+response['data']['new_descr']+'</p>');
                    }
                    var data=response['data']['qr_data'];
                    var src=response['data']['qr_filepath'];
                    $('#image').html('<img src="'+src+'"/>');
                    $('#download').attr('href',src);
                    $('#mh').attr('href',"https://cli.im/mh?text="+data);
                }
            },'json');
    });
    $('#dwz').click(function(){
        var dwz;
        if($(this).is(":checked")){
            dwz=1;
        }else dwz=0;
        $.post(api,{data:url,zm:0,dwz:dwz,version:version},function(response){
            if(response.status != 1){
                $('#header').html('<p>该地址无法生成短网址</p>');
                if(response['data']['new_version']){
                    $("#header").prepend('<p>'+response['data']['new_descr']+'</p>');
                }
            }else{
                if(response['data']['new_version']){
                    $("#header").html('<p>'+response['data']['new_descr']+'</p>');
                }
                var data=response['data']['qr_data'];
                var src=response['data']['qr_filepath'];
                $('#image').html('<img src="'+src+'"/>');
                $('#download').attr('href',src);
                $('#mh').attr('href',"https://cli.im/mh?text="+data);
                $('#header').html('');
            }
        },'json');    
    });
})



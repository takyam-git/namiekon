$(function(){
    $('#stop').on('click',function(){
        console.log('aaa');
        window.location.href = '../';
    });
});

function find(){
    var ref = window.confirm('相手が見つかりました．\nこの人とビデオチャットを開始しますか？');
    if(ref){
        alert('キャンセルしました．\n引き続きビデオチャットの相手を探します．');
        
    }else {
//        window.location.href = '/chat';
    }
}

$(function(){
    $('.male').on('click',function(){
        $(this).addClass('selected');
        $('.female').removeClass('selected');
    });
    $('.female').on('click',function(){
        $(this).addClass('selected');        
        $('.male').removeClass('selected');
    });
});
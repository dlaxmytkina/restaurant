$(function(){



        
        $('a').click (function(e) {
            
          e.preventDefault();
          var id  = $(this).attr('href'),
              top = $(id).offset().top;
          $('html, body').animate({scrollTop: top}, 1500);
         
         });

         function pos (elem){
             var elem_top = $(elem).offset().top,
              elem_bottom = elem_top + $(elem).outerHeight();
             return{
                 top: elem_top,
                 bottom: elem_bottom
             }
         }
         
         $(window).scroll(function(e){

            let scrollBottom = $(window).scrollTop()+$(window).height()-1;
            let scrollTop = $(window).scrollTop();

            if(pos(".block_aboutUs").top < scrollBottom && pos($(".block_aboutUs")).bottom >scrollTop) {
  
                $('.block_aboutUs .flex_block').css('animation','slideUp 1.5s');
             
               } 
                if(pos(".block_team .flex_block").top < scrollBottom && pos(".block_team .flex_block").bottom >scrollTop) {
                
                   $('.block_team .flex_block').css('animation','slideUp 1.5s');
                
                  } 

                  if(pos(".booking .flex_block").top < scrollBottom && pos(".booking .flex_block").bottom >scrollTop) {
                
                   $('.booking_form_block').css('animation','scale 1.5s');
                
                  }  
               
                  if(pos(".block_specialties .flex_block").top < scrollBottom && pos(".block_specialties .flex_block").bottom >scrollTop) {
                
                   $('.block_specialties .flex_block').css('animation','slideUp 1.5s');
                
                  }   
                  if(pos(".block_menu .menu").top < scrollBottom && pos(".block_menu .menu").bottom >scrollTop) {
                
                   $('.block_menu .menu').css('animation','slideUp 1.5s');
                
                  } 
                  if(pos(".block_privateEvents .flex_block").top < scrollBottom && pos(".block_privateEvents .flex_block").bottom >scrollTop) {
                
                   $('.block_privateEvents .flex_block').css('animation','slideUp 1.5s');
                
                  } 
                  else if (($(window).height() )> scrollBottom){
                   $('.block_aboutUs .flex_block, .block_privateEvents .flex_block, .block_menu .menu, .block_specialties .flex_block, .booking_form_block, .block_team .flex_block ').css('animation','none');
                  
               }
         }) 


    var booking_input = $('input');
    var menu_position= `<div class="position">
                        <div>
                            <h4>PIZZA QUATRO STAGIONI . . .  &nbsp</h4>
                            <p>Integer ullamcorper neque eu purus euismod</p>
                        </div>
                        <h4>55,68 USD</h4>
                    </div>`;

(function () {
    for(i=0;i<21;i++){
        $('.menu_positions').append(menu_position);
        $('.menu_positions').append('');
        console.log(i)
    }
 }());
 let today = new Date();
    hour = today.getHours(),
    min = today.getMinutes(),
    day = today.getDate(),
    month = today.getMonth()+1;
    year = today.getFullYear()
    console.log(year);
 
    if(today.getDate()<10){
         day = `0${day}`;
    } 
    if(month<10){
month = `0${month}`;
    }

    booking_input.each(function(){
        if ($(this).attr('placeholder')==='Date (mm/dd)'){
             console.log('ggg');
            $(this).attr( 'min',`${year}-${month}-${day}`);
            if((today.getMonth()+3)<10){
                month = `0${today.getMonth()+3}`;
                    } else month = today.getMonth()+3;
               $(this).attr('max',`${year}-${ month}-${day}`)
            }})

      

    booking_input.focus(function() {
    booking_input.each(function(){
        if($(this).attr('placeholder')==='Phone'){
            $(this).mask("+375(99) 999-99-99");
        }
    })
}
    )

})
$(function () {
    if (document.location.hash === "#booking") {
        let top = $('.booking').offset().top;
        $('html, body').animate({ scrollTop: top }, 1500);
    }

    let responseData = '';
    $.get("./menuItem.json").then(function (data) {
        responseData = data;
        console.log(Object.keys(responseData.DESSERT).length)
        pasteMenuItem($(".changePosition").eq(0));

    }
    );

    let scrollTop = $(window).scrollTop();
    let scrollBottom = $(window).scrollTop() + $(window).height() - 1;

    scrollAnimate(scrollBottom, scrollTop);

    $('.menu .section').click(function () {
        $('.menu .section span').removeClass('activMenuSection');
        $(this).children().addClass('activMenuSection');
        loadMenuItem()
    })

    $('a').click(function (e) {
        e.preventDefault();
        var id = $(this).attr('href'),
            top = $(id).offset().top;
        $('html, body').animate({ scrollTop: top }, top / 2);

    });

    function pos(elem) {
        var elem_top = $(elem).offset().top,
            elem_bottom = elem_top + $(elem).outerHeight();
        return {
            top: elem_top,
            bottom: elem_bottom
        }
    }

    $(window).scroll(function (e) {
        scrollTop = $(window).scrollTop();
        scrollBottom = $(window).scrollTop() + $(window).height() - 1;
        scrollAnimate();
    })

    function showAnimate() {
        return {
            'animation': 'slideUp 1.5s',
            'opacity': '1'
        }
    }
    function checkAnimateBlock(blockName, childName) {
        if (pos(blockName).top < scrollBottom && pos(blockName).bottom > scrollTop) {
            childName === undefined ?
                $(`${blockName} .flex_block`).css(showAnimate()) :
                $(`${blockName} ${childName}`).css(showAnimate())
        }
    }
    function scrollAnimate() {
        let blockArr = [".block_aboutUs", , ".block_team", , ".block_specialties ", , ".block_privateEvents ", , ".booking", ".booking_form_block"];
        for (i = 0; i < blockArr.length / 2; i++) {
            checkAnimateBlock(blockArr[i * 2], blockArr[i * 2 + 1]);
        }
    }

    var booking_input = $('input');

    let animationMove = $(".menu_positions").offset().left + $(".menu_positions").width();

    function loadMenuItem() {

        $({ translate: 0 }).animate({
            translate: -animationMove
        }, {
            duration: 1500,
            step: function (now, fx) {
                $(".changePosition").eq(0).css('transform', 'translateX(' + now + 'px)')
            },
            complete: function () {
                $(".changePosition").eq(0).remove();
                $('.dopWhiteBlock').hide();
            }
        });
        menuItem();
    };


    function menuItem() {
        let changePosition = $(".changePosition").eq(1);
        pasteMenuItem(changePosition);
        let dopHeight = changePosition.height() - $(".changePosition").eq(0).height();

        $('.dopWhiteBlock').css("height", dopHeight);
        $('.dopWhiteBlock').slideDown(1500);
        $({ translate: animationMove }).animate({
            translate: 0
        }, {
            duration: 1500,
            step: function (now, fx) {
                changePosition.css('transform', 'translateX(' + now + 'px)')
            }
        });


    }


    function pasteMenuItem(changePosition) {

        let activeSection = $('.menu .activMenuSection').text();
        let menuData = responseData[activeSection];
        console.log(changePosition)
        $(".menu_positions").append("<div class='changePosition'></div>");
        for (var key in menuData) {
            let menu_position = `
                    <div class="position">
                        <div>
                            <h4>${key}</h4>
                            <p>${menuData[key]['caption']}</p>
                        </div>
                        <h4>${menuData[key]['price']} USD</h4>
                    </div>
                `;
            changePosition.append(menu_position);
        }
        $('.changePosition .position').click(positionClick)

    }

    function positionClick() {
        let hash = $(this).find("h4").eq(0).text();

        //  document.location.href = 
        window.open(`./menuItem.html#${hash}`);
    }


    booking_input.each(function () {
        if ($(this).attr('placeholder') === 'Phone') {
            $(this).mask("+375(99) 999-99-99");
        }
    })

    $("#datepicker").datepicker({
        dateFormat: "dd-mm",
        maxDate: "14",
        minDate: '0',
    });
    $("#timepicker").timepicker({
        timeFormat: 'hh:mm p',
        interval: 60,
        minTime: '08:00 AM',
        maxTime: '11:00 PM',
        startTime: '08:00 AM',
        // dynamic: false,
        // dropdown: true,
        // scrollbar: true
    }
    );

    $("form").submit(function (e) {
        alert("success");
        e.preventDefault();
        document.forms[0].reset();

        document.forms[1].reset();
    });



})
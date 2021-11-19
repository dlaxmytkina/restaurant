

$(document).ready(function () {


    let hash = getHash(),
        menuSection_positions = [],
        positionsData = '',
        json = '',
        checkedPosition_data = {}

    $.get("./menuItem.json").then(function (data) {
        json = data;
        generateMenuGroup()
        $(`.header .header_ul li:contains("${checkGroup()}")`).addClass('active')
    });

    function getHash() {
        return decodeURIComponent(document.location.hash.substring(1))
    }

    function updateDom() {
        $(".menuItem_img_block, .itemInfo").html('');
        $(".menuItem_img_block").html(html_menuItem_img_block);
        $(".itemInfo").html(html_itemInfo)
    }

    let pasteNextPosition = pasteItem(`menuItem_img_block_next`, `itemInfo_next`),
        pastePrevPosition = pasteItem(`menuItem_img_block_prev`, `itemInfo_prev`),
        pasteActivePosition = pasteItem('menuItem_img_block', 'itemInfo')

    let checkHeightForNextRec = checkHeightForRecPromise(`itemInfo`, `itemInfo_next`),
        checkHeightForPrevRec = checkHeightForRecPromise('itemInfo', 'itemInfo_prev'),
        checkHeightForActiveRec = checkHeightForRecPromise('menuItem_img_block', 'itemInfo')

    function generateMenuGroup() {
        updateDom();
        let menuSection = checkGroup();
        positionsData = json[menuSection];
        menuSection_positions = Object.keys(positionsData)
        checkedPosition_data = positionsData[hash];
        checkDizabledSvg();
        pasteActivePosition(checkedPosition_data)
        checkHeightForActiveRec()
        $('img').on('load', function () {
            $('.menuItem').removeAttr('style').css('animation', ` .5s showNewGroup linear forwards `)
        })
    }


    function checkHeightForRecPromise(div, divSecond) {

        return function () {
            return new Promise((resolve, reject) => {
                let interval = setInterval(function () {
                    if ($(`.menuItem .${divSecond} .recommendation img`).height() > 50) {
                        clearInterval(interval);
                        checkForRec.call($(`.${divSecond}`), div)
                        resolve()
                    }
                }, 50);
            })
        }
    }

    function checkForRec(div) {
        this.css("height", "fit-content");
        if (this.height() > $(`.${div}`).height()) {
            this.find(`.recommendation`).hide();
        }
        this.removeAttr("style");
    }

    function checkGroup() {
        for (var key in json) {
            for (var newkey in json[key]) {
                if (newkey === hash) {
                    return key;
                }
            }
        }
    }

    function pasteItem(div, divSecond) {
        return function (checkedPosition_data) {
            let infoblock = $(`.menuItem .${divSecond}`);
            $(`.menuItem .${div} .menuItem_img`).attr("src", checkedPosition_data.img);
            infoblock.find(`h2`).html(hash)
            infoblock.find(`.info`).html(checkedPosition_data.caption)
            infoblock.find(`.price`).html(checkedPosition_data.price + " USD");

            if (checkedPosition_data.select !== undefined) {
                infoblock.find(`.price`).before(html_select)
                infoblock.find(` .selectItem .selected p`).html(Object.keys(checkedPosition_data.select)[0])
                for (var key in checkedPosition_data.select) {
                    infoblock.find(`.selectItem .list`).append(`<div>${key}</div>`)
                }
            }

            let recommendation = generateRecommendation();
            for (i = 0; i < 3; i++) {
                infoblock.find(`.recommendation_item img`).eq(i).attr("src", positionsData[recommendation[i]].img);
                infoblock.find(`.recommendation_item .text`).eq(i).html(recommendation[i])
            }
        }
    }

    function getLocalStorage() {
        return JSON.parse(localStorage.getItem('shoppingBag'))
    }
    function setLocalStorage(data) {
        localStorage.setItem('shoppingBag', JSON.stringify(data));
    }

    $('.menuItem').on('click', '.recommendation_item', loadnextRecommendation)
    $('.menuItem').on('click', '.selectItem .selected', hideSelectList)
    $(".menuItem").on('click', '.selectItem .list div', changeSelected)
    $(".menuItem").on('click', '.shopping_bag_button', addToBag)
    $(".blur").click(function () {
        $('.shoppingBag, .blur').hide(300, function(){
            $('.selectItemInfo').remove()
        });


    })

    function addToBag() {
        let selectDish = $(`.menuItem .itemInfo h2`).text()
        if ($(`.menuItem .itemInfo`).find('.selectItem').length > 0) {
            selectDish += ` (${$('.selectItem .selected p').text()})`
        }
        let allDishes = {}
        if (getLocalStorage() !== null) {
            allDishes = getLocalStorage();
        }
        allDishes[selectDish] = [1, $(`.menuItem .itemInfo .price`).text().match(/\d{1,2},\d{1,2}/)[0]];
        setLocalStorage(allDishes);
        $(this).html("&#10003").css('font-size', "2rem")
    }

    function changeSelected() {
        hideSelectList()
        let infoBlock = $(`.menuItem .itemInfo `)
        infoBlock.find(`.selectItem .selected p`).html($(this).text())
        console.log(checkedPosition_data)
        infoBlock.find(` .price`).html(checkedPosition_data.select[$(this).text()] + ' USD')
        $('.shopping_bag_button').html("ADD TO BAG").removeAttr('style')
    }

    function loadnextRecommendation() {
        document.location.hash = $(this).find('.text').text()
        dizableSvg();
        newItem('next', 0)
            .then(pageFlipAnimation('next'));
    }

    function hideSelectList() {
        let block = $('.itemInfo .selectItem')
        let deg = 0
        block.find('.list').is(':visible') ?
            deg = 90 :
            deg = -90
        block.find(' .selected svg').css('transform', `rotate(${deg}deg)`)
        block.find(" .list").slideToggle(150);
    }

    function generateRecommendation() {
        let recommendationArr = [];
        let posLength = menuSection_positions.length
        for (i = 0; i < 3; i++) {
            let random = Math.floor(Math.random() * posLength)
            recommendationArr.includes(menuSection_positions[random]) || menuSection_positions[random] === hash ? i-- : recommendationArr.push(menuSection_positions[random]);
        }
        return recommendationArr;
    }

    function dizableSvg(index) {
        let block = '';
        index === undefined ? block = $('.menuItem_block .prev_next') : block = $('.menuItem_block .prev_next').eq(index)
        block.css({
            'pointer-events': 'none',
            'fill': '#c9c9c9'
        })
    }

    $('.menuItem_block .prev_next').click(function () {
        let item = ''
        $('.menuItem_block .prev_next').index(this) === 0 ?
            item = 'prev' : item = 'next'
        dizableSvg();
        newItem(item)
            .then(pageFlipAnimation(item));

    })

    function pageFlipAnimation(item) {

        // $({ rotateY: 0 }).animate({
        //     rotateY: item === "next" ? -90 : 90
        // }, {
        //     duration: 500,
        //     easing: "linear",
        //     step: function (now, fx) {
        //         $(`.menuItem_block ${item === "next" ? '.itemInfo' : '.menuItem_img_block'}`).css('transform', 'perspective(2000px) rotateY(' + now + 'deg)')
        //     },
        //     complete: function () {
        //         $({ rotateY: item === "next" ? 90 : -90 }).animate({
        //             rotateY: 0
        //         }, {
        //             duration: 500,
        //             easing: "linear",
        //             step: function (now, fx) {
        //                 $(`${item === "next" ? '.menuItem_img_block_next' : '.itemInfo_prev'}`).css('transform', 'perspective(2000px) rotateY(' + now + 'deg)')
        //             },
        //             complete: function () {
        //                 $(".menuItem_img_block, .itemInfo").remove()
        //                 $(`.menuItem_img_block_${item}`).removeClass(`menuItem_img_block_${item}`).addClass('menuItem_img_block');
        //                 $(`.itemInfo_${item}`).removeClass(`itemInfo_${item}`).addClass('itemInfo');
        //                 $(".itemInfo, .menuItem_img_block").removeAttr("style")
        //                 $('.menuItem_block .prev_next').removeAttr('style')
        //                 checkDizabledSvg();
        //                 let checkedPosition_data = positionsData[hash];
        //             }
        //         });
        //     }
        // });
        $(`.menuItem_block ${item === "next" ? '.itemInfo' : '.menuItem_img_block'}`).css(
            'animation', ` .5s pageFlip_${item}Start linear forwards `
        )
        let nextAnimate = new Promise(resolve => setTimeout(resolve, 500));
        nextAnimate.then(
            function () {
                $(`${item === "next" ? '.menuItem_img_block_next' : '.itemInfo_prev'}`).css(
                    'animation', ` .5s pageFlip_${item}End linear forwards `
                )
                setTimeout(function () {
                    removeLastPage(item);
                    checkDizabledSvg();
                }, 500)
            }
        )
    }

    function removeLastPage(item) {
        $(".menuItem_img_block, .itemInfo").remove()
        $(`.menuItem_img_block_${item}`).removeClass().addClass('menuItem_img_block');
        $(`.itemInfo_${item}`).removeClass().addClass('itemInfo');
        $(".itemInfo, .menuItem_img_block, .menuItem_block .prev_next").removeAttr("style")
    }

    function checkDizabledSvg() {
        let index = menuSection_positions.indexOf(hash);
        if (menuSection_positions[index + 1] === undefined) {
            dizableSvg(1)
        } else if (menuSection_positions[index - 1] === undefined) {
            dizableSvg(0)
        }
    }


    function newItem(item, condition) {
        if (condition !== 0) {
            let index = menuSection_positions.indexOf(hash);
            window.location.hash = menuSection_positions[item === "next" ? index + 1 : index - 1];
        }
        hash = getHash()
        checkedPosition_data = positionsData[hash];
        $(".menuItem").append(`<div class="menuItem_img_block_${item}">${html_menuItem_img_block}</div> 
        <div class="itemInfo_${item}">${html_itemInfo}</div>`)
        if (item === 'next') {
            pasteNextPosition(checkedPosition_data)
            return checkHeightForNextRec()
        } else {
            pastePrevPosition(checkedPosition_data)
            return checkHeightForPrevRec()
        }
    }

    function shoppingBag_visibility() {
        if ($('.shoppingBag').is(':hidden')) {
            let dishes = JSON.parse(localStorage.getItem('shoppingBag'));
            for (let dish in dishes) {
                amount = dishes[dish][0],
                    bagItemHtml = generate_shoppingBag_item(dish, amount);
                calculate_shoppingBag_price.call(bagItemHtml, dish, dishes, amount)
                $('.shoppingBag').prepend(bagItemHtml)
            }
            calculate_total_sum()
            $('.shoppingBag, .blur').show(300);
        } else {
            $('.shoppingBag, .blur').hide(300, function () {
                $('.selectItemInfo').remove()
            });
        }
    }

    $('.header .header_ul li').click(function (e) {
        if ($(this).find('svg').length > 0) {
            shoppingBag_visibility()
        } else {
            $('.header .header_ul li').removeClass()
            $(this).addClass('active')
            newMenuGroup.call($(this))
        }
    })

    function newMenuGroup() {
        let newGroup = this.text()
        console.log(Object.keys(json[newGroup])[0])
        document.location.hash = Object.keys(json[newGroup])[0]
        hash = getHash();
        $('.menuItem').css('animation', ` .5s hideLastGroup linear forwards `)
        setTimeout(generateMenuGroup, 500)
    }

    function calculate_total_sum() {
        let totalSum = 0
        let prices = $('.shoppingBag .selectItemInfo .price').text().match(/\d{1,2},\d{1,2}/g)
       if (prices !== null){
            for (let price of prices) {
                totalSum += Number(price.replace(/,/, '.'))
            }
            totalSum = totalSum.toFixed(2).replace(/\./, ',')   
        } 
        $('.shoppingBag .totalSum span').html(totalSum + ' USD')

    }

    $('.shoppingBag').on('click', 'svg', function () {
        let key = $(this).siblings().eq(0).text();
        let storage = JSON.parse(localStorage.getItem('shoppingBag'))
        delete storage[key];
        localStorage.setItem('shoppingBag', JSON.stringify(storage));
        $(this).parent().slideUp(250, function () {
            $(this).remove();
            calculate_total_sum()
        })
    })

    $('.shoppingBag').on('click', 'span', function () {
        let div = $(this).parent().find('div');
        let amount = div.html();
        let storage = JSON.parse(localStorage.getItem('shoppingBag'));
        let keyName = $(this).parents().eq(2).find('p').text();
        if ($(this).text() === '+' && amount !== '9') {
            div.html(++amount)
        } else if ($(this).text() === '-' && amount !== '1') {
            div.html(--amount)
        }
        let context = $(this).parents().eq(1);
        calculate_shoppingBag_price.call(context, keyName, storage, amount)
        calculate_total_sum()
        storage[keyName][0] = amount;
        localStorage.setItem('shoppingBag', JSON.stringify(storage));
    })

    function calculate_shoppingBag_price(keyName, storage, amount) {
        let price = Number(storage[keyName][1].match(/\d{1,2},\d{1,2}/)[0].replace(/,/, '.'));
        let calculatedPrice = price * amount
        this.find('.price').html(calculatedPrice.toFixed(2).replace(/\./, ',') + " USD")
    }

    $(".shoppingBag .booking").click(function () {
        document.location.href = './index.html#booking'
    })
})
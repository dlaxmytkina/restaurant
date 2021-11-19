let html_menuItem_img_block = `<img class="menuItem_img" src="">`,
    html_itemInfo = `
    <div class="info_block">
        <h2></h2>
        <div class="color-line"></div>
        <div class="info"></div>
        <div class="select_price">
            <div class="price"></div>
        </div>
        
        <div class="shopping_bag_button">ADD TO BAG</div>
    </div>

    <div class="recommendation">
        <p>You can also like</p>
        <div class="recommendation_blocks">
            <div class="recommendation_item">
                <img src="" alt="">
                <div class="text"></div>
            </div>
            <div class="recommendation_item">
                <img src="" alt="">
                <div class="text"></div>
            </div>
            <div class="recommendation_item">
                <img src="" alt="">
                <div class="text"></div>
            </div>
        </div>
    </div> `,
    html_select = `
    <div class="selectItem">
        <div class="selected">
        <p></p>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
        viewBox="0 0 477.175 477.175" xml:space="preserve">
        <path
            d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5   c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z   " />
    </svg>
    </div>
        <div class="list"></div>
    </div>`;

    function generate_shoppingBag_item (dish, amount){
        return $(`<div class="selectItemInfo">
        <p>${dish}</p>
        <div class="calculatedPrice">
            <div class="amount"><span>-</span>
                <div>${amount}</div> <span>+</span>
            </div>
            <div class="price"></div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <g ><line class="cls-1" x1="7" x2="25" y1="7" y2="25"/>
                <line class="cls-1" x1="7" x2="25" y1="25" y2="7"/>
            </g>
        </svg>
    </div>`)
    }
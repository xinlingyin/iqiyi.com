import './library/jquery.js';
import './library/swiper-3.4.2.min.js';

$.ajax({
    type: "get",
    url: "../../interface/getData.php",
    dataType: "json",
    success: function(res) {
        let temp = '';
        res.forEach((elm, i) => {
            let picture = JSON.parse(elm.picture);

            temp += `<li>
            <div class="product_info">
                <a class="product_info_Pic" href="./product.html?id=${elm.id}" target="_blank">
                    <img alt="" src="../${picture[0].src}">
                </a>
                <div class="product_info_Info">
                    <p class="productTitle"><a href="">${elm.title}</a></p>
                    <p class="productSubTitle"><span class="productStatus"><em>${elm.info_1}</em></span>${elm.info_2}</p>
                    <p class="productDesc">
                        <span class="productPrice">¥ ${elm.price}</span>
                        <span class="productSales">已售 ${elm.sales}</span>
                    </p>
                </div>
            </div>
        </li>`;
        });

        $('.product_item').append(temp);
    }
});

$(function() {
    var mySwiper = new Swiper('.swiper-container', {
        autoplay: 3000, //可选选项，自动滑动
        loop: true, // 循环模式选项

        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
        },

        // 如果需要前进后退按钮
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            hideOnClick: true,
        }

    });


});
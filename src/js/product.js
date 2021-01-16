import './library/jquery.js';
import { cookie } from './library/cookie.js';


let id = location.search.split('=')[1];

$.ajax({
    type: "get",
    url: "../../interface/getItem.php",
    data: {
        id: id
    },
    dataType: "json",
    success: function(res) {
        let picture = JSON.parse(res.picture);

        let temp = `
        <div class="main">
            <div class="mod_pd_crumbs">
                <a href="//mall.iqiyi.com/">首页</a>
                <i>&gt;</i>
                <span class="mod_pd_crumbs_el">${res.title}</span>
            </div>
            <div class="mb35 clear">
                <div class="mod-preview">
                    <div class="preview-pic">
                        <div class="image-zoom-wrap small">
                            <img src="../${picture[0].src}" alt="" class="pic">
                            <span class="image-zoom movebox" style="display: none; top: 0px; left: 0px;"></span>
                        </div>
                        <div class="image-retina big" style="display: none;">
                            <img class="biging" width="800" height="800" style="position: absolute; left: -326.263px; top: 0px;" src="" alt="">
                        </div>
                    </div>
                    <div class="preview-thumbnail clear">
                        <div class="thumbnail-items">
                            <ul class="thumbnail-list clear" style="width: 800px;">
                                <li>
                                    <img alt="" src="../${picture[0].src}">
                                </li>
                                <li>
                                    <img alt="" src="../${picture[1].src}">
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="mt20">
                        <div class="share-btn">
                            <i class="icon-share-goods"></i>
                            <em class="btn-info">分享</em>
                        </div>
                        <div class="share-btn">
                            <i class="icon-collection-goods"></i>
                            <em class="btn-info">收藏</em>
                        </div>
                    </div>
                </div>

                <div class="mod-goods-detail">
                    <div class="detail-title-total">
                        <h3 class="detail-title">${res.title}</h3>
                    </div>
                    <strong class="detail-subtitle">${res.info_2}</strong>

                    <div class="detail-price">
                        <span>价&nbsp;&nbsp;&nbsp;格：</span>

                        <span class="price">￥ ${res.price}</span>
                    </div>

                    <div class="detail-count">
                        <span class="b-r">销量:&nbsp;&nbsp;<em class="count">${res.sales}</em></span>

                        <span>评价:&nbsp;&nbsp;<em>28</em></span>
                    </div>

                    <div class="detail_inner">
                        <div class="detail-text">
                            <div class="info-item">
                                <span>运费:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                <span>广东惠州市 至 杭州市</span>
                                <span>快递: 0</span>
                            </div>
                            <div class="info-item">
                                <span>颜色分类:&nbsp;&nbsp;</span>
                                <input type="text" placeholder="黑色" class="text-1">
                            </div>
                            <div class="info-item">
                                <span>数量:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                <span>
                                    <input type="number" value="1" class="text-2" min="1" max="${res.num}" id="num">
                                </span>
                                <span class="kuncun">库存${res.num}件</span>
                            </div>
                        </div>

                        <div class="detail-btns">
                            <a class="detail-btn detail-btn-buy" href="#">立即购买</a>
                            <a class="detail-btn detail-btn-cart" href="./shop.html" target="_blank" id="addItem">
                                <i class="icon-shopping-cart"></i>加入购物车
                            </a>
                        </div>

                        <div class=" detail_ser pr">
                            <ul class="detail_promiseUl">
                                <li class="cn_label">服务承诺：</li>
                                <li>
                                    <i class="cn_icon"></i>
                                    <span class="cn_info">爱奇艺电商</span>
                                </li>
                                <li>
                                    <i class="cn_icon"></i>
                                    <span class="cn_info">正品保证</span>
                                </li>
                                <li>
                                    <i class="cn_icon"></i>
                                    <span class="cn_info">极速发货</span>
                                </li>
                                <li>
                                    <i class="cn_icon"></i>
                                    <span class="cn_info">运费说明</span>
                                </li>
                                <li>
                                    <i class="cn_icon"></i>
                                    <span class="cn_info">7天无理由</span>
                                </li>
                            </ul>

                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="main_pic">
            <img src="../${picture[0].src}" alt="">
            <img src="../${picture[1].src}" alt="">
        </div>
        `;

        $('#detail').append(temp).find('#addItem').on('click', function() {
            addItem(res.id, res.price, $('#num').val());
        });
    }
});





function addItem(id, price, num) {
    let shop = cookie.get('shop'); // 获得cookie数据
    let product = {
        id,
        price,
        num
    };

    if (shop) { // 判断购物车是否有添加过数据
        shop = JSON.parse(shop); //将JSON字符串转回数组

        // 判断购物车中是否存在该商品
        if (shop.some(elm => elm.id == id)) {
            // 修改数量
            shop.forEach(el => {
                el.id == id ? el.num = num : null;
            });
        } else {
            shop.push(product);
        }

    } else {
        shop = []; // 初始没有数据 初始化一个空数组
        shop.push(product); // 将第一个商品添加进数组
    }


    cookie.set('shop', JSON.stringify(shop), 1);

}
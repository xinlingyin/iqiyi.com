import './library/jquery.js';
import { cookie } from './library/cookie.js';

let shop = cookie.get('shop');
if (shop) {
    shop = JSON.parse(shop); // 有cookie数据才需要转换

    let idList = shop.map(elm => elm.id).join(); // 获得所有id

    $.ajax({
        type: "get",
        url: "../../interface/getItems.php",
        data: {
            idList
        },
        dataType: "json",
        success: function(res) {
            let temp = '';
            res.forEach((elm, i) => {
                let picture = JSON.parse(elm.picture);

                // 让ajax获得的数据结果id与cookie中的id  一一对应
                // 索引不同

                // 从购物车的cookie数据中去选择当前遍历的数据
                let arr = shop.filter(val => val.id == elm.id);

                temp += `<table class="myCar_tableBd" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr class="myCar_bdTr">
                    <td class="select_td">
                        <div class="select-all">
                            <div class="checkBox-order checkBox-order-selected">
                                <input class="checkBox" type="checkbox" name="" value="false">
                            </div>
                        </div>
                    </td>
                    <td class="baobei">
                        <a href="" class="activity_pic">
                            <img width="80" height="80" src="../${picture[0].src}" alt="">
                        </a>
                        <div class="orderItems_content">
                            <div class="orderItems_link">
                                <a target="_blank" href="">${elm.title}</a>
                            </div>

                            <div class="orderItems_about">
                                <p class="info_section">
                                    <span class="tx-inline">${elm.info_2}</span>
                                </p>
                            </div>
                        </div>
                    </td>
                    <td class="price">
                        <div class="price_inner">
                            <em class="price-now">${parseFloat(elm.price).toFixed(2)}</em>
                        </div>
                    </td>

                    <td class="nub">
                        <div class="nub_inner">
                            <div class="nub_innItem">
                                <span class="mod-amount">
                                    <input type="text" class="amount-input" value="${arr[0].num}" max="${elm.num}" min="1">
                                    <span class="amount-btn">
                                        <span class="amount-increase" ></span>
                                        <span class="amount-decrease"></span>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </td>
                    <td class="disbursements">
                        <div class="disbursements_inner">
                            <em class="sumItems_price">${(elm.price*arr[0].num).toFixed(2)}</em>
                        </div>
                    </td>
                    <td class="trade_operate">
                        <div class="trade_operateInner">
                            <div class="operateItems">
                                <a href="" class="toFav">移入收藏夹</a>
                            </div>
                            <div class="operateItems">
                                <a href="" class="del" data-id="${elm.id}">删除</a>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>`;
            });
            $('.myCar_page').append(temp).find('.del').on('click', function() {
                let shop2 = shop.filter(el => el.id != $(this).attr('data-id')); // 获得id不匹配的元素
                cookie.set('shop', JSON.stringify(shop2), 1); // 将不匹配的元素从新写进cookie
                location.reload();
            });
        }
    });

}
$(function() {



    //商品数量的改变
    //++
    $('.myCar_page').find('.amount-increase').on('click', function() {
        let num = $(this).parent().siblings('input').val();
        num++;
        $(this).parent().siblings('input').val(num);

        let Tr = $(this).parentsUntil('.myCar_tableBd');
        let price = parseFloat(Tr.find('.price-now').html()).toFixed(2);

        let sub = parseFloat(num * price).toFixed(2);
        Tr.find('.sumItems_price').html(sub);

        let id = Tr.find('.del').attr('data-id');

        upCookie(id, num);

    });


    //--
    $('.myCar_page').find('.amount-decrease').on('click', function() {
        let num = $(this).parent().siblings('input').val();
        num--;
        if (num < 1) {
            num = 1;
        }
        $(this).parent().siblings('input').val(num);

        let Tr = $(this).parentsUntil('.myCar_tableBd');
        let price = parseFloat(Tr.find('.price-now').html()).toFixed(2);

        let sub = parseFloat(num * price).toFixed(2);
        Tr.find('.sumItems_price').html(sub);

        let id = Tr.find('.del').attr('data-id');

        upCookie(id, num);
    });

    //直接输入
    $('.myCar_page').find('.amount-input').on('input', function() {
        let inputvlaue = $(this).val();

        if (inputvlaue < 1) {
            $(this).val(1)
        } else {
            $(this).val($(this).val())
        }

        let Tr = $(this).parentsUntil('.myCar_tableBd');
        let price = parseFloat(Tr.find('.price-now').html()).toFixed(2);
        let num = parseFloat(Tr.find('.amount-input').html());
        let sub = parseFloat(num * price).toFixed(2);
        Tr.find('.sumItems_price').html(sub);

        let id = Tr.find('.del').attr('data-id');

        upCookie(id, num);
    });



    //合计
    $('.myCar_page').find('input:checkBox').on('click', function() {
        let sum = parseFloat($('#J_total-price').html());
        let sub = parseFloat($(this).parentsUntil('.myCar_bdTr').siblings('.disbursements').find('.sumItems_price').html());

        let count = Number($(this).parentsUntil('.myCar_bdTr').siblings('.nub').find('.amount-input').val());
        let counts = Number($('.num').html());

        if ($(this).prop('checked')) {

            sum += sub;
            sum = parseFloat(sum).toFixed(2);
            counts += count;

            $('#J_total-price').html(sum);
            $('.num').html(counts);
            $('.btn-submit').addClass('active');

        } else {

            sum -= sub;
            sum = parseFloat(sum).toFixed(2);
            counts -= count;

            $('#J_total-price').html(sum);
            $('.num').html(counts);

            $('.checkAll').prop('checked', $(this).prop('checked'));


        }

        if (parseFloat($('.num').html()) === 0) {
            $('.btn-submit').removeClass('active');
        }

    });

    //全选
    $('.myCar').find('.checkAll').on('click', function() {

        $('.myCar').find('input:checkBox').prop('checked', $('.checkAll').prop('checked'));
        let arr = all();
        let amount = arr[0];
        let total = parseFloat(arr[1]).toFixed(2);
        if ($(this).prop('checked')) {

            $('#J_total-price').html(total);
            $('.num').html(amount);
            $('.btn-submit').addClass('active');

        } else {

            $('.num').html('0');
            $('#J_total-price').html('0');
            $('.btn-submit').removeClass('active');

        }
    });




});

function upCookie(id, num) {
    let shop = cookie.get('shop'); // 获得cookie数据


    //修改cookie
    if (shop) {
        shop = JSON.parse(shop); //将JSON字符串转回数组

        if (shop.some(elm => elm.id == id)) {
            // 修改数量
            shop.forEach(el => {
                el.id == id ? el.num = num : null;
            });
        }
    }
    cookie.set('shop', JSON.stringify(shop), 1);

}


//获得总数量及总金额
function all() {
    let shop = cookie.get('shop'); // 获得cookie数据
    shop = JSON.parse(shop); //将JSON字符串转回数组

    let allnum = 0;
    let alltotal = 0;
    let total = 0;
    shop.forEach(el => {
        total = Number(el.price) * Number(el.num);

        allnum += parseFloat(el.num);

        alltotal += total;
    });
    return [allnum, alltotal];

}
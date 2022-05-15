// if (localStorage.getItem('token') === null) {
//     location.href = '/login.html';
        // 用户可以自定义token
// }
$(function() {
    getUserInfo();

    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出登陆?', {icon: 3, title:'提示'}, function(index){
            // 1. 清空token
            localStorage.removeItem('token');
            // 2. 重新跳转到登陆页面
            location.href = '/login.html';
            layer.close(index);
        });
    })
})

// console.log(localStorage.getItem('token'));

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {Authorization:localStorage.getItem('token') || ''},
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            renderAvatar(res.data)
        },
        // 不管是成功还是失败，都会调用complete 回调函数
        // complete: function(res) {
        //     // 可以使用 res.responseJSON 拿回服务器响应的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1. 强制清空 token ，不然可以按返回键之后就有token了
        //         localStorage.removeItem('token');
        //         // $('body').html('');
        //         // 还是会跳转出来影响体验
        //         // 2. 跳转回页面
        //         location.href = '/login.html';
        //     }
        // }
    })
}

function renderAvatar(user) {
    // 渲染用户名
    let name = user.nickname || user.username;
    
    if ($('#welcome').css('width') <=150+'px') {
        $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`);
    } else {
        name = name.substring(0,4);
        $('#welcome').html(`欢迎&nbsp;&nbsp;${name}...`);
    }
    // 渲染头像
    if (user.user_pic !== null) {
        $('.text-avatar').hide();
        $('.layui-nav-img')
            .attr('src', user.user_pic)
            .show().removeClass('hid');

    } else {
        // 字符串可以像数组一样直接取字符
        $('.layui-nav-img').hide();
        const first = name[0].toUpperCase();
        $('.text-avatar').html(first).show().removeClass('hid');
    }
}
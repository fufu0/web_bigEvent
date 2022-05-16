const form = layui.form;
const layer = layui.layer;
$(function() {
    form.verify({
        nickname: [
            /^[\u4e00-\u9fa50-9a-zA-Z_]{1,8}$/,'用户昵称必须是1-8位，且只能是汉字，数字，字母和下划线'
        ]
    })
    initUserInfo()

    $('#btnReset').on('click', function() {
        initUserInfo();
    })

    $('#form_UserInfo').on('submit', function(e) {
        e.preventDefault();
        changeUserInfo();
    })

})

// 初始化用户的基本信息
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            console.log(res);
            form.val('formUserInfo', res.data);
        }
    })
}

function changeUserInfo() {
    $.ajax({
        method: 'POST',
        url: '/my/userinfo',
        data: $('#form_UserInfo').serialize(),
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            console.log(res);
            // parent.location.reload();
            window.parent.getUserInfo();
        }
    })
}
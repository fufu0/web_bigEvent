$(function() {
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.login-reg').show();
        $('.loginAndRegBox').removeClass('heg');
        $('.title-box h2').html('注册');
    })

    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.login-reg').hide();
        $('.loginAndRegBox').addClass('heg');
        $('.title-box h2').html('登录');
    })

    const form = layui.form;
    const layer = layui.layer;
    form.verify({
        usernamer: [
            /^[\u4e00-\u9fa50-9a-zA-Z_]{3,9}$/,'用户名必须是3-9位，且只能是汉字，数字，字母和下划线'
        ],
        pass: [
            /^[\S]{6,12}$/,'密码必须是6到12为，且不能包含空格'
        ],
        repass: function(value) {
            const pass = $('.login-reg [name=password]').val();
            if (value !== pass) {
                return '两次输入的密码不一致';
            }
        } 
    })

    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var fd = $(this).serialize();
        
        $.post('/api/reguser', fd, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg(res.message);
            $('#form_reg')[0].reset();
            $('#link_login').click();
        })
    })

    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 将登录得到的token字符串，存入本地储存
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
                // $('#form_login')[0].reset();
            }
        })
    })
})
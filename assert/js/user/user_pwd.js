$(function() {
    const form = layui.form;
    const layer = layui.layer;

    form.verify({
        password: [
            /^[\S]{6,12}$/,'密码必须是6到12为，且不能包含空格'
        ],
        newpass: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新密码不能与原密码一致'
            }
        },
        repass: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次输入的密码不一致';
            }
        } 
    })

    $('#form_psw').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(), 
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                $('#form_psw')[0].reset();
            }
        })
    })
})
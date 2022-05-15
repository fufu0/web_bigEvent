// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = `http://www.liulongbin.top:3007${options.url}`;

    // 统一为有权限的接口，设置 header 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }

        options.complete = function(res) {
            // 可以使用 res.responseJSON 拿回服务器响应的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 1. 强制清空 token ，不然可以按返回键之后就有token了
                localStorage.removeItem('token');
                // $('body').html('');
                // 还是会跳转出来影响体验
                // 2. 跳转回页面
                location.href = '/login.html';
            }
        }
    }
})
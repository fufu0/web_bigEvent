// initEditor();

$(function() {
    const layer = layui.layer;
    const form = layui.form;

    // var id = getUrlParam('id')
    // console.log(id);
    // function getUrlParam(name) {
    //     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    //     var r = window.location.search.substring(1).match(reg); //匹配目标参数
    //     if (r != null) return decodeURI(r[2]);
    //     return null; //返回参数值 
    // }
    const id = location.search.substring(10);
    $.ajax({
        method: 'GET',
        url: '/my/article/' + id,
        success: function(res) {
            console.log(res);
            // 初始化文本编辑器,这个必须要放ajax这里，不然就不能获得到数据可能变大？？？
            tinymce.init({
                selector: 'textarea',
                language:'zh_CN', //调用放在langs文件夹内的语言包
                resize: false,
                setup: function(editor){ 
                    editor.on('change',function(){ editor.save();});
                },
            });
            form.val('articleInfo', res.data);
            // $('#tinymce').html(res.data.content); 
            $image
               .cropper('destroy')
               // 这里请求的根路径是api接口
               .attr('src', 'http://www.liulongbin.top:3007' + res.data.cover_img)
               .cropper(options);

        }
    })


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)

    getClassList();

    // tinymce.addI18n();
    

    let state = '已发布';
    $('#draftSave').on('click', function() {
        state = '草稿';
    })

    $('#submitArticle').on('submit', function(e) {
        e.preventDefault();
        if($('textarea').val().trim() === '') {
            return layer.msg('请填写内容');
        }
        let fd = new FormData($(this)[0]);
        fd.append('state' ,state);
        fd.append('Id', id);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {     // 将 Canvas 画布上的内容，转化为文件对象
                // 将文件对象存储到fd之中
                // blob二进制
                fd.append('cover_img', blob);
                // 这是函数，写外面受得到个批
                submitArticles(fd);
                // fd.forEach(function(v,k) {
                //     console.log(k,v);
                // })
            })

    })

    $('#chooseCover').on('click', function() {
        $('#chooseFile').click();
    })

    $('#chooseFile').on('change', function(e) {
        const files = e.target.files;
        if (files.length <= 0) {
            return layer.msg('请选择文件！')
        }
        var newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })


    function submitArticles (fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            // 不修改 Content-Type 属性，使用 FormData 默认的 Content-Type 值
            contentType: false,
            // 不对 ForData 中的数据进行 url 编码，而是将 FormData 数据原样地发到服务器
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                location.href = '/article/article_list.html';
            }
        }) 
    }

    function getClassList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                const htmlstr = template('tpl-classList', res);
                // console.log(htmlstr);
                $('[name=cate_id]').html(htmlstr);
                // 由于layui自身渲染问题，所以要调用这个方法
                form.render();
            }
        })
    }
})
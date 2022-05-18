const layer = layui.layer;
const form = layui.form;
const laypage = layui.laypage;

const p = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的Id
    state: '' // 文章的发布状态
}
$(function() {

    function addZero(n) {
        return n < 10 ? '0' + n : n
      }
    
      template.defaults.imports.dateFormat = function (regTime) {
        var rgt = new Date(regTime);
        var y = rgt.getFullYear();
        var m = addZero(rgt.getMonth() + 1);
        var d = addZero(rgt.getDate());
    
        var hh = addZero(rgt.getHours());
        var mm = addZero(rgt.getMinutes());
        var ss = addZero(rgt.getSeconds());
    
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器

    initTable();
    getClassList();

    $('#selectTable').on('submit', function(e) {
        e.preventDefault();
        const id = $('[name=cate_id]').val();
        const states = $('[name=state]').val();
        p.cate_id = id;
        p.state = states;
        initTable();
    })

    $('tbody').on('click','#btn-delete',function() {
        //用id选择器标识按钮的，会产生id唯一性错误，id是唯一的
        const len = $('.btnDelete').length;
        console.log(len);
        const id = $(this).attr('data-id');
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            deleteList(id, index,len);
        });
    })

    function deleteList(id,index,len) {
        $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // console.log(res);
                layer.msg(res.message);
                layer.close(index);
                // 当页面数据删完以后，需要判断当前一页中，是否还有剩余的数据
                // 如果没有剩余的数据了，则让页面减再调用initTable();方法
                if (len <= 1 && p.pagenum >= 1) {
                    p.pagenum = p.pagenum - 1;
                }
                initTable();
            }
        })
    }


    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: p,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                var htmlstr = template('tpl-table', res);
                $('tbody').html(htmlstr);
                // 调用渲染分页的方法
                renderPage(res.total)
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

    function renderPage(total) {
         //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: p.pagesize, //每页显示的条数
            curr: p.pagenum, // 默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2,3,5,10],
            jump: function(obj, first) {
                // 触发jump回调的方式有两种：
                // 1. 点击页面的时候，会触发 jump 回调
                // 2. 只要调用了 laypage.render()方法，就会触发 jump 回调
                // 可以通过 first 的值，来判断是通过那种方式触发jump回调的
                // 如果 first 的值为 true，证明是方式2触发的，否则就是方式1触发的
                p.pagenum = obj.curr;
                p.pagesize = obj.limit;
                // 直接写initTable会触发死循环
                // $.ajax({
                //     method: 'GET',
                //     url: '/my/article/list',
                //     data: p,
                //     success: function(res) {
                //         if (res.status !== 0) {
                //             return layer.msg(res.message);
                //         }
                //         var htmlstr = template('tpl-table', res);
                //         $('tbody').html(htmlstr);
                //         // 调用渲染分页的方法
                //     }
                // })
                if (!first) {
                    initTable();
                }
            }
        });
    }

})


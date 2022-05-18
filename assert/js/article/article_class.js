const layer = layui.layer;
const form = layui.form;
let indexAdd= null;
let indexEdit= null; 
$(function() {
    initArticleList();

    $('#addClass').on('click', function() {
       indexAdd = layer.open({
            type: 1,
            title: '添加文章列表',
            content: $('#dialog-add').html(),
            area: ['500px', '250px']
        });    
    })

    // 动态生成 事件委托
    $('body').on('submit','#form_add', function(e) {
        e.preventDefault();
        addList();
    })

    $('tbody').on('click','#btn_edit',function() {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章列表',
            content: $('#dialog-edit').html(),
            area: ['500px', '250px']
        }); 
        const id = $(this).attr('data-id');
        getList(id);
    })

    $('body').on('submit','#form_edit', function(e) {
        e.preventDefault();
        editList();
    })

    $('tbody').on('click','#btn-delete',function() {
        const id = $(this).siblings('#btn_edit').attr('data-id');
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            deleteList(id, index);
            // layer.close(index);
        });
    })
})

function deleteList(id,index) {
    $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            // console.log(res);
            layer.msg(res.message);
            layer.close(index);
            initArticleList();
        }
    })
}

function editList() {
    $.ajax({
        method: 'POST',
        url: '/my/article/updatecate',
        data: $('#form_edit').serialize(),
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg(res.message);
            initArticleList();
            layer.close(indexEdit);
        }
    })
}

function getList(id) {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates/' + id,
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            form.val('formInfo', res.data);
            // console.log(res);
        }
    })
}

function addList() {
    $.ajax({
        method: 'POST',
        url: '/my/article/addcates',
        data: $('#form_add').serialize(), 
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg(res.message);
            initArticleList();
            layer.close(indexAdd);
        }
    })
}

function initArticleList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {
            // console.log(res);
            if(res.status !== 0) {
                return layer.msg(res.message);
            }
            const htmlstr = template('tpi_table', res);
            $('#table_list').html(htmlstr);
        }
    })
}

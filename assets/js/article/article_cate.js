$(function() {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()

    // 初始化文章分类列表
    function initArtCateList() {
        $.ajax ({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if(res.status !==0 ) {
                    return layer.msg('获取文章类别失败')
                }
                console.log(res);
                // layer.msg('获取文章类别成功')
                var htmlStr = template("tpl-table", res.data)
                $('tbody').html(htmlStr)
            }
        })
    }

    var indexAdd = null
    // 为添加分类按钮注册事件
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类'
            ,content: $('#addCate').html()
        }); 
    })

    // 通过代理为表单绑定事件
    $('body').on('submit', "#form-add", function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('添加文章分类失败')
                }
                layer.msg('添加文章分类成功')
                initArtCateList()
                // 关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    var indexEdit = null
    // 为编辑按钮注册事件
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类'
            ,content: $('#editCate').html()
        }); 

        var id = $(this).attr('data-id')
        console.log(id);
        $.ajax ({
            method: 'GET',
            url: '/my/article/cates/'+id,
            success: function(res) {
                console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    $('body').on('submit','#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('更新分类失败')
                }
                layer.msg('更新分类成功')
                initArtCateList()
                layer.close(indexEdit)
            }
        })
    })

    // 为删除分类按钮注册事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        console.log(id);
        layer.confirm('确定刪除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    initArtCateList()
                }
            })
            layer.close(index);
          });
    })
})
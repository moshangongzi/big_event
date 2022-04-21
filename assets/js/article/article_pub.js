$(function () {
    var layer = layui.layer
    var form = layui.form

    // 初始化类别选择下拉框
    initCate()

    // 初始化富文本编辑器 
    initEditor()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器 
    var $image = $('#image')
    // 2. 裁剪选项 
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域 
    $image.cropper(options)

    // 选择封面
    $('#btnChooseImage').on('click', function (e) {
        $('#coverFile').click()
    })

    $('#coverFile').on('change', function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0]
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        // 先 销毁 旧的裁剪区域，再 重新设置图片路径 ，之后再 创建新的裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域 
            .attr('src', newImgURL) // 重新设置图片路径 
            .cropper(options) // 重新初始化裁剪区域 123
    })


    var state = '已发布'

    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    // 为发布按钮绑定点击事件
    $('#form-pub').on('submit', function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
        var fd = new FormData($(this)[0])
        fd.append("state", state)


        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布 
            width: 400,
            height: 280
        }).toBlob(function (blob) {
            // 这个回调函数是异步的

            // 将 Canvas 画布上的内容，转化为文件对象 
            // 得到文件对象后，进行后续的操作 
            fd.append("cover_img", blob)
            // fd.forEach(function (v, k) {
            //     console.log(k + ':' + v);
            // })

            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                // 注意：如果向服务器提交的是 FormData 格式的数据，
                // 必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return
                    }

                    layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                    location.href = '../article/article_list.html'
                }
            })

        })

    })
})
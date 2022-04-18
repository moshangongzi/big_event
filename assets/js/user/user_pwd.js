$(function () {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if(value === $('[name=oldPwd]').val()) {
                return '新密码不能和原密码相同'
            }
        },
        rePwd: function(value) {
            if(value !== $('[name=newPwd]').val()) {
                return '两次输入密码不一致'
            }
        }
    })

    // 监听表单的修改密码事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('修改密码失败')
                }
                layer.msg('修改密码成功')
                // 重置表单，只有dom元素有这个方法，jquery没有这个方法
                // 所以先要将jquery转换成dom对象
                // $('.layui-form')[0]可以将jquery转换成dom对象
                $('.layui-form')[0].reset()
                
            }
        })
    })
})
$(function () {

    var layer = layui.layer
    var form = layui.form
    // 获取用户的信息
    initUserInfo()

    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                console.log(res);
                // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    form.verify({
        nickname: function (value) {
            if (value.length < 6) {
                return '请输入1-6位的用户昵称'
            }
        }
    })

    // 监听提交修改的事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改信息失败')
                }
                layer.msg('更新用户信息成功！')
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }
        })
    })

    // 重置表单的数据
    $(".layui-form").on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })
})
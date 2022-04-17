$(function () {
    $("#link_reg").on('click', function () {
        $(".login-box").hide()
        $(".reg-box").show()
    })

    $("#link_login").on('click', function () {
        $(".login-box").show()
        $(".reg-box").hide()
    })

    // 从layui中获取form对象
    var form = layui.form
    // 从layui中获取layer对象
    var layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if (value !== pwd) {
                return '两次输入密码不一致'
            }
        }
    })

    $("#form-login").on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("登陆成功")
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })

    })

    // 监听注册表单的点击事件
    $("#form-reg").on('submit', function (e) {
        e.preventDefault()
        var data = {
            username: $("#form-reg [name=username]").val(),
            password: $('#form-reg [name=password]').val()
        }

        $.post('/api/reguser', data, function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg("注册成功")
            // 模拟人的点击行为
            $("#link_login").click()
        })
    })

})
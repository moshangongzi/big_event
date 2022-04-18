$(function () {
    getUserInfo()

    $("#btnLogout").on('click', function () {
        layer.confirm('是否确认退出?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 1.清除浏览器的token
            localStorage.removeItem('token')
            // 2.跳到login.html页面
            location.href = './login.html'
            layer.close(index);
        });
    })
})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败')
            }
            console.log(res);
            // 头像渲染
            renderAvatar(res.data)
        }
    })
}

function renderAvatar(user) {
    var name = user.nickname || user.username
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name)
    if (user.user_pic !== null) {
        $(".layui-nav-img").attr("src", user.user_pic).show()
        $(".text-avater").hide()
    } else {
        $(".layui-nav-img").hide()
        // 渲染文本
        $(".text-avater").html(name[0].toUpperCase()).show()
    }


}
$(function () {
    var laypage = layui.laypage

    // 定义一个时间的过滤器
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function padZero(num) {
        return num > 10 ? num : '0' + num
    }

    var p = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    // 初始化文章列表
    initList()
    // 初始化分类选择
    initCate()

    function initList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: p,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取列表数据失败')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 进行分页渲染
                renderPage(res.total)
            }
        })
    }

    function initCate() {
        // console.log('ok');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类失败')
                }
                // console.log(res);
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                layui.form.render()
            }
        })
    }


    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 p 中对应的属性赋值
        p.cate_id = cate_id
        p.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initList()
    })

    //   渲染分页的方法
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: p.pagesize, // 每页显示的数据条数
            curr: p.pagenum, // 默认选择的页
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 触发jump回调的两种方法：
            // 1、点击页码，first为undefined
            // 2、调用laypage.render方法, first为true
            // 3、切换条目也会触发jump回调
            jump: function (obj, first) {
                p.pagenum = obj.curr
                p.pagesize = obj.limit
                if (!first) {
                    initList()
                }
            }
        });

    }

    // 删除文章
    // 通过代理为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        var len = $('.btn-delete').length
        console.log(len);
        layer.confirm('是否确定删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {

            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        layui.layer.msg('删除文章失败')
                    }
                    layui.layer.msg('删除文章成功')
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        p.pagenum = p.pagenum === 1 ? 1 : p.pagenum - 1
                      }
                    
                    initList()
                }
            })
            layer.close(index);
        });
    })



})
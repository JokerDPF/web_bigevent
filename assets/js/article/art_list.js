$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth()) + 1
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象
    // 在查询数据时，将该参数对象上传到服务器
    var q = {
        pagenum: 1, // 默认选中的页码
        pagesize: 2, // 每页显示几条数据，默认显示两条
        cate_id: '', // 文章分类id 
        state: '' // 文章发布状态2
    }

    initTable()
    initCate()


    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('请求数据失败！')
                }
                console.log(res);
                // 使用模板引擎渲染页面数据
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    // 调用渲染分页的方法
                renderPage(res.total)
            }
        });
    }


    // 初始化分类菜单
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类所选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        });
    }


    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            // 获取表单中的筛选元素
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state

        // 根据最新的筛选条件，重新渲染列表数据
        initTable()
    })

    // 定义渲染分页的方法  在页面列表数据渲染完之后执行
    function renderPage(total) {
        // 调用laypage.render() 方法来实现分页的结构
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认选中的页码
            count: total, //数据总数，从服务端得到
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function(obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                console.log(first)
                console.log(obj.curr)

                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr

                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit

                // 根据最新的 q 获取对应的数据列表，并渲染表格
                // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }


    // 通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
            // 定义当前页面上按钮的个数
        var len = $('.btn-delete').length
            // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')

                    // 当数据删除完成后需要判断当前页面中是否还有数据，如果没有数据了，则需要将页码值减一，重新发起initTable()请求 
                    if (len === 1) {
                        // 如果len的值等于1，证明删除完之后重新调用initTable()刷新页面时，页面上就没有数据了，所有需要将请求体中的页码数据减一
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1

                    }

                    initTable()
                }
            });

            layer.close(index);
        });
    })
})
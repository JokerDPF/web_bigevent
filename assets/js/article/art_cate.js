$(function() {
    var layer = layui.layer

    var form = layui.form
        // 快速获取文章分类的列表
    initArticleList()

    function initArticleList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        });
    }

    // 给添加类别按钮绑定点击事件
    var layerIndex = null
    $('#btnAddCate').on('click', function() {
        layerIndex = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
        //拿到的index是一个重要的凭据，它是诸如layer.close(index)等方法的必传参数。
    })



    // 通过代理的形式为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg('新增分类文章失败！')
                }
                initArticleList()
                layer.msg('新增分类文章成功！')
                layer.close(layerIndex)
            }
        });
    })


    // 通过代理的形式给 btn-edit 按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function() {
        layerIndex = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id')

        // 发起请求获取对应分类数据
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        });
    })


    // 通过代理的形式为form-edit表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类文章失败！')
                }

                layer.msg('更新分类文章成功！')
                layer.close(layerIndex)
                initArticleList()
            }
        });
    })

    // 通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        let id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' },
            function(index) {
                $.ajax({
                    type: "GET",
                    url: "/my/article/deletecate/" + id,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg('删除分类失败！')
                        }
                        layer.msg('删除分类成功！')
                        layer.close(index);
                        initArticleList()
                    }
                });
            });
    })
})
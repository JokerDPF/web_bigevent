$(function() {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '用户名称必须在1-6个字符之间'
            }
        }
    })

    initUserInfo()


    // 初识化用户信息
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                console.log(res);
                // 快速向表单赋值取值
                // 调用form.val快速获取表单数据
                form.val('formUserInfo', res.data)
            }
        });
    }
    // 重置表单数据
    $('#btnReset').on('click', function(e) {
        // 阻止表单默认的重置行为
        e.preventDefault()
        initUserInfo()
    })


    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
            // 发起ajax 数据请求
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(), // $().serialize()能快速获取表单数据
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                    // 调用父页面中的方法，重新渲染用户信息和头像
                window.parent.getUserinfo()
            }
        });
    })
})
$(function() {
    // 给登录和注册按钮绑定点击事件
    // 点击去注册按钮
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击去登录按钮
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui中获取form对象
    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            // value是获取到确认密码的值
            // 还需获取到密码的值
            // 然后进行一次if判断
            // 若判断失败，则return出去一个错误提示
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '；两次密码不一致！'
            }
        }
    })


    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.post("/api/reguser", { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() },
            function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录')
                    // 模拟点击事件
                $('#link_login').click()
            }
        );
    })
})


// 监听登录表单提交事件
$('#form_login').on('submit', function(e) {
    // 阻止默认提交事件
    e.preventDefault()
    $.ajax({
        url: '/api/login',
        method: 'POST',
        // 快速获取表单数据
        data: $(this).serialize(),
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('登陆失败！')
            }
            layer.msg('登录成功！')
                // 将登录成功后返回的token保存到localStorage中
            localStorage.setItem('token', res.token)
                // 跳转到后台主页
            location.href = 'http://127.0.0.1:80/code/index.html'
        }


    })
})
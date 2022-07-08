$(function() {
    getUserinfo()
    var layer = layui.layer;
    // 点击按钮实现退出功能
    $('#btnLogout').on('click', function() {

        layer.confirm('确定退出登录?', { icon: 3, title: '提示' },
            function(index) {
                //do something
                // 1.清空本地存储的token
                localStorage.removeItem('token')
                    // 2. 重新跳转到登录页面
                location.href = 'http://127.0.0.1:5500/code/login.html'
                layer.close(index);
            });
    })
})


// 获取用户基本信息
function getUserinfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // 请求头
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            renderAvatar(res.data)
        },
        // 无论成功还是失败都会调用complete这个函数
        // complete: function(res) {
        //     // console.log('执行了complete回调');
        //     // console.log(res);
        //     // 在complete回调函数中，可以使用 res.responseJSON 得到服务器相应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败! ') {
        //         // 1.清空token
        //         localStorage.removeItem('token')
        //             // 2.跳转到登录页面
        //         location.href = 'http://127.0.0.1:5500/code/login.html'
        //     }
        // }
    });
}

// 渲染用户头像
function renderAvatar(user) {
    // 获取用户名称
    let name = user.nickname || user.username
        // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;' + name)
        // 渲染用户的头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        // 获取图片头像，渲染图片，显示
        $('.layui-nav-img').attr('src', user.user_pic).show()
            // 隐藏文本头像
        $('.text-avatar').hide()
    } else {
        // 渲染文本头像
        // 先隐藏文本头像
        $('.layui-nav-img').hide()
            // 获取用户名称的第一个字母，并且转换为大写
        let first = name[0].toUpperCase()
            // 将首字母填入文本头像中，并显示
        $('.text-avatar').html(first).show()
    }
}
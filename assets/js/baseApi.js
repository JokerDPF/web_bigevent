// 注意：每次调用$.ajax() 或者$.post() $.get()时，都会先调用$.ajaxPrefilter拿到我们发起的ajax请求对象
$.ajaxPrefilter(function(options) {

    // 在真正发起ajax请求之前，拼接好请求根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url

    // 统一为有权限的接口，设置headers头
    // 判断options中的url是否含有/my/字段
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 无论成功还是失败都会调用complete这个函数
    options.complete = function(res) {
        // console.log('执行了complete回调');
        console.log(res);
        // 在complete回调函数中，可以使用 res.responseJSON 得到服务器相应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.清空token
            localStorage.removeItem('token')
                // 2.跳转到登录页面
            location.href = 'http://127.0.0.1:5500/code/login.html'
        }
    }
});
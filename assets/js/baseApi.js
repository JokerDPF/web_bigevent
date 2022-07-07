// 注意：每次调用$.ajax() 或者$.post() $.get()时，都会先调用$.ajaxPrefilter拿到我们发起的ajax请求对象
$.ajaxPrefilter(function(options) {
    // 在真正发起ajax请求之前，拼接好请求根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
        // console.log(options.url);
});
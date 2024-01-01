const getURLLastPart = url => url.substring(url.lastIndexOf('/') + 1);

var interceptorRequest = []; // function array for request
var interceptorsResponse = []; // function array for response

(function() {

    const originFetch = window.fetch;

    async function asyncFetch(resource, options) {
//        console.log(resource + options.body);
        
        // request
        var newoptions = options;
        for (const interceptor of interceptorRequest) {
            newoptions = interceptor(resource, newoptions);
        }
        
        // response
        var response = await originFetch(resource, newoptions); // 调用原始的fetch 方法
        if (response.status >= 200 && response.status < 300) {
            for (const interceptor of interceptorsResponse) {
                response = await interceptor(response);
            }
            return response;
        } else {
            return Promise.reject(response);
        }
    };

    window.fetch = asyncFetch; // 替换fetch方法

})();

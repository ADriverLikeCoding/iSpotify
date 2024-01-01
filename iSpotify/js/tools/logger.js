console.log = (function(oriLogFunc){
    return function(message){
        oriLogFunc.call(console,message);
        //这里，在执行自定义console.log的时候，将str传递出去。
        window.webkit.messageHandlers.log.postMessage(message);
    }
})(console.log);

window.onerror = (msg, url, line, column, error) => {
    const message = {message: msg,url: url,line: line,column: column,error: JSON.stringify(error)};
    if (window.webkit) {
        window.webkit.messageHandlers.error.postMessage(message);
    } else {
        console.log("Error:", message);
    }
};


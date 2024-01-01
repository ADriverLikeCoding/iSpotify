// xhr的监听
(function() {
    let originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(...args) {
        console.log('xhr open: ' + args);
        return originOpen.apply(this, args);
    };
    
    let originSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(...args) {
        console.log('xhr send: ' + args);
        return originSend.apply(this,args);
    };
    
})();

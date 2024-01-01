var onCreateElementInjections = []; // {tag: 'tagName', inject: a_function_var}

(function injectCreateElement() {
     let originCreateElement = Document.prototype.createElement;
     Document.prototype.createElement = function(...args) {
         onCreateElementInjections.forEach( injection => {
             if (injection.tag == args[0]) {
                 return injection.inject(originCreateElement);
             }
         });
         
         return originCreateElement.apply(this, args);
     };
 })();

var onSetAttributeInjections = []; // {attribute: 'attributeName', inject: a_function_var}

(function injectSetAttribute() {
    let originSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(...args) {
        onSetAttributeInjections.forEach( injection => {
            if (injection.attribute == args[0]) {
                injection.inject(originSetAttribute);
            }
        })
        return originSetAttribute.apply(this, args);
    };
    
})();


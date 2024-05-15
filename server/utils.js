function isDateObj(dateObj){
    if(!dateObj || typeof dateObj !=='object') return false;
	if(dateObj instanceof Date) return true;
    if(typeof dateObj.getTime != 'function') return false;
    return !(Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime()));
}

function isRegExp(regExp){
    if(regExp instanceof RegExp) return true;
    if(!regExp || typeof regExp !=="object" || (!Object.prototype.toString.call(regExp).includes("RegExp"))) return false;
    try {
        new RegExp(regExp);
        return true;
    } catch(e) {
        return false
    }
}

const cloneObject = function (source,cloneLevel) {
    let level = 1;
    if (Array.isArray(source)) {
        const clone = [];
        for (var i=0; i<source.length; i++) {
            clone[i] = cloneObject(source[i],i+1);
        }
        return clone;
    } else if (isPlainObject(source)) {
        const clone = {};
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                clone[prop] = cloneObject(source[prop],level);
                level ++;
            }
        }
        return clone;
    } else {
        if(source === undefined && typeof cloneLevel !=='number'){
            return {};
        }
        return source;
    }
}

function isPlainObject ( obj ) {
    if(!obj || typeof obj =='boolean' || typeof obj =="number" || typeof obj =='string' || isDateObj(obj)) return false;
    const tStr = Object.prototype.toString.call(obj);
    if(tStr !== "[object Object]"  || tStr == '[object global]' || tStr == '[object Window]' || tStr == '[object DOMWindow]' || isRegExp(obj)){
        return false;
    }
    var proto, Ctor;
    proto = Object.getPrototypeOf( obj );
    // Objects with no prototype (e.g., `Object.create( null )`) are plain
    if ( !proto ) {
        return true;
    }
    var hasOwn = Object.prototype.hasOwnProperty;
    var fnToString = hasOwn.toString;
    var ObjectFunctionString = fnToString.call( Object );

    // Objects with prototype are plain iff they were constructed by a global Object function
    Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
    return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
}

Object.clone = cloneObject;
module.exports.cloneObject = cloneObject;
module.exports.isPlainObject = isPlainObject;
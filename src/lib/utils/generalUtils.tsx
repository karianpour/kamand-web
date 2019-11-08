import i18n from '../translations/i18n';

export function msleep(n:number) {
  //  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
  return sleep(n);
}

export function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function extractFlatMessagesFromError(err: any): string[]{
  const messages: string[] = [];
  for(let k in err){
    if(!err.hasOwnProperty(k)) continue;
    if(k==='codes') continue;
    if(Array.isArray(err[k])){
      messages.push(...(err[k].map( (e: any) => !e ? '' : e.toString())));
    }else if(err[k]){
      messages.push(err[k].toString());
    }
  }
  return messages;
}

export function extractErrorMessage (details:any): any{
  if(typeof details === 'string'){
    return details;
  }

  if(!!!details.codes) {
    console.error(`there should be a problem in extractError function in generalUtils module!`);
    return tryTranslation('odd') || 'odd error';
  };

  let message = '';
  const appendError = (c: any) => {
    const translated = tryTranslation(c);
    message += `${translated || JSON.stringify(c)}\n`;
  };
  for(let k in details.codes){
    if(!details.codes.hasOwnProperty(k)) continue;
    const code = details.codes[k];
    const f = tryTranslation(k);
    message += `${f || k}:\n`;
    if(Array.isArray(code)){
      code.forEach( appendError );
    }else{
      appendError(code);
      // const translated = tryTranslation(code);
      // message += `${translated || code}\n`;
    }
  }
  return message;
}

export function extractArrayError(err: any[]): any {
  const error = err.reduce( (r, e) => {
    const translated = tryTranslation(e);
    const otherMessages = getIn(r, e.path);
    r = setIn(r, e.path, (otherMessages ? otherMessages + '\n' : '') + (translated || e.message));
    return r;
  }, {});
  return error;
}

export function extractError (err:any): any{
  let details: any;
  let message: string;
  if(
    err && err.response && err.response.data && err.response.data.error && err.response.data.statusCode !== 200
  ){
    if(err.response.data.payload){
      details = err.response.data.payload;
      message = err.response.data.payload;
    }else if(err.response.data.message){
      message = err.response.data.message;
      try{
        details = JSON.parse(message);
      }catch(_){
        return {message};
      }
    }else{
      message = tryTranslation('unknown') || 'unknown error';
    }
  }else if(err && err.payload){
    details = err.payload;
    message = err.message || JSON.stringify(err.payload);
  }else if(err.message && err.message === 'Network Error'){
    message = tryTranslation('network_error') || 'network error';
  }else{
    message = tryTranslation('unknown') || 'unknown error';
  }

  if(details){
    try{
      if(details){
        console.log({err, error: details});
        if(Array.isArray(details)){
          return extractArrayError(details);
          // details.forEach( detail => {
          //   translate(detail);
          // });
        }else{
          translate(details);
        }
        return details;
      }
    }catch(_){
      return {message};
    }
  }

  return {message};
}

function translate (details: any) {
  if(!!!details.codes) return;
  for(let k in details.codes){
    if(!details.codes.hasOwnProperty(k)) continue;
    const code = details.codes[k];
    if(Array.isArray(code)){
      code.forEach( (c, i) => {
        const translated = tryTranslation(c);
        if(translated) {
          if(!details[k]) details[k] = [];
          details[k][i] = translated
        };
      });
    }else{
      const translated = tryTranslation(code);
      if(translated) details[k] = translated;
    }
  }
}

type IErrorCode = {
  code: string,
  params: { [K: string]: any },
}

function tryTranslation(code: string | IErrorCode): string | undefined{
  if(typeof code === 'string' ){
    const tkey = `error.${code}`;
    //FIXME not pure function
    const translated = i18n.t(tkey);
    if(tkey !== translated){
      return translated;
    }
  // }else if(code instanceof IErrorCode){
  }else{
    const tkey = `error.${code.code}`;
    const translated = i18n.t(tkey, code.params);
    if(tkey !== translated){
      return translated;
    }

  }
  return;
}

export function readParam(search: string, param: string): string {
  const i1 = search.indexOf(param+'=');
  if(i1>-1){
    let i2 = search.indexOf('&', i1);
    if(i2===-1) i2 = search.length;
    return search.substring(i1 + param.length+1, i2);
  }

  return '';
}

export function hasRole(user: any, checkingRoles: string | string[]): boolean {
  if(!user || !user.roles) return false;
  const { roles } = user;

  if(typeof roles === 'string'){
    if(typeof checkingRoles === 'string'){
      return roles === checkingRoles;
    }else{
      return checkingRoles.findIndex( r => r === roles) > -1;
    }
  }
  if(Array.isArray(roles)){
    if(typeof checkingRoles === 'string'){
      return roles.findIndex( r => r === checkingRoles) > -1;
    }else{
      return roles.some( r => checkingRoles.findIndex( cr => cr === r) > -1);
    }
  }

  // user.roles && user.roles.findIndex( (r) => 'admin');
  return false;
}

export function hash(s: string){
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}


/** @private is the given object a Function? */
export const isFunction = (obj: any): obj is Function =>
  typeof obj === 'function';

/** @private is the given object an Object? */
export const isObject = (obj: any): obj is Object =>
  obj !== null && typeof obj === 'object';

/** @private is the given object an integer? */
export const isInteger = (obj: any): boolean =>
  String(Math.floor(Number(obj))) === obj;

/** @private is the given object a string? */
export const isString = (obj: any): obj is string =>
  Object.prototype.toString.call(obj) === '[object String]';

/** @private is the given object a NaN? */
// eslint-disable-next-line no-self-compare
export const isNaN = (obj: any): boolean => obj !== obj;

/** @private is the given object/value a promise? */
export const isPromise = (value: any): value is PromiseLike<any> =>
  isObject(value) && isFunction(value.then);

export const hasNonEmptyValue = (obj: any): boolean => {
  if(isObject(obj)){
    if(Array.isArray(obj)){
      for(const v of obj){
        if(hasNonEmptyValue(v)) return true;
      }
    }else {
      for(const key of Object.keys(obj)){
        if(hasNonEmptyValue(obj[key])) return true;
      }
    }
  }else{
    if(obj){
      return true;
    }
  }
  return false;
}

export const toPath = (key: string): string[] => {
  const path: string[] = [];
  const parts = key.split('.');
  parts.forEach( part => {
    const i1 = part.indexOf('[');
    if(i1>=0){
      path.push(part.substring(0, i1));
      const i2 = part.indexOf(']');
      if(i2>=0){
        path.push(part.substring(i1+1, i2));
      }else{
        //error but ignore
      }
    }else{
      path.push(part);
    }
  });
  return path;
  /*
_.toPath('a.b.c');
// => ['a', 'b', 'c']
 
_.toPath('a[0].b.c');
// => ['a', '0', 'b', 'c']
   */
}

export const clone = (obj: any): any => {
  if(Array.isArray(obj)){
    return [...obj];
  }else if(isObject(obj)){
    return {...obj};
  }else{
    return obj;
  }
}

export function getIn(
  obj: any,
  key: string | string[],
  def?: any,
  p: number = 0
) {
  const path = Array.isArray(key) ? key : toPath(key);
  while (obj && p < path.length) {
    obj = obj[path[p++]];
  }
  return obj === undefined ? def : obj;
}

export function setIn(obj: any, path: string, value: any): any {
  let res: any = clone(obj); // this keeps inheritance when obj is a class
  let resVal: any = res;
  let i = 0;
  let pathArray = toPath(path);

  for (; i < pathArray.length - 1; i++) {
    const currentPath: string = pathArray[i];
    let currentObj: any = getIn(obj, pathArray.slice(0, i + 1));

    if (currentObj && (isObject(currentObj) || Array.isArray(currentObj))) {
      resVal = resVal[currentPath] = clone(currentObj);
    } else {
      const nextPath: string = pathArray[i + 1];
      resVal = resVal[currentPath] =
        isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
    }
  }

  // Return original object if new value is the same as current
  if ((i === 0 ? obj : resVal)[pathArray[i]] === value) {
    return obj;
  }

  if (value === undefined) {
    delete resVal[pathArray[i]];
  } else {
    resVal[pathArray[i]] = value;
  }

  // If the path array has a single element, the loop did not run.
  // Deleting on `resVal` had no effect in this scenario, so we delete on the result instead.
  if (i === 0 && value === undefined) {
    delete res[pathArray[i]];
  }

  return res;
}

/**
 * Recursively a set the same value for all keys and arrays nested object, cloning
 * @param object
 * @param value
 * @param visited
 * @param response
 */
export function setNestedObjectValues<T>(
  object: any,
  value: any,
  visited: any = new WeakMap(),
  response: any = {}
): T {
  for (let k of Object.keys(object)) {
    const val = object[k];
    if (isObject(val)) {
      if (!visited.get(val)) {
        visited.set(val, true);
        // In order to keep array values consistent for both dot path  and
        // bracket syntax, we need to check if this is an array so that
        // this will output  { friends: [true] } and not { friends: { "0": true } }
        response[k] = Array.isArray(val) ? [] : {};
        setNestedObjectValues(val, value, visited, response[k]);
      }
    } else {
      response[k] = value;
    }
  }

  return response;
}

export const parseSearch = (search: string): {[key: string]: string} => {
  if(search.substring(0, 1)==='?') search = search.substring(1);
  const params = search.split('&').map( p => p.split('=')).reduce( (r, p) => ({...r, [p[0]]: p[1]}), {});
  return params;
}

export const calcTotalOffset = (element: any): number => {
  return (element.offsetTop ? element.offsetTop : 0) + (
    element.offsetParent ? calcTotalOffset(element.offsetParent) : 0
  )
}
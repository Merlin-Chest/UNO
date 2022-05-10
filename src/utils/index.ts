export const once = (fn:Function)=>{
  let result:any;
  let cancelled = false;

  return (...args:any[]) => {
    if (cancelled) return result;
    result = fn(...args);
    cancelled = true;
    return result;
  }
}

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

export function timestampDiff (timeDiff:number) {
  let hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  let k = ''
  if(hours){
    k+=hours + '时'
  }
  if(minutes){
    k+=minutes + '分'
  }
  if(seconds){
    k+=seconds + '秒'
  }
  if(k === ''){
    k = '0秒'
  }
  return k;
};

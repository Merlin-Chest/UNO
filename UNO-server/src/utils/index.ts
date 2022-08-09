export function randomCoding() {
  let result = [];
  let n = 5;//这个值可以改变的，对应的生成多少个字母，根据自己需求所改
  for (let i = 0; i < n; i++) {
    //生成一个0到25的数字
    let ranNum = Math.ceil(Math.random() * 25);
    //大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;
    //然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里
    result.push(String.fromCharCode(65 + ranNum));
  }
  return result.join('');
}

export const shuffle = (arr: CardInfo[]) => {
  let len = arr.length; let random
  while (len !== 0) {
    random = (Math.random() * len--) >>> 0; // 无符号右移位运算符向下取整(注意这里必须加分号，否则报错)
    [arr[len], arr[random]] = [arr[random], arr[len]] // ES6的结构赋值实现变量互换
  }
  return arr
}

export * from './TaskQueue'
export * from './customCRUD'

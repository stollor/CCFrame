export class CMath {

  /**
   * 限制
   * @param num 传入数字 
   * @param min 最小
   * @param max 最大
   * @returns 
   */
  public static limit(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max);
  }

  public static swap(list: any[], index1: number, index2: number) {
    let temp = list[index1];
    list[index1] = list[index2];
    list[index2] = temp;
  }

  /**
   * 删除数组特定元素  
   */
  public static arrRemove<T>(arr: Array<T>, obj: T) {
    if (!arr) return;
    let index = arr.indexOf(obj);
    if (index > -1) {
      arr.splice(index, 1);
    }
  }


  /**
   * 洗牌算法
   * @param arr 
   */
  public static shuffleList(arr: any[]) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      let k = Math.floor(Math.random() * (len - i) + i);
      [arr[i], arr[k]] = [arr[k], arr[i]];
    }
  }
}
import { stat } from "fs";

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
   * @file: 数组中删除特定某个元素
   * @author: zouyuefen
   * @date: 2021/12/2 15:57
   **/
  public static arrRemove<T>(arr: Array<T>, obj: T) {
    if (!arr) return;
    let index = arr.indexOf(obj);
    if (index > -1) {
      arr.splice(index, 1);
    }
  }
}
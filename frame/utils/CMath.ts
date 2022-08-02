export class CMath{

    /**
     * 限制
     * @param num 传入数字 
     * @param min 最小
     * @param max 最大
     * @returns 
     */
    public static limit(num:number,min:number,max:number){
      return Math.min(Math.max(num,min),max);
    }
}
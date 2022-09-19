import { stat } from "fs";

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

	public static swap(list:any[],index1:number,index2:number){
		let temp=list[index1];
		list[index1] = list[index2];
		list[index2] = temp;
	}
}
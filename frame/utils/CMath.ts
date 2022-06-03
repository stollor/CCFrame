export class CMath{

    public static limit(num:number,min:number,max:number){
      return Math.min(Math.max(num,min),max);
    }
}
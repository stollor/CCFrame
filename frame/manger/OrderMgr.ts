import { Collider2D_base } from "cc";

export class OrderMgr {


    public static parse(str:string,opts?:Map<any,any>){
        if(!str) return;
        let result=[];
        let orderList= str.trim().split("|");
        for(let i=0;i<orderList.length;i++){
            let tempList=[];
            let orders=orderList[i].trim().split(",");

            for (let j=0 ;j<orders.length ;j++){
                tempList.push(this.trans(orders[j],opts));
            }
            result.push(tempList);
        }
    }

    public static trans(order:string,opts?:Map<any,any>){
        let codes=order.split(":");
        let valList=[];
        for(let i=1;i<codes.length;i++){
            let temp=codes[i];
            if(opts && opts.has(temp)){
                temp=opts[temp];
            }
            valList.push(temp);
        }
        let result={
            type:codes[0],
            val:valList
        }
        return result;
    }



    public static  run(order:any){
        switch(order.type){
            case "openPanel":globalThis.windowMgr.open.call(order.val);break;
        }
    }

}
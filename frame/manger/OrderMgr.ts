export class OrderMgr {


    public parse(str:string,opts?:Map<any,any>){
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
        return result;
    }

    public trans(order:string,opts?:Map<any,any>){
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


    public a(){

    }

    public runOrdList(List: Array<any>, ListParent?: Array<any>,rootList?: Array<any>){
        if ((!List && !ListParent) || (List?.length < 1 && ListParent?.length < 1)) return;
        if (List.checkChildArray()) {
            this.runOrdList(List.shift(), List,ListParent);
        } else {
            for (let i = 0; i < List.length; i++) {
                if(!!List[i])
                    this.runOrd(List[i], List[i].next ? () => { 
                        if(ListParent &&ListParent.length>0)
                            this.runOrdList(ListParent);
                        else if(rootList &&rootList.length>0)
                        this.runOrdList(rootList);
                     } : null);
            }
        }
    }


    public runOrd(order:any,cb?:Function){
        switch(order.type){
            case "openPanel":globalThis.windowMgr.open.call(order.val);break;
        }
    }

}
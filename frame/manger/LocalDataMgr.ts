import { sys } from "cc";
import { LocalType, MsgCode } from "../EnumMgr";

export class LocalDataMgr{
    private tempData={};

    public playId="playId"+"_";

    

    public setTempData(key:any,data:any){
      this.tempData[key]=data;
    }

    public getTempData(key:any){
      return this.tempData[key];
    }

    public setData(key:LocalType,data:any){
        sys.localStorage.setItem(this.playId+key, JSON.stringify(data));
    }

    public getData(key:LocalType){
        let data = sys.localStorage.getItem(this.playId + key);
        if (!data) return undefined;
        try {
            const jsonObj = JSON.parse(data)
            return jsonObj;
        } catch (error) {
            return data;
        }
    }


    // public getDataJudge(key){
    //     let val=this.getData(key);
    //     if(val==undefined || val==false||val==MsgCode.err ||val=="-1"){
    //         return false;
    //     }
    //     return true;
    // }

}
import { sys } from "cc";
import { LocalType } from "../../../mgr/EnumMgr";

export class LocalDataMgr {
    private tempData = {};

    public playId = "playId" + "_";



    public setTempData(key: any, data: any) {
        this.tempData[key] = data;
    }

    public getTempData(key: any) {
        return this.tempData[key];
    }

    public setData(key: LocalType | string, data: any) {
        sys.localStorage.setItem(this.playId + key, JSON.stringify(data));
    }

    public getData(key: LocalType | string) {
        let data = sys.localStorage.getItem(this.playId + key);
        if (!data) return undefined;
        try {
            const jsonObj = JSON.parse(data)
            return jsonObj;
        } catch (error) {
            return data;
        }
    }

    public addListItem(key: string, data: any, repeat: boolean = false) {
        let local = this.getData(key);
        if (!local) local = [];
        if (!repeat) {
            if (local.indexOf(data) >= 0) return;
        }
        local.push(data);
        this.setData(key, local);
    }

    public checkListItem(key, data) {
        let list = globalThis.localDataMgr.getData(key);
        if (!list) return false;
        if (list.indexOf(data) >= 0) return true;
        return false;
    }

    // public getDataJudge(key){
    //     let val=this.getData(key);
    //     if(val==undefined || val==false||val==MsgCode.err ||val=="-1"){
    //         return false;
    //     }
    //     return true;
    // }

}
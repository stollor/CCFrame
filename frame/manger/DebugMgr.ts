import { DEBUG } from "cc/env";
export class DebugMgr{
     public static updataSwitch(){
        globalThis.poolMgr.log=DEBUG;
        globalThis.windowMgr.log=DEBUG;
     }

}
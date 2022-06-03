/**
 * name:游戏框架管理类
 * info:
 * author:s906094945
 * time:(Mon May 30 2022 22:33:40 GMT+0800 (中国标准时间))
 */

import { EventMgr } from "./manger/EventMgr";

export class GameManager {

    /**资源加载 */
    public  resMgr;
    /**节点缓存 */
    public  poolMgr;
    /**声音管理 */
    public  audioMgr;
    /**事件管理 */
    public  eventMgr:EventMgr=new EventMgr();

    private static _getInstance:GameManager;
    public static getInstance(){
        if(!this._getInstance) this._getInstance=new GameManager();
        return this._getInstance;
    }

    public static init(){
        globalThis.eventMgr=GameManager.getInstance().eventMgr;
        //globalThis.resMgr=GameManager.getInstance().resMgr;
        //globalThis.resMgr=GameManager.getInstance().resMgr;
        //globalThis.resMgr=GameManager.getInstance().resMgr;
    }
}

declare global {
    namespace globalThis {
        var eventMgr:EventMgr;

    }
}
import { AudioMgr } from "./manger/AudioMgr";
import { EventMgr } from "./manger/EventMgr";
import { PoolMgr } from "./manger/PoolMgr";
import { ResMgr } from "./manger/ResMgr";


/**
 * name:游戏框架管理类
 * info:
 * author:s906094945
 * time:(Mon May 30 2022 22:33:40 GMT+0800 (中国标准时间))
 */
export class GameManager {


    /**资源加载 */
    private  _resMgr:ResMgr;
    /**节点缓存 */
    private  _poolMgr:PoolMgr;
    /**声音管理 */
    private  _audioMgr:AudioMgr;
    /**事件管理 */
    private  _eventMgr:EventMgr;

    get resMgr(){
        if(!this._resMgr) this._resMgr=new ResMgr();
        return this._resMgr;
    }

    get poolMgr(){
         if(!this._poolMgr) this._poolMgr=new PoolMgr();
        return this._poolMgr;
    }

    get audioMgr(){
         if(!this._audioMgr) this._audioMgr=new AudioMgr();
        return this._audioMgr;
    }


    get eventMgr(){
         if(!this._eventMgr) this._eventMgr=new EventMgr();
        return this._eventMgr;
    }


    private static _getInstance:GameManager;
    public static getInstance(){
        if(!this._getInstance) this._getInstance=new GameManager();
        return this._getInstance;
    }

    public static init(){
        globalThis.resMgr=GameManager.getInstance().resMgr;
        globalThis.eventMgr=GameManager.getInstance().eventMgr;
        globalThis.poolMgr=GameManager.getInstance().poolMgr;
        globalThis.audioMgr=GameManager.getInstance().audioMgr;
        
    }
}

declare global {
    namespace globalThis {
        var resMgr:ResMgr;
        var eventMgr:EventMgr;
        var poolMgr:PoolMgr;
        var audioMgr:AudioMgr;
    }
}
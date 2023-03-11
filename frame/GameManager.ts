import { Game } from "cc";
import { defaultConfig, EventType, PageType } from "../../mgr/EnumMgr";
import { AudioMgr } from "./manger/AudioMgr";
import { ConfigMgr } from "./manger/ConfigMgr";
import { EventMgr } from "./manger/EventMgr";
import { LocalDataMgr } from "./manger/LocalDataMgr";
import { OrderMgr } from "./manger/OrderMgr";
import { PoolMgr } from "./manger/PoolMgr";
import { ResMgr } from "./manger/ResMgr";
import { WindowMgr } from "./manger/WindowMgr";


/**
 * name:游戏框架管理�?
 * info:
 * author:s906094945
 * time:(Mon May 30 2022 22:33:40 GMT+0800 (中国标准时间))
 */
export class GameManager {

    /**资源加载 */
    private _resMgr: ResMgr;
    /**节点缓存 */
    private _poolMgr: PoolMgr;
    /**声音管理 */
    private _audioMgr: AudioMgr;
    /**事件管理 */
    private _eventMgr: EventMgr;
    /**命令管理 */
    private _orderMgr: OrderMgr;
    /**页面管理 */
    private _windowMgr: WindowMgr;
    /**本地数据管理 */
    private _localDataMgr: LocalDataMgr;
    /**配置表读取 */
    private _configMgr: ConfigMgr;

    get resMgr() {
        if (!this._resMgr) this._resMgr = new ResMgr();
        return this._resMgr;
    }

    get poolMgr() {
        if (!this._poolMgr) this._poolMgr = new PoolMgr();
        return this._poolMgr;
    }

    get audioMgr() {
        if (!this._audioMgr) this._audioMgr = new AudioMgr();
        return this._audioMgr;
    }


    get eventMgr() {
        if (!this._eventMgr) this._eventMgr = new EventMgr();
        return this._eventMgr;
    }

    get orderMgr() {
        if (!this._orderMgr) this._orderMgr = new OrderMgr();
        return this._orderMgr;
    }

    get windowMgr() {
        if (!this._windowMgr) this._windowMgr = new WindowMgr();
        return this._windowMgr;
    }

    get localDataMgr() {
        if (!this._localDataMgr) this._localDataMgr = new LocalDataMgr();
        return this._localDataMgr;
    }

    get configMgr() {
        if (!this._configMgr) this._configMgr = new ConfigMgr();
        return this._configMgr;
    }

    private static _getInstance: GameManager;
    public static getInstance() {
        if (!this._getInstance) this._getInstance = new GameManager();
        return this._getInstance;
    }

    constructor() {
        globalThis.resMgr = GameManager.getInstance().resMgr;
        globalThis.eventMgr = GameManager.getInstance().eventMgr;
        globalThis.orderMgr = GameManager.getInstance().orderMgr;
        globalThis.poolMgr = GameManager.getInstance().poolMgr;
        globalThis.audioMgr = GameManager.getInstance().audioMgr;
        globalThis.windowMgr = GameManager.getInstance().windowMgr;
        globalThis.localDataMgr = GameManager.getInstance().localDataMgr;
        globalThis.configMgr = GameManager.getInstance().configMgr;

        let count = 0;
        var cb = () => {
            count++;
            if (count >= 2) {
                globalThis.eventMgr.emit(EventType.Game_Start, null);
            }
        }

        globalThis.configMgr.loadConfigDir(defaultConfig.configDir, cb)

        globalThis.resMgr.proLoadPrefab(defaultConfig.GameProLoadPageList, () => { }, (len) => {
            let temp = [];
            for (let i = 0; i < len; i++) { temp.push(1) }
            globalThis.poolMgr.proLoadList(defaultConfig.GameProLoadPageList, temp);

            cb && cb();
        })
    }
}

declare global {
    namespace globalThis {
        /**资源管理 */
        var resMgr: ResMgr;
        /**全局事件 */
        var eventMgr: EventMgr;
        /**节点�? */
        var poolMgr: PoolMgr;
        /**声音管理 */
        var audioMgr: AudioMgr;
        /**页面管理 */
        var windowMgr: WindowMgr;
        /**本地数据管理 */
        var localDataMgr: LocalDataMgr;
        /**配置表读取 */
        var configMgr: ConfigMgr;
    }

}


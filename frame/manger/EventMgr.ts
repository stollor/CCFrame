import { js } from "cc";
import { EventType } from "../../../mgr/EnumMgr";

const fastRemoveAt = js.array.fastRemoveAt;

class BaseEvent {
    target: any;
    callback: Function;

    constructor(target: any, callback: Function) {
        this.target = target;
        this.callback = callback;
    }
}
/**
 * 全局事件管理
 */
export class EventMgr {
    private _eventList: {} = {};
    private _eventMap: {} = {};

    public getKey(list: any[], start, end) {
        let key = "";
        let maxLen = Math.min(end, list.length);
        for (let i = start; i <= maxLen; i++) {
            key += list[i];
            if (i < maxLen - 1) {
                key += "_";
            }
        }
        return key;
    }

    constructor() {
        for (let i in EventType) {
            let temp = i.split("_");
            for (let j = 0; j < temp.length - 1; j++) {
                let key = this.getKey(temp, 0, j);
                if (!this._eventMap[key]) this._eventMap[key] = [];
                this._eventMap[key].push(temp[j + 1]);
            }
        }
    }

    /**监听事件
     * @param type 事件类型
     * @param event 事件回调
     * @param target 事件对象
     * @returns 
     */
    public on(type: string, event: Function, target: any) {
        let tempBaseEvent = new BaseEvent(target, event);
        this._eventList[type] = this._eventList[type] || [];
        this._eventList[type].push(tempBaseEvent);
    }

    /**移除事件
     * @param type 事件类型
     * @param callback 事件回调
     * @param target 事件对象
     */
    public off(type: string, callback: Function, target: any) {
        let list = this._eventList[type];
        if (list) {
            let len = list.length;
            for (let i = 0; i < len; i++) {
                if (list[i].target == target && list[i].callback == callback) {
                    fastRemoveAt(list, i);
                    --i;
                    --len;
                }
            }
        }
    }

    /**抛消息
     * @param type 
     * @param data 
     * @param loop 是相应下级事件
     */
    public emit(type: string, data: any, loop = false) {
        let list = this._eventList[type];
        if (list) {
            let len = list.length;
            for (let i = 0; i < len; i++) {
                list[i]?.callback?.call(list[i].target, type, data);
            }
        }
        if (!loop) return;
        let next = this._eventMap[type];
        if (!next || next.length < 1) return;
        for (let i = 0; i < next.length; i++) {
            this.emit(type + "_" + next[i], data);
        }
    }

    /**移除目标上的所有事件
     * @param target 
     */
    public offTarget(target: any) {
        for (let key in this._eventList) {
            let list = this._eventList[key];
            if (list) {
                let len = list.length
                for (let i = 0; i < len; i++) {
                    if (list[i].target == target) {
                        fastRemoveAt(list, i);
                        --i;
                        --len;
                    }
                }
            }
        }
    }


    /**移除事件
     * @param target 
     */
    public offEvent(type: string) {
        this._eventList[type] = null;
    }

}
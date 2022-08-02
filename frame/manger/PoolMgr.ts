/**
 * name:
 * info:
 * author:s906094945
 * time:(Mon May 30 2022 22:33:40 GMT+0800 (中国标准时间))
 */

import { instantiate, Node } from "cc";
import { ColorType } from "../EnumMgr";
import { CLog } from "../utils/CLog";



/**
 * 节点管理类
 */
export class PoolMgr {
    private _pool: Map<string, Node[]>;
    public log: boolean = false;

    

    constructor() {
        this._pool = new Map<string, Node[]>();
    }

    //----------------------------------------base--------------------------------------------------------------------------

    public getLength(type) {
        if (!this._pool.has(type)) {
            return 0;
        }
        let list = this._pool.get(type) || [];
        return list.length;
    }



    /**
     * 通过path生成一个新的可以放置到节点池的节点
     * @param type 
     * @returns 
     */
    private getNew(type: string, cb: (node: Node) => void) {
        globalThis.resMgr.loadPrefab(type, (prefab) => {
            if (!prefab) return;
            let node = instantiate(prefab);
            node["path"] = type;
            cb?.(node);
        }, true);
    }

    //----------------------------------------------get-------------------------------------------------------------------------

    /**
     * 获取节点
     * @param type 节点类型
     * @returns 
     */
    public get(type: string, cb: (node: Node) => void) {
        if (!this._pool.has(type)) {
            this._pool.set(type, []);
            CLog.log(`pool(get)===>池中无${type},创建[],返回new 对象`,ColorType.绿,this.log);
            this.getNew(type, cb);
        } else {
            let list = this._pool.get(type) || [];
            if (list.length < 1) {
                CLog.log(`pool(get)===>池中${type}为空,返回new 对象`,ColorType.绿,this.log);
                this.getNew(type, cb);
            } else {
                let node = list.pop();
                node.active = true;
                CLog.log(`pool(get)===>池中有${type},返回pop对象,剩余${list.length}`,ColorType.绿,this.log);
                for (let i = 0; i < node.components.length; i++) {
                    //@ts-ignore
                    node.components[i].reuse && node.components[i].reuse();
                }
                cb(node);
            }
        }
    }

    /**
    * 获取节点列表
    * @param type 类型
    * @param number 数量
    * @param cb 回调 nodeList:Node[]
    */
    public getList(type: string, number: number, cb: (list: Node[]) => void) {
        let list: Node[] = [];
        for (let i = 0; i < number; i++) {
            this.get(type, (node) => {
                list.push(node);
                if (list.length == number) cb(list);
            })
        }
    }

    /**
     * 获取多个节点列表
     * @param list 节点名称列表 
     * @param number 数量列表
     * @param cb 回调
     */
    public getLists(typeList: string[], numberList: number[], cb:(result:{})=>void){
        let result={};
        var run=(type,num)=>{
            if(!type ||!num) return cb(result);
            this.getList(type,type,(list)=>{
                result[type]=list;
                run(typeList.pop(),numberList.pop())
            })
        }
        run(typeList.pop(),numberList.pop());
    }


    //---------------------------------------------------put------------------------------------------
    /**
     * 放回节点池
     * @param node 
     * @returns 
     */
    public put(node: Node) {
        let path = node["path"];
        if (path) {
            node.active = false;
            node.parent = null;
            for (let i = 0; i < node.components.length; i++) {
                //@ts-ignore
                node.components[i].unuse && node.components[i].unuse();
            }
            let list: Node[] = this._pool.get(path) || [];
            if (!list) {
                this._pool.set(path, [node]);
                CLog.log(`pool(put)===>回收${path},新建节点池`,ColorType.绿,this.log);
            } else {
                let same = list.find(item => item.uuid == node.uuid);
                if (same) {
                    CLog.log(`pool(put)===>回收${path},池中有已有该节点,现长${list.length}`,ColorType.绿,this.log);
                } else {
                    list.push(node);
                    CLog.log(`pool(put)===>回收${path},现在节点池长:${list.length}`,ColorType.绿,this.log);
                }
            }
        } else {
            node.destroy();
        }
    }

    /**
      * 放回一个节点的全部子节点
      * @param node 
      */
    public putChildren(node: Node) {
        const children = node.children;
        for (let i = children.length - 1; i >= 0; i--) {
            const node = children[i];
            if (node) {
                globalThis.gameManager.poolNodeMgr.put(node);
            }
        }
    }


    /**
     * 放回节点列表(不可以是children)
     * @param nodeList 
     */
    public putList(nodeList: Node[]) {
        for (let i = nodeList.length - 1; i >= 0; i--) {
            const node = nodeList[i];
            if (node) {
                this.put(node);
            }
        }
    }

    //-------------------------------------clear------------------------------------------------------
    /**
     * 清除节点池
     * @param type 
     */
    public clear(type: string) {
        if (this._pool.has(type)) {
            const list = this._pool.get(type) || [];
            for (let i = list.length - 1; i >= 0; i--) {
                const node = list[i];
                if (node) {
                    node.destroy();
                }
            }
            this._pool.delete(type);
        }
        CLog.log(this._pool,ColorType.绿,this.log);
    }


    /**
    * 清除全部缓存
    */
    public clearAll() {
        for (let key of this._pool) {
            this.clear(key[0]);
        }
    }

    //------------------------------------------------preLoad-----------------------------------------------

    /**
     * 预加载节点
     * @param type 节点类别
     * @param num  数量
     * @param cb 回调
     * @param max num是否为最大值,即缓存池中最大存储数量
     * @returns 
     */
    public preLoad(type: string, num: number, cb: Function = () => { }, max: boolean = false) {
        let len = this.getLength(type);
        if (max) num = Math.max(num - len, 0);
        if (num <= 0) return cb && cb();
        let count = 0;
        for (let i = 0; i < num; i++) {
            this.getNew(type, (node) => {
                this.put(node);
                count++;
                if (count == num) cb && cb();
            })
        }
    }

    /**
     * 预加载节点列表
     * @param type 
     * @param callBack 
     */
    public proLoadList(list: string[], number: number[], cb: Function = () => { }, max: boolean = false) {
        let count = 0;
        for (let i = 0; i < list.length; i++) {
            this.preLoad(list[i], number[i], () => {
                count++;
                if (count == list.length) cb && cb();
            }, max)
        }
    }


}
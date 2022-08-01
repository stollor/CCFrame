/**
 * name:
 * info:
 * author:s906094945
 * time:(Mon May 30 2022 22:33:40 GMT+0800 (中国标准时间))
 */

import { instantiate, Node } from "cc";
import { DEBUG } from "cc/env";
import { PageType, PoolType } from "../EnumMgr";
import { CLog } from "../utils/CLog";

/**
 * 节点管理类
 */
export class PoolMgr  {
    private _pool:Map<string,Node[]>;
    private _log:boolean=true;

    get debugLog(){
        return this._log;
    }

    set debugLog(val){
        this._log=val;
    }

    constructor(){
        this._pool=new Map<string,Node[]>();
    }

    /**
     * 通过path生成一个新的可以放置到节点池的节点
     * @param type 
     * @returns 
     */
    public getNew(type:PoolType|PageType,cb:(node:Node)=>void){
        globalThis.resMgr.loadPrefab(type,(prefab)=>{
            if(!prefab) return;
            let node=instantiate(prefab); 
            node["path"]=type;
            cb?.(node);
        },true);
    }

    /**
     * 获取节点
     * @param type 节点类型
     * @returns 
     */
    public get(type:PoolType|PageType,cb:(node:Node)=>void){
        if(!this._pool.has(type)){
            this._pool.set(type,[]);
            this._log &&CLog.log(`pool===>池中无${type},创建[],返回new 对象`);
            this.getNew(type,cb);
        }else{
            let list=this._pool.get(type)||[];
            if(list.length<1){
                this._log &&CLog.log(`pool===>池中${type}为空,返回new 对象`);
                this.getNew(type,cb);
            }else{
                let node=list.pop();
                node.active=true;
                this._log &&CLog.log(`pool===>池中有${type},返回pop对象,剩余${list.length}`);
                for(let i=0;i<node.components.length;i++ ){
                    //@ts-ignore
                    node.components[i].reuse &&node.components[i].reuse();
                }
                cb(node);
            }
        }
    }

    /**
     * 放回节点池
     * @param node 
     * @returns 
     */
    public put(node:Node){
        let path=node["path"];
        if(path){
            node.active=false;
            node.parent=null;
            for(let i=0;i<node.components.length;i++ ){
                //@ts-ignore
                node.components[i].unuse &&node.components[i].unuse();
            }
            let list:Node[]=this._pool.get(path)||[];
            if(!list){
                this._pool.set(path,[node]);
                this._log &&CLog.log(`pool===>回收${path},新建节点池`);
            }else{
                list.push(node);
                this._log &&CLog.log(`pool===>回收${path},现在节点池长:${list.length}`);
            }
        }else{
            node.destroy();
        }
    }

    /**
     * 清除节点池
     * @param type 
     */
    public clear(type:PoolType|PageType){
        if(this._pool.has(type)){
            this._pool.delete(type);
        }
        this._log &&CLog.log(this._pool);
    }

    /**
     * 预加载节点
     * @param type 
     */
    public preLoad(type:PoolType|PageType,num:number){
        for(let i=0;i<num;i++){
            this.getNew(type,(node)=>{
                this.put(node);
            })
        }
    }

    /**
     * 预加载节点列表
     * @param type 
     * @param callBack 
     */
    public proLoadList(list:PoolType[]|PageType[],number:number){
        for(let i=0;i<list.length;i++){
            this.preLoad(list[i],number)
        }
    }
}
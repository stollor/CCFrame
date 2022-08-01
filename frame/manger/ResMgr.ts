import { AudioClip, JsonAsset, Prefab, resources, sp, SpriteFrame, TiledMapAsset } from "cc";
import { DEBUG } from "cc/env";
import { CLog } from "../utils/CLog";
/**
 * 资源管理类
 * load加载
 * 自动释放资源
 */
export class ResMgr{

    /**
     * 预加载资源
     * @param list 
     * @param loadBack 加载进度
     * @param callBack 加载结束
     */
    proLoadPrefab(list:string[],loadBack:Function=()=>{},callBack:Function=()=>{})
    {
        let count=0;
        let len=list.length;
        for(let i=0;i<len;i++){
            this.loadPrefab(list[i],()=>{
                count++;
                loadBack&&loadBack(i,len);
                if(count>=len){
                    callBack&&callBack();
                }
            })
        }
    }


     /**
     * 加载预制体
     * @param path
     * @param cb
     * @returns
     */
    loadPrefab(path: string, cb?: (prefab: Prefab) => void,debug:boolean=false) {
        resources.load(path, Prefab,(err: Error, prefab: Prefab)=> {
            if (err){
                debug && CLog.err(err);
                return cb?.(null);
            } 
            cb?.(prefab);
        });
    }


    /**
     * 音频加载
     * @param name
     * @param cb
     * @return
     */
    loadAudio(name: string, cb?: (audioClip: AudioClip) => void,debug:boolean=false): void {
        resources.load(name, AudioClip, (err, audio)=> {
            if (err){
                debug && CLog.logList([`未找到音频:${name}`,err])
                cb?.(null);
                return null
            } 
            cb?.(audio);
            return audio;
        })
    }

    /**
     * spine文件加载
     * @param name 
     * @param cb 
     * @returns 
     */
    loadSpineData(name, cb?: (skeleton: sp.SkeletonData) => void,debug:boolean=false): void {
        resources.load(name, sp.SkeletonData, (err, spine) => {
            if (err){
                debug && CLog.err(err);
                return cb?.(null);
            } 
            cb?.(spine);
        })
    }

    /**
    * SpriteFrame文件加载
    * @param name 
    * @param cb 
    * @param booli18n  是否加载对应语言版本的图片
    * @returns 
    */
    loadImage(name: string, cb?: (sprite: SpriteFrame) => void, booli18n: boolean = false,debug:boolean=false) {
        resources.load(name + "/spriteFrame", SpriteFrame, (err, image) => {
            if (err){
                if (booli18n) return this.loadImage(name, cb, false);
                else debug && CLog.err(err);
                return cb && cb(null);
            } 
            cb && cb(image);
        })
    }

    loadJson(name: string, cb?: (p: any) => void,debug:boolean=false) {
        resources.load(name, JsonAsset, (err, jsonAsset: JsonAsset) => {
            if (err){
                debug && CLog.err(err);
                return cb?.(null);
            } 
            cb && cb(JSON.parse(JSON.stringify(jsonAsset.json)));
        })
    }

    /**
     * TiledMap文件加载
     * @param name 
     * @param cb 
     * @returns 
     */
    loadTiled(name: string, cb?: (p: any) => void,debug:boolean=false) {
        resources.load(name, TiledMapAsset, (err, jsonAsset: TiledMapAsset) => {
            if (err){
                debug && CLog.err(err);
                return cb?.(null);
            } 
            cb && cb(jsonAsset);
        })
    }
}
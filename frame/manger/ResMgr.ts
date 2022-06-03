import { AudioClip, JsonAsset, Prefab, resources, sp, SpriteFrame, TiledMapAsset } from "cc";
import { CLog } from "../utils/CLog";
/**
 * 资源管理类
 * load加载
 * 通过XXXmap释放资源
 */
export class ResMgr{

    public perfabMaps:  Map<string, Prefab>         = new  Map<string, Prefab>() ;//预制体
    public audioMaps:   Map<string, AudioClip>      = new  Map<string, AudioClip>();//音频
    public spineMaps:   Map<string, sp.SkeletonData>= new  Map<string, sp.SkeletonData>();//spine
    public imageMaps:   Map<string, SpriteFrame>    = new  Map<string, SpriteFrame>();//图片
    public jsonMaps:    Map<string, object>            = new  Map<string, object>(); //json
    public tiledMaps:   Map<string, TiledMapAsset>  = new  Map<string, TiledMapAsset>(); //瓦片地图



     /**
     * 加载预制体
     * @param path
     * @param cb
     * @returns
     */
    loadPerfab(path: string, cb?: (prefab: Prefab) => void) {
        if (this.perfabMaps.has(path))return cb?.(this.perfabMaps.get(path));
        resources.load(path, Prefab,(err: Error, prefab: Prefab)=> {
            if (err) return cb?.(null);
            this.perfabMaps.set(path, prefab);
            cb?.(prefab);
        });
    }


    /**
     * 音频加载
     * @param name
     * @param cb
     * @return
     */
    loadAudio(name: string, cb?: (audioClip: AudioClip) => void,debug?:boolean): void {
        if (this.audioMaps.has(name)) return cb && cb(this.audioMaps.get(name));
        resources.load(name, AudioClip, (err, audio)=> {
            if (err){
                if(debug) CLog.logList([`未找到音频:${name}`,err])
                return cb && cb(null);
            } 
            this.audioMaps.set(name, audio);
            cb && cb(audio);
        })
    }

    /**
     * spine文件加载
     * @param name 
     * @param cb 
     * @returns 
     */
    loadSpineData(name, cb?: (skeleton: sp.SkeletonData) => void): void {
        if (this.spineMaps.has(name)) return cb && cb(this.spineMaps.get(name));
        resources.load(name, sp.SkeletonData, (err, spine) => {
            if (err) return cb && cb(null);
            this.spineMaps.set(name, spine);
            cb && cb(spine);
        })
    }

    /**
    * SpriteFrame文件加载
    * @param name 
    * @param cb 
    * @param booli18n  是否加载对应语言版本的图片
    * @returns 
    */
    loadImage(name: string, cb?: (sprite: SpriteFrame) => void, booli18n: boolean = false) {
        //if (booli18n) name = name + "_" + i18n._language;
        if (this.imageMaps.has(name)) return cb && cb(this.imageMaps.get(name));
        resources.load(name + "/spriteFrame", SpriteFrame, (err, image) => {
            if (err) {
                if (booli18n) return this.loadImage(name, cb, false);
                return cb && cb(null);
            }
            this.imageMaps.set(name, image);
            cb && cb(image);
        })
    }

    loadJson(name: string, cb?: (p: any) => void) {
        if (this.jsonMaps.has(name)) return cb && cb(this.jsonMaps.get(name));
        resources.load(name, JsonAsset, (err, jsonAsset: JsonAsset) => {
            if (err) return cb && cb(null);
            this.jsonMaps.set(name, jsonAsset.json);
            cb && cb(jsonAsset.json);
        })
    }

    /**
     * TiledMap文件加载
     * @param name 
     * @param cb 
     * @returns 
     */
    loadTiled(name: string, cb?: (p: any) => void) {
        if (this.tiledMaps.has(name)) return cb && cb(this.tiledMaps.get(name));
        resources.load(name, TiledMapAsset, (err, jsonAsset: TiledMapAsset) => {
            if (err) return cb && cb(null);
            this.tiledMaps.set(name, jsonAsset);
            cb && cb(jsonAsset);
        })
    }
}
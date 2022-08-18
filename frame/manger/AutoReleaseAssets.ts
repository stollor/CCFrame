import {  _decorator,Asset,isValid } from 'cc';
const { ccclass, property ,menu} = _decorator;

@ccclass('AutoReleaseAssets')
export class AutoReleaseAssets {

    private dynamicsAssets: Asset[] = [];

    /**
     * 自动记录动态资源加载
     * @param _asset 
     */
    public addAutoReleaseAsset(_asset: Asset) {
        if (isValid(_asset)) {
            _asset.addRef();
            this.dynamicsAssets.push(_asset);
        }
    };

    /**
     * 释放动态加载的资源
     */
    public releaseAllDynamics(){
        for (let index = 0; index < this.dynamicsAssets.length; index++) {
            if (isValid(this.dynamicsAssets[index])) {
                this.dynamicsAssets[index].decRef();
            }
        }
        this.dynamicsAssets = [];
    }


    /**
     * 销毁节点时自动释放记录的动态资源
     */
    onDestroy(): void {
       this.releaseAllDynamics();
    };
}




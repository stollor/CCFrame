
import { Component, Sprite, SpriteFrame, tween, UIOpacity } from 'cc';
import { Button, Label, RichText } from 'cc';
import { Asset } from 'cc';
import { isValid } from 'cc';
import { _decorator, Node} from 'cc';
import { EventType } from '../EnumMgr';
import { AutoReleaseAssets } from '../manger/AutoReleaseAssets';
import { CTool } from '../utils/CTool';
import { CTween } from '../utils/CTween';
const { ccclass, property } = _decorator;

@ccclass('CComponentCustom')
export class CComponentCustom extends Component {

}


declare module 'cc' {
    interface Component {
        addAutoReleaseAsset:(_asset:Asset)=>void;
        addAutoReleaseAssets:(_assets:Asset[])=>void;
    }

   
}


Component.prototype.addAutoReleaseAsset = function (_asset: Asset) {
    let oneTempAuto = this.node.getComponent(AutoReleaseAssets);
    if (!isValid(oneTempAuto)) {
        oneTempAuto = this.node.addComponent(AutoReleaseAssets);
    };
    oneTempAuto.addAutoReleaseAsset(_asset);
};

Component.prototype.addAutoReleaseAssets = function (_assets:Asset[]) {
    let moreTempAuto = this.node.getComponent(AutoReleaseAssets);
    if (!isValid(moreTempAuto)) {
        moreTempAuto = this.node.addComponent(AutoReleaseAssets);
    };
    for (const _assetSelf of _assets) {
        moreTempAuto.addAutoReleaseAsset(_assetSelf);
    };
};
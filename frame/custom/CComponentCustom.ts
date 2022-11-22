
import { Component,_decorator  } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CComponentCustom')
export class CComponentCustom extends Component {

}



// Component.prototype.addAutoReleaseAsset = function (_asset: Asset) {
//     let oneTempAuto = this.node.getComponent(AutoReleaseAssets);
//     if (!isValid(oneTempAuto)) {
//         oneTempAuto = this.node.addComponent(AutoReleaseAssets);
//     };
//     oneTempAuto.addAutoReleaseAsset(_asset);
// };

// Component.prototype.addAutoReleaseAssets = function (_assets: Asset[]) {
//     let moreTempAuto = this.node.getComponent(AutoReleaseAssets);
//     if (!isValid(moreTempAuto)) {
//         moreTempAuto = this.node.addComponent(AutoReleaseAssets);
//     };
//     for (const _assetSelf of _assets) {
//         moreTempAuto.addAutoReleaseAsset(_assetSelf);
//     };
// };
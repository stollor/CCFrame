
import { Sprite, SpriteFrame } from 'cc';
import { Button, Label, RichText } from 'cc';
import { _decorator, Node} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CNodeCustom')
export class CNodeCustom extends Button {

}



declare module 'cc' {
    interface Node {
        on: (type, callback, target, useCapture?, video?) => void;
        setStr:(str:string|number)=>void;
        setImg:(frame:SpriteFrame)=>void;
        setImgRes:(path:string)=>void;
    }
}


var NodeOn: Function = Node.prototype.on;
Node.prototype.on = function (type, callback, target, useCapture, video) {
    let cb = callback;
    switch (type) {
        case Button.EventType.CLICK:
            cb = function (data) {
                callback?.call(this, data);
            }
            ; break;
        default: break;
    }
    NodeOn.call(this, type, cb, target, useCapture);
}

Node.prototype.setStr=function(str:string|number){
    let comp=this.getComponent(Label);
    if(!comp) comp=this.getComponent(RichText);
    if(comp) comp.string=str;
}

Node.prototype.setImg=function(frame:SpriteFrame){
    let comp=this.getComponent(Sprite);
    if(comp) comp.spriteFrame=frame;
}

Node.prototype.setImgRes=function(path:string){
    globalThis.resMgr.loadImage(path,(frame)=>{
        this.setImg(frame);
    })
}





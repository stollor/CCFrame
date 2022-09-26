
import { Component, Sprite, SpriteFrame, tween, UIOpacity, Vec3 } from 'cc';
import { Button, Label, RichText } from 'cc';
import { _decorator, Node } from 'cc';
import { EventType } from '../../../mgr/EnumMgr';
import { CTool } from '../utils/CTool';
import { CTween } from '../utils/CTween';
const { ccclass, property } = _decorator;

@ccclass('CNodeCustom')
export class CNodeCustom extends Component {

}

declare module 'cc' {
    interface Node {
        /**扩展的方法 */
        //on: (type, callback, target, useCapture?, video?) => void;
        destory: () => boolean;
        //oparity:number;
        set oparity(val: number);
        get oparity(): number;


        /**增加的方法 */
        setStr: (str: string | number) => void;
        setStrStep: (str: string | number, speed: number, cb?: Function) => void;
        setStrStepByTime: (str: string | number, speed: number, cb?: Function) => void;
        setRichStrStepByTime: (str: string, time: number, cb?: Function) => void;
        setRichStrStepBySpeed:(str: string, speed: number, cb?: Function) => void;
        setImg: (frame: SpriteFrame) => void;
        setImgRes: (path: string) => void;
        onClick: (cb: Function, inter?: number, opt?: any) => void;
        offClick: (cb: Function) => void;
        clearClickEvents: () => void;
        onEvent: (type: EventType, event: Function) => void;
        onEventMap: (Map: Map<EventType, Array<Function>>) => void;
    }


}




var NodeDestory: Function = Node.prototype.destroy;
Node.prototype.destroy = function () {
    globalThis?.eventMgr?.offTarget(this);
    return NodeDestory.call(this);
}



/**
 * 设置文字
 */
Node.prototype.setStr = function (str: string | number) {
    let comp = this.getComponent(Label);
    if (!comp) comp = this.getComponent(RichText);
    if (comp) comp.string = str;
}

Node.prototype.setStrStep = function (str: string | number, speed: number, cb: Function = null) {
    CTween.FromTo(String(str).length / speed, 0, String(str).length, (progress) => {
        this.setStr(String(str).slice(0, progress));
    }, null, () => { cb && cb() })
}

Node.prototype.setStrStepByTime = function (str: string | number, time: number, cb: Function = null) {
    CTween.FromTo(time, 0, String(str).length, (progress) => {
        this.setStr(String(str).slice(0, progress));
    }, null, () => { cb && cb() })
}

Node.prototype.setRichStrStepByTime = function (str: string, time: number, cb: Function = null) {
    let richList = CTool.GetRichTextArrary(str);
    let len = richList.length - 1;
    let sp = this.getComponent(RichText);
    CTween.FromTo(time, 0, len, (progress) => {
        sp.string = richList[~~(len - progress)];
    }, null, () => { cb && cb() })
}

Node.prototype.setRichStrStepBySpeed = function (str: string, speed: number, cb: Function = null) {
    let richList = CTool.GetRichTextArrary(str);
    let len = richList.length - 1;
    let sp = this.getComponent(RichText);
    CTween.FromTo(len/speed, 0, len, (progress) => {
        sp.string = richList[~~(len - progress)];
    }, null, () => { cb && cb() })

    // this.schedule(()=>{
    //     sp.string = richList[~~(len - progress)];
    // },0.1,len)
}

Node.prototype.setImg = function (frame: SpriteFrame) {
    let comp = this.getComponent(Sprite);
    if (!comp || !frame) return;
    comp.spriteFrame = frame;
    this.addAutoReleaseAsset(frame);
}

Node.prototype.setImgRes = function (path: string) {
    globalThis.resMgr.loadImage(path, (frame) => {
        this.setImg(frame);
    })
}

Node.prototype.onClick = function (cb: Function, inter: number = -1, opt: any = {}) {
    let btn: Button = this.getComponent(Button);
    if (!btn) btn = this.addComponent(Button);
    btn.transition = opt?.transition ? opt?.transition : 3;
    this.on(Button.EventType.CLICK, () => {
        if (inter > 0) {
            btn.interactable = false;
            btn.scheduleOnce(() => { btn.interactable = true; }, inter);
        }
    }, this);
    this.on(Button.EventType.CLICK, cb, this);
    //this.on(Button.EventType.)
}

Node.prototype.offClick = function (cb: Function) {
    this.off(Button.EventType.CLICK, cb, this);
}


Node.prototype.clearClickEvents = function () {
    let btn: Button = this.getComponent(Button);
    if (!btn) btn = this.addComponent(Button);
    while (btn.clickEvents.length > 0) {
        btn.clickEvents.pop();
    }
}


Node.prototype.onEvent = function (type: EventType, event: Function) {
    globalThis?.eventMgr?.on(type, event, this)
}

Node.prototype.onEventMap = function (map: Map<EventType, Array<Function>>) {
    for (let key in map) {
        for (let i = 0; i < map[key].length; i++) {
            globalThis?.eventMgr?.on(key, map[key][i], this)
        }
    }
}

// Node.prototype.transPosto = function (node:Node,off:Vec3){
//     var nodeWordPos = this.parent.convertToWorldSpaceAR(this.position);
//     var myParentSpacePosition = this.parent.convertToNodeSpaceAR(nodeWordPos);
// }


Object.defineProperty(Node.prototype, 'oparity', {
    configurable: true,
    enumerable: false,
    set(value) {
        let sp = this.getComponent(UIOpacity);
        if (!sp) sp = this.addComponent(UIOpacity);
        sp.opacity = value;
    },
    get() {
        let sp = this.getComponent(UIOpacity);
        if (!sp) sp = this.addComponent(UIOpacity);
        return sp.opacity;
    }
})



// let originOparity = Object.getOwnPropertyDescriptor(Node.prototype, "oparity")

// let originGet = originOparity.get

// originOparity.get = function() {

//     return 255

// }

// originOparity.set = function(val:number) {
//     console.log(val)

// }





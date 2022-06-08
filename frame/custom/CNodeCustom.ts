
import { Component, Sprite, SpriteFrame, UIOpacity } from 'cc';
import { Button, Label, RichText } from 'cc';
import { _decorator, Node} from 'cc';
import { EventType } from '../EnumMgr';
const { ccclass, property } = _decorator;

@ccclass('CNodeCustom')
export class CNodeCustom extends Component {

}

declare module 'cc' {
    interface Node {
        /**扩展的方法 */
        on: (type, callback, target, useCapture?, video?) => void;
        destory:()=>boolean;
        //oparity:number;
        set oparity(val:number);
        get oparity():number;
        

        /**增加的方法 */
        setStr:(str:string|number)=>void;
        setImg:(frame:SpriteFrame)=>void;
        setImgRes:(path:string)=>void;
        onClick:(cb:(btn:Button)=>void,inter?:number)=>void;
        onEvent:(type:EventType,event:Function)=>void;
        onEventMap:(Map:Map<EventType,Array<Function>>)=>void;
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

var NodeDestory:Function=Node.prototype.destroy;
Node.prototype.destroy=function(){
    globalThis?.eventMgr?.offTarget(this);
    return NodeDestory.call(this);
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

Node.prototype.onClick=function(cb:(btn:Button)=>void,inter:number=-1,opt:any={}){
    let btn:Button=this.getComponent(Button);
    if(!btn) btn=this.addComponent(Button);
    btn.transition=opt?.transition?opt?.transition:3;
    this.on(Button.EventType.CLICK,()=>{
        if(inter>0) {
            btn.interactable=false;
            btn.scheduleOnce(()=>{btn.interactable=true;},inter);
        }
        cb&&cb(btn);
    },this);
}

Node.prototype.onEvent=function(type:EventType,event:Function){
    globalThis?.eventMgr?.on(type,event,this)
}

Node.prototype.onEventMap=function(map:Map<EventType,Array<Function>>){
    for(let key in map){
        for(let i=0;i< map[key].length;i++){
            globalThis?.eventMgr?.on(key,map[key][i],this)
        }
    }
}


Object.defineProperty(Node.prototype, 'oparity', {
    configurable: true,
    enumerable: false,
    set(value) {
        let sp=this.getComponent(UIOpacity);
        if(!sp) sp=this.addComponent(UIOpacity);
        sp.opacity=value;
    },
    get() {
        let sp=this.getComponent(UIOpacity);
        if(!sp) sp=this.addComponent(UIOpacity);
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





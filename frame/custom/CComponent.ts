
import { Component, Sprite, SpriteFrame, tween, UIOpacity, Vec3 } from 'cc';
import { _decorator, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('CComponent')
export class CComponent extends Component {

    public eventList;

    onEnable() {
        this.node.onEventList(this.eventList);
    }

    onDisable() {
        this.node.offEventList(this.eventList);
    }
}
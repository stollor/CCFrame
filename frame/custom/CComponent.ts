
import { Component,_decorator} from 'cc';
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
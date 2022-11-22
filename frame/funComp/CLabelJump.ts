import { _decorator, Component, Node, instantiate, Layout, tween, v3, CCInteger, CCString, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 文字跳跃组件，应用在空白Node上
 * 第一个子节点为文字模板
 */
@ccclass('CLabelJump')
export class CLabelJump extends Component {
    @property({ type: CCString, displayName: "string"}) string:string="";
    @property({ type: CCInteger, displayName: "跳跃高度"}) jumpHeight :number= 30;
    @property({ type: CCFloat, displayName: "跳跃时间"}) jumpTime :number=0.1;
    @property({ type: CCFloat, displayName: "跳跃间隔"}) jumpInterval :number= 0.05;
    @property({ type: CCFloat, displayName: "跳跃周期"}) jumpDirtion :number= 3;
    //@property({ type: Node, displayName: "子item"}) item :Node= null;

    public layout:Layout;
    public item:Node;
    start() {
        this.item=this.node.children[0];
        this.item.parent=null;
        this.setLayout();
        this.refresh();
    }

    setLayout(){
        this.layout= this.node.getComponent(Layout);
        if(!this.layout)  this.layout= this.node.addComponent(Layout);
        this.layout.type=Layout.Type.HORIZONTAL;
        this.layout.alignVertical=false;
        this.layout.resizeMode=Layout.ResizeMode.CONTAINER;
    }

    onEnable(){
        this.schedule(this.showAni,this.jumpDirtion);
    }

    onDisable(){
        this.unschedule(this.showAni);
    }

    refresh(){
        this.unschedule(this.showAni);
        this.node.children.forEach(item=>tween(item).stop());
        this.node.destroyAllChildren();
        this.layout.resizeMode=Layout.ResizeMode.NONE;
        this.scheduleOnce(()=>{
            let list=this.string.split("");
            list.forEach((item,index)=>{
                let temp:Node=instantiate(this.item);
                temp.setStr(item)
                this.node.addChild(temp);
                temp.setPosition(0,0,0);
            })
            this.layout.resizeMode=Layout.ResizeMode.CONTAINER;
        })
        this.unschedule(this.showAni);
        this.schedule(this.showAni,this.jumpDirtion);
    }

    showAni(){
        this.node.children.forEach((item,index)=>{
            tween(item)
                .delay(index*this.jumpInterval)
                .by(this.jumpTime,{position:v3(0,this.jumpHeight,0)})
                .by(this.jumpTime,{position:v3(0,this.jumpHeight*-1,0)})     
                .start()
        })
    }
}


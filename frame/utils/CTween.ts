import { tween, TweenEasing ,Node, v3} from "cc";
import { PageAniType } from "../EnumMgr";

export class CTween{

  /**
   * 播放页面动画
   * @param node 
   * @param type 
   * @param cb 
   */
    public static runPageAni(node:Node,type:PageAniType,cb?:Function){
        switch(type){
          case PageAniType.none:
              cb&&cb();    
          break;
          case PageAniType.fadeIn:
              this.fadeIn(node,0.4,cb);
              break;
          case PageAniType.fadeOut:
              this.fadeOut(node,0.4,cb);
              break;
        }
    }

    /**
     * 从一个数字渐进到另一个数字
     * @param time 间隔事件
     * @param from 起始数字
     * @param to   目标数字
     * @param updata 每次刷新的回调
     * @param easing 变化曲线
     * @param cb 完成回调
     */
    public static FromTo(time:number,from:any,to:any,updata:Function,easing:TweenEasing ='linear',cb?:Function){
      var obj={val:from}  
      tween(obj)
        .to(time,{val:to},{
           easing: easing,
          "onUpdate":()=>{
            updata(obj.val);
          }
        })
        .call(cb)
        .start();
    }

    /**
     * 等待time秒后执行回调
     * @param time 等待时长
     * @param cb 回调
     */
    public static wait(time:number,cb:Function){
       var obj={val:0};  
        tween(obj)
          .delay(time)
          .call(cb)
          .start();
    }

    /**
     * 渐显
     * @param obj 对象 
     * @param time 时长
     * @param cb 回调
     */
    public static fadeIn(obj:Node,time:number=0.5,cb?:Function){
      tween(obj)
          //@ts-ignore
          .set({oparity:0})
          //@ts-ignore
          .to(time,{oparity:255},{easing:"circIn"})
          .call(cb)
          .start();
    }

    /**
     * 渐隐
     * @param obj 对象 
     * @param time 时长
     * @param cb 回调
     */
    public static fadeOut(obj:Node,time:number=0.5,cb?:Function){
      tween(obj)
          //@ts-ignore
          .set({oparity:255})
          //@ts-ignore
          .to(time,{oparity:0},{easing:"circOut"})
          .call(cb)
          .start();
    }

    /**
     * 跳动
     * @param node 对象节点 
     * @param dis 跳动距离
     * @param inter 时间间隔
     */
    public static upDown(node:Node,dis:number=10,inter:number=0.3){
       tween(node)
          .by(inter,{position:v3(0,dis,0)})
          .by(inter,{position:v3(0,-dis,0)})
          .union()
          .repeatForever()
          .start()
    }
}
import { tween, TweenEasing ,Node, v3} from "cc";
import { PageAniType } from "../EnumMgr";

export class CTween{

    public static runPageAni(node:Node,type:PageAniType,cb:Function=null){
        switch(type){
          case PageAniType.fadeIn:
              this.fadeIn(node,0.4,cb);
              break;
          case PageAniType.fadeOut:
              this.fadeOut(node,0.4,cb);
              break;
        }
    }

    public static FromTo(time:number,from:any,to:any,updata:Function,easing:TweenEasing ='linear',cb:Function=null){
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


    public static wait(time:number,cb:Function){
       var obj={val:0};  
        tween(obj)
          .delay(time)
          .call(cb)
          .start();
    }

    public static fadeIn(obj:Node,time:number=0.5,cb:Function=null){
      tween(obj)
          //@ts-ignore
          .set({oparity:0})
          //@ts-ignore
          .to(time,{oparity:255},{easing:"circIn"})
          .call(cb)
          .start();
    }

    public static fadeOut(obj:Node,time:number=0.5,cb:Function=null){
      tween(obj)
          //@ts-ignore
          .set({oparity:255})
          //@ts-ignore
          .to(time,{oparity:0},{easing:"circOut"})
          .call(cb)
          .start();
    }


    public static upDown(node:Node,dis:number=10){
       tween(node)
          .by(0.3,{position:v3(0,dis,0)})
          .by(0.3,{position:v3(0,-dis,0)})
          .union()
          .repeatForever()
          .start()
    }
}
import { tween, TweenEasing } from "cc";

export class CTween{

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
}
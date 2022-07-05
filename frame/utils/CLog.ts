import { DEBUG } from "cc/env";

var colorList=["#AABBCC","#AACCBB","#BBAACC","#BBCCAA","#CCBBAA","#CCAABB"]
export class CLog{

    public static debug=DEBUG;
    
    static getColor(index:number){
      return colorList[index%colorList.length];
    }

    static getRandomColor(){
      return colorList[~~(colorList.length*Math.random())];
    }

    static logList(list:any[]){
      if(!this.debug) return;
      let color=this.getRandomColor();
      for(let i=0;i<list.length;i++){
          console.log(`%c${list[i]}`,`color:#000000;background:${color}`);
      }
    }

    static err(...msg){
      if(!this.debug) return;
      let color="#AA2323";
      console.log(`%c${msg}`,`color:#FFFFFF;background:${color}`);

    }
}
var colorList=["#AABBCC","#AACCBB","#BBAACC","#BBCCAA","#CCBBAA","#CCAABB"]
export class CLog{
    
    static getColor(index:number){
      return colorList[index%colorList.length];
    }

    static getRandomColor(){
      return colorList[~~(colorList.length*Math.random())];
    }

    static logList(list:any[]){
      let color=this.getRandomColor();
      for(let i=0;i<list.length;i++){
          console.log(`%c${list[i]}`,`color:#000000;background:${color}`);
      }
    }
}
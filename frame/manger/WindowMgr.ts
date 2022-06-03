import { find ,Node} from "cc";
import { PageLeve, PageType } from "../EnumMgr";

export class WindowMgr{

    constructor(){
        this.init();
    }

    init(){
      let pages:Node=find("Canvas/pages");
      if(!pages) return;
      for(let leve in PageLeve){
          let temp=find(leve,pages);
          if(!temp) pages.addChild(temp);
      }
      let index=0;
      for(let leve in PageLeve){
          let temp=find(leve,pages);
          temp.setSiblingIndex(index++);
      }
    }

    open(type:PageType,leve:PageLeve,data=null){
        let page=globalThis.poolMgr.get(type);
        let parent:Node=find("Canvas/pages/"+leve);
        parent.addChild(page);
        if(!data) return;
        for(let i=0;i<page.components.length;i++){
            //@ts-ignore
            page.components[i].init?.(data);
        } 

    }

    close(node){
        globalThis.poolMgr.put(node);
    }

    activeLevels(leves:PageLeve[],active:boolean){
        for(let i=0;i<leves.length;i++){
          let parent:Node=find("Canvas/pages/"+leves[i]);
          parent.active=active;
        }
        
    }

  
}
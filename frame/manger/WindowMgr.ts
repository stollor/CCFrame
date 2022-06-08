import { find ,Layers,Node, tween, Widget} from "cc";
import { PageAniType, PageLeve, PageType } from "../EnumMgr";
import { CTween } from "../utils/CTween";

export class WindowMgr{

    constructor(){
        this.init();
    }

    getPageNode(name){
        let newNode:Node=new Node(name);
        newNode.layer=Layers.Enum.UI_2D;
        let widget=newNode.addComponent(Widget);
        widget.alignFlags=1 << 0| 1 << 1|1 << 2|1 << 3| 1 << 4|1 << 5;
        widget.left=0;
        widget.right=0;
        widget.top=0;
        widget.bottom=0;
        return newNode;
    }

    init(){
      let pages:Node=find("Canvas/pages");
      if(!pages) return;
      for(let leve in PageLeve){
          let temp=find(leve,pages);
          if(!temp) pages.addChild(this.getPageNode(leve));
      }
      let index=0;
      for(let leve in PageLeve){
          let temp=find(leve,pages);
          temp.setSiblingIndex(index++);
      }
    }

    open(type:PageType,leve:PageLeve,data=null,ani:PageAniType=PageAniType.fadeIn){
        let page:Node=globalThis.poolMgr.get(type);
        let parent:Node=find("Canvas/pages/"+leve);
        parent.addChild(page);
        CTween.runPageAni(page,ani);
        if(!data|| !page.components) return;
        for(let i=0;i<page.components.length;i++){
            //@ts-ignore
            page.components[i].init?.(data);
        } 

    }

    close(page:Node,ani:PageAniType=PageAniType.fadeOut){
        CTween.runPageAni(page,ani,()=>{
            globalThis.poolMgr.put(page);
        });
        
    }

    activeLevels(leves:PageLeve[],active:boolean){
        for(let i=0;i<leves.length;i++){
          let parent:Node=find("Canvas/pages/"+leves[i]);
          parent.active=active;
        }
        
    }

  
}
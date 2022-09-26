import { find, Layers, Node, tween, Widget } from "cc";
import { EventType, PageType } from "../../../mgr/EnumMgr";
import { ColorType, PageAniType, PageLeve } from "../CEnum";
import { CLog } from "../utils/CLog";
import { CTween } from "../utils/CTween";

export class WindowMgr {
    public log: boolean = false;

    constructor() {
        this.init();
    }

    getPageNode(name) {
        let newNode: Node = new Node(name);
        newNode.layer = Layers.Enum.UI_2D;
        let widget = newNode.addComponent(Widget);
        widget.alignFlags = 1 << 0 | 1 << 1 | 1 << 2 | 1 << 3 | 1 << 4 | 1 << 5;
        widget.left = 0;
        widget.right = 0;
        widget.top = 0;
        widget.bottom = 0;
        return newNode;
    }

    init() {
        let pages: Node = find("Canvas/pages");
        if (!pages) return;
        for (let leve in PageLeve) {
            let temp = find(leve, pages);
            if (!temp) pages.addChild(this.getPageNode(leve));
        }
        let index = 0;
        for (let leve in PageLeve) {
            let temp = find(leve, pages);
            temp.setSiblingIndex(index++);
        }
    }

    open(type: PageType, leve: PageLeve, data = null, ani: PageAniType = PageAniType.fadeIn) {
        CLog.log(`windowMgr===>请求打开${leve}页面${type}`, ColorType.橙, this.log);
        globalThis.poolMgr.get(type, (page) => {
            let parent: Node = find("Canvas/pages/" + leve);
            parent.addChild(page);
            if (!page.components) return;
            CTween.runPageAni(page, ani, () => {
                for (let i = 0; i < page.components.length; i++) {
                    //@ts-ignore
                    page.components[i].overPageAni?.(data);
                }
            });

            if (!data) return;

            for (let i = 0; i < page.components.length; i++) {
                //@ts-ignore
                page.components[i].init?.(data);
            }

            CLog.log(`windowMgr===>${leve}页面${type}打开完毕`, ColorType.绿, this.log);
        });
    }

    close(page: Node, ani: PageAniType = PageAniType.fadeOut) {
        CTween.runPageAni(page, ani, () => {
            globalThis.poolMgr.put(page);
        });
        CLog.log(`windowMgr===>关闭页面${page.name}`, ColorType.绿, this.log);
    }

    activeLevels(leves: PageLeve[], active: boolean) {
        for (let i = 0; i < leves.length; i++) {
            let parent: Node = find("Canvas/pages/" + leves[i]);
            parent.active = active;
            CLog.log(`windowMgr===>level页面${parent.name}置为${active}`, ColorType.绿, this.log);
        }
    }


}
export enum LocalType{
    playInfo="playInfo"
}


/**page的显示层级 */
export enum PageLeve{
    main="main",
    submain="submain",
    tip="tip",
    guide="guide",
    top="top"
}

/**page */
export enum PageType{
    set="a/b/c"
}

/**
 * 事件类型
 * "_"分割事件等级
 * 上级事件触发时会触发所有下级事件
 */
export enum EventType{
    UI="UI",
    Page="Page",
    Data="Data",

    UI_Money="UI_Money"

}


/**缓存池节点 */
export enum PoolType{
    baseNode="a/b/c",
}

/**音效 */
export enum AudioType{
    start="audio/music/雨声"
}



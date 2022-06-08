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
    CPageLog="prefabs/pages/CPageLog",
    CPageNotes="prefabs/pages/CPageNotes",
    CPageReset="prefabs/pages/CPageReset",
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
    Game_Start="Game_Start",
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

export enum PageAniType{
    fadeIn,
    fadeOut,
}


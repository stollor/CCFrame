/**本地存储数据 */
export enum LocalType{
    playInfo="playInfo",
    firstGame="firstGame",
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
    CPageRoom="prefabs/pages/CPageRoom",
    CPageRoomDetail="prefabs/pages/CPageRoomDetail",

    CPageUI="prefabs/pages/CPageUI",
    CPageUITip="prefabs/pages/CPageUITip",
    CPageUIShare="prefabs/pages/CPageUIShare",
    CPageUISet="prefabs/pages/CPageUISet",
    CPagePropInfo="prefabs/pages/CPagePropInfo",

    CPageMsgTip="prefabs/common/CPageMsgTip",
    CPageStory="prefabs/pages/CPageDialogue",
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
    UI_Money="UI_Money",

    Story_Play="Story_play",

}


/**缓存池节点 */
export enum PoolType{
    baseNode="a/b/c",
}

/**音效 */
export enum AudioType{
    start="audio/music/雨声"
}

/**页面出入场动画 */
export enum PageAniType{
    fadeIn,
    fadeOut,
}

/**错误码 */
export enum MsgCode{
    err=-1,
    done=0,
    ok=1,
}


/**资源路径 */
export enum ResPath{
    StroyJson="config/story/",
    StroyImg="textures/story/",
    StroyAudio="audio/story/"
}
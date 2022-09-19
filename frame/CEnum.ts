
export enum ColorType {
  红 = "#d1414b",
  橙 = "#d28538",
  黄 = "#def784",
  绿 = "#9dcf09",
  青 = "#84edc8",
  蓝 = "#59b4de",
  紫 = "#cb2a98",

  粉 = "#d37994",
  白 = "#f7f9f7",
  灰 = "#c7d5c8",
  黑 = "#0f120f",
}

/**page的显示层级 */
export enum PageLeve {
  main = "main",
  submain = "submain",
  tip = "tip",
  guide = "guide",
  top = "top"
}

/**页面出入场动画 */
export enum PageAniType {
  none,
  fadeIn,
  fadeOut,
}

/**错误码 */
export enum MsgCode {
  err = -1,
  done = 0,
  ok = 1,
}

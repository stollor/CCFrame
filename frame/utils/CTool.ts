
export class CTool{

    /**
     * 获取富文本打字机数组
     * @param str 传入富文本
     * @returns 返回字符串数组(0->leng:最长->最短)
     */
    public static GetRichTextArrary(str:string){
        let charArr = str.replace(/<.+?\/?>/g, '').split('');
        let tempStrArr = [str];

        for (let i = charArr.length; i > 1; i--) {
          let curStr = tempStrArr[charArr.length - i];
          let lastIdx = curStr.lastIndexOf(charArr[i - 1]);
          let prevStr = curStr.slice(0, lastIdx);
          let nextStr = curStr.slice(lastIdx + 1, curStr.length);

          tempStrArr.push(prevStr + nextStr);
        }
        return tempStrArr;
    }

}
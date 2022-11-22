
export class CTool {

    /**
     * 获取富文本打字机数组
     * @param str 传入富文本
     * @returns 返回字符串数组(0->leng:最长->最短)
     */
    public static GetRichTextArrary(str: string) {
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

    /**
     * 规范数字进制
     * @param value (数量)
     * @returns 
     */
    public static numberFormat(value: number): string {
        var param = {};
        var k = 1000;
        var sizes = ["", "K", "M", "B", "T", "P", "E"];
        if (value < k) {
            param["value"] = value;
            param["unit"] = "";
        } else {
            let i = Math.floor(Math.log(value) / Math.log(k));
            param["value"] = Math.floor((value / Math.pow(k, i)) * 100) / 100;
            param["unit"] = sizes[i];
        }
        return param["value"] + param["unit"];
    }

    /**
     * 规范计时时间进制
     * @param value(秒) 
     * @returns 
     */
    public static CountDownFormat(value: number): string {
        let s = ~~(value % 60);
        let m = ~~((value / 60) % 60);
        let h = ~~((value / (60 * 60)) % 24);
        let d = ~~((value / (60 * 60 * 24)));

        s = this.fillString(String(s), 2, "0");
        m = this.fillString(String(m), 2, "0");
        h = this.fillString(String(h), 2, "0");
        d = this.fillString(String(d), 2, "0");

        let result=""
        if(d>0){
            result=`${d}:${h}${m}:${s}`;
        }else if(h>0){
            result=`${h}:${m}:${s}`;
        }else{
            result=`${m}:${s}`;
        }
       
        return result;
    }



    /*
    * 对日期进行格式化， 和C#大致一致 默认yyyy-MM - dd HH: mm: ss
        * 可不带参数 一个日期参数 或一个格式化参数
            * @param date 要格式化的日期
                * @param format 进行格式化的模式字符串
                    * 支持的模式字母有： 
    * y: 年, 
    * M: 年中的月份(1 - 12), 
    * d: 月份中的天(1 - 31), 
    * H: 小时(0 - 23), 
    * h: 小时(0 - 11), 
    * m: 分(0 - 59), 
    * s: 秒(0 - 59), 
    * f: 毫秒(0 - 999),
    * q: 季度(1 - 4)
    * @return String
        * @author adswads@gmail.com
    */
    public static dateFormat(date?: any, format?: string): string {
        //无参数
        if (date == undefined && format == undefined) {
            date = new Date();
            format = "yyyy-MM-dd HH:mm:ss";
        }
        //无日期
        else if (typeof (date) == "string") {
            format = date;
            date = new Date();
        }
        //无格式化参数
        else if (format === undefined) {
            format = "yyyy-MM-dd HH:mm:ss";
        }
        else { }
        //没有分隔符的特殊处理

        let map = {
            "y": date.getFullYear() + "",//年份
            "M": date.getMonth() + 1 + "", //月份 
            "d": date.getDate() + "", //日 
            "H": date.getHours(), //小时 24
            "m": date.getMinutes() + "", //分 
            "s": date.getSeconds() + "", //秒 
            "q": Math.floor((date.getMonth() + 3) / 3) + "", //季度 
            "f": date.getMilliseconds() + "" //毫秒 
        };
        //小时 12
        if (map["H"] > 12) { map["h"] = map["H"] - 12 + ""; }
        else { map["h"] = map["H"] + ""; }
        map["H"] += "";

        let reg = "yMdHhmsqf";
        let all = "", str = "";
        for (let i = 0, n = 0; i < reg.length; i++) {
            n = format.indexOf(reg[i]);
            if (n < 0) { continue; }
            all = "";
            for (; n < format.length; n++) {
                if (format[n] != reg[i]) {
                    break;
                }
                all += reg[i];
            }
            if (all.length > 0) {
                if (all.length == map[reg[i]].length) {
                    str = map[reg[i]];
                }
                else if (all.length > map[reg[i]].length) {
                    if (reg[i] == "f") {
                        str = map[reg[i]] + this.charString("0", all.length - map[reg[i]].length);
                    }
                    else {
                        str = this.charString("0", all.length - map[reg[i]].length) + map[reg[i]];
                    }
                }
                else {
                    switch (reg[i]) {
                        case "y": str = map[reg[i]].substr(map[reg[i]].length - all.length); break;
                        case "f": str = map[reg[i]].substr(0, all.length); break;
                        default: str = map[reg[i]]; break;
                    }
                }
                format = format.replace(all, str);
            }
        }
        return format;
    }

    /**
     * 获取重复count的str
     * @param str 
     * @param count 
     * @returns 
     */
    public static charString(str: string, count: number): string {
        var result: string = "";
        while (count--) {
            result += str;
        }
        return result;
    }

    /**
     * 填充str到指定长度
     * @param str 传入字符串
     * @param leng 目标长度
     * @param filler 填充物
     * @returns 
     */
    public static fillString(str,leng,filler){
        if(str.length>=leng) return str;
        return this.charString(filler,leng-str.length)+str;
    }

    /**深拷贝 ps:不能拷贝方法,只能拷贝数据
   * @param obj  拷贝对象
   */
	public static deepCopy(obj: any): any {
		var a = JSON.stringify(obj);
		var newobj = JSON.parse(a);
		return newobj;
	}

}
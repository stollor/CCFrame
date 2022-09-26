import { resources } from "cc";
import { TextAsset } from "cc";

export class ConfigMgr {

  public tables: Map<string, ConfTable> = null;

  constructor() {
    this.tables = new Map<string, ConfTable>;
  }

  public loadConfigDir(path: string, cb?: Function) {
    resources.loadDir(path, TextAsset, (err, assets) => {
      if (err) {
        return;
      }
      for (let i = 0; i < assets.length; i++) {
        let asset = assets[i];
        this.createTable(asset.name, asset.text);
      }
      cb && cb();
    });
  }

  public loadConfig(path: string, cb?: Function) {
    resources.load(path, TextAsset, (err, asset) => {
      this.createTable(asset.name, asset.text);
      cb && cb();
    });
  }

  private createTable(name: string, source: string) {
    let cfg = new ConfTable(name);
    cfg.init(source);
    this.tables.set(name, cfg);
  }
}


export class ConfTable {
  cnindexs: Map<any, Map<any, Array<Map<string, any>>>>;       //索引队列
  keyIndexs: Map<any, Array<any>>;      //键值索引
  rows: Array<Map<string, string>>;//行数据
  objCache: Map<number, Map<string, any>>;//已经转换数据
  names: Array<string>;//字段名称
  types: Map<string, string>;//字段类型
  name: string;//表名称

  /**
   * 构造函数
   */
  constructor(name: string) {
    this.cnindexs = new Map<any, Map<any, Array<Map<string, any>>>>();
    this.keyIndexs = new Map<any, Array<any>>();
    this.rows = new Array<Map<string, string>>();
    this.objCache = new Map<number, Map<string, any>>();
    this.names = new Array<string>();
    this.types = new Map<string, string>();
    this.name = name;
  }

  /**
   * init
   * @param source 
   */
  init(source: string): void {
    let tmprs = source.split(/\r\n|\r|\n/);
    let tmpcs;
    let ttpyes;
    let ri = 0, i;
    //如果有列名则先处理列名
    if (tmprs.length > ri) {
      ttpyes = tmprs[ri].split("\t");
      ri++
      tmpcs = tmprs[ri].split("\t");
      for (i = 0; i < tmpcs.length; i++) {
        this.names.push(this.decode(tmpcs[i]));
        this.types[this.names[i]] = ttpyes[i];
      }
    }
    ri++;
    //处理行数据
    while (tmprs.length > ri) {
      if (tmprs[ri] == "") break;
      tmpcs = tmprs[ri].split("\t");
      let row: Map<string, string> = new Map<string, string>();
      for (i = 0; i < tmpcs.length; i++) {
        row.set(this.names[i], this.decode(tmpcs[i]));
      }
      this.rows.push(row);
      ri++;
    }
  }
  /**
   * 类型转换  int;float;string;int[];float[];string[]
   * @param key 
   * @param value 
   * @returns 
   */
  convert(key: string, value: string): any {
    let cls = this.types[key];
    if (cls == null) return value;
    let i = 0;
    let tmps: string[] = null;
    if (cls == "bool") {
      if(value=="true" || value=="TRUE"||  parseInt(value) ==1){
        return true;
      }
      else return false
    }
    if (cls == "string") {
      return value;
    }
    if (cls == "float") {
      return parseFloat(value);
    }
    if (cls == "int") {
      return parseInt(value);
    }
    if (cls == "int[]") {
      if (value == "") {
        return [];
      } else {
        tmps = value.split(",");
        let rs: number[] = [];
        for (i = 0; i < tmps.length; i++) {
          rs[i] = parseInt(tmps[i]);
        }
        return rs;
      }
    }
    if (cls == "float[]") {
      if (value == "") {
        return [];
      } else {
        tmps = value.split(",");
        let rs: number[] = [];
        for (i = 0; i < tmps.length; i++) {
          rs[i] = parseFloat(tmps[i]);
        }
        return rs;
      }
    }
    if (cls == "string[]") {
      if (value == "") {
        return [];
      } else {
        tmps = value.split(",");
        return tmps;
      }
    }
    // if (cls.indexOf("int") !== -1) {
    //     return parseInt(value);
    // }
    return value;
  };
  /**
   * convert to Obj row
   * @param row 
   * @returns 
   */
  convertToObjRow(row: Map<string, string>): Map<string, any> {
    let orow: Map<string, any> = new Map<string, any>();
    for (let key of row.keys()) {
      let value: string = row.get(key);
      orow.set(key, this.convert(key, value));
    }
    return orow;
  }

  /**
  * 返回配置表的数据行数(不包括列名称的行)
  * @return
  */
  getRowCount(): number {
    let result = this.rows.length;
    return result;
  }
  /**
   * 
   * @param cname 
   * @returns 
   */
  getKeysByIndex(cname: any): Array<any> {
    if (this.keyIndexs.has(cname) == false) {
      this.addIndex(cname);
    }
    if (this.keyIndexs.has(cname) == false) return null;

    let tmpArr = this.keyIndexs.get(cname);
    let result = [];
    if (tmpArr && tmpArr.length > 0) {
      result = tmpArr.concat();
    }
    return result;
  }
  /**
  * 获取指定行指定列的值
  * @param   index       行序号
  * @param   colName     列名称
       * @return
       */
  getValue(index: number, colName: string): any {
    let row = this.getRow(index);
    if (row == null) return null;
    return row.get(colName);
  }
  /**
  * 获取指定行
  * @param   index
  * @return
  */
  getRow(index: number): Map<string, any> {
    if (this.objCache.has(index) == false) {
      if (index < 0 || index >= this.rows.length) {
        console.log("getRow获取配置表 数据为null" + index);
        return null;
      }
      let row = this.rows[index];
      if (row == null) {
        console.log("getRow获取配置表 数据为null" + index);
        return null;
      }
      //构造对象
      this.objCache.set(index, this.convertToObjRow(row));
    }
    return this.objCache.get(index);
  }
  /**
  * 获取cname指定列值为value行的tarName列的值
  * @param   cname
  * @param   value
  * @param   tarName
  * @return
  */
  getValueByIndex(cname: string, value: any, tarName: string): any {
    let r = this.getRowByIndex(cname, value);
    if (r == null) {
      console.error("getValueByIndex获取配置表 数据为null" + this.name + ":" + cname + ":" + value + ":" + tarName);
      return null;
    }
    if (r.has(tarName)) {
      return r.get(tarName);
    }
    return null;
  }
  /**
  * 搜索指定列值为value的第一行
  * @param   cname   列名称
  * @param   value   要搜索的值
  * @return
  */
  getRowByIndex(cname: string, value: any): Map<string, any> {
    let rs = this.getRowsByIndex(cname, value);
    if (rs == null) {
      // cc.log("getRowByIndex获取配置表 数据为null " + this.name + ":" + cname + ":" + value);
      return null;
    }
    return rs[0];
  }
  /**
  * 搜索指定列值为value的行列表
  * @param   cname   列名称
  * @param   value   要搜索的值
  * @return  返回null表示没有搜索到
  */
  getRowsByIndex(cname: string, value: any): Array<Map<string, any>> | null {
    if (this.cnindexs.has(cname) == false) {
      this.addIndex(cname);
    }
    let tmpMap = this.cnindexs.get(cname);
    if (tmpMap && tmpMap.has(value)) {
      return tmpMap.get(value);
    }
    return null;
  }
  /**
  * 按列名称添加索引
  * @param   name
  */
  addIndex(name: string) {
    let index: Map<any, Array<Map<string, any>>> = new Map<any, Array<Map<string, any>>>();
    let keys: Array<any> = [];
    for (let i = 0; i < this.rows.length; i++) {
      let row = this.rows[i];//id => 1
      let tmpObj = this.convertToObjRow(row);//转化数据
      // CLog.debug(tmpObj);

      let key = tmpObj.get(name);//row.get(name) 对应值
      let okey = null;
      if (index.has(key) == false) {
        index.set(key, new Array<Map<string, any>>());
        keys.push(key);
      }
      let tmpArr = index.get(key);
      tmpArr.push(tmpObj);
    }
    this.cnindexs.set(name, index);
    this.keyIndexs.set(name, keys);
  }
  /**
   * 所有数据
   * @returns 
   */
  public getRawRows(): Array<Map<string, string>> {
    return this.rows;
  }

  /**
   * 获取所有处理过的数据
   */
  public getRows(): Array<Map<string, any>> {
    let result = [];
    for (let i = 0; i < this.rows.length; i++) {
      result.push(this.getRow(i));
    }
    return result;
  }

  /**
   * encode
   * @param str 
   * @returns 
   */
  encode(str: string): string {
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/\r\n/g, "&rn;");
    str = str.replace(/\n/g, "&n;");
    str = str.replace(/\r/g, "&r;");
    str = str.replace(/\t/g, "&t;");
    return str;
  }
  /**
   * decode
   * @param str 
   * @returns 
   */
  decode(str: string): string {
    str = str.replace(/&t;/g, "\t");
    str = str.replace(/&r;/g, "\r");
    str = str.replace("&n;", "\n");
    str = str.replace("&rn;", "\r\n");
    str = str.replace("&amp;", "&");
    return str;
  }

}
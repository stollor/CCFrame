export{}
declare global {
  interface Array<T>  {
    checkChildArray():boolean;
    intersperse(mkT: (ix: number) => T): T[];
  }
}

if (!Array.prototype.intersperse) {
  Array.prototype.intersperse = function intersperse<T>(this: T[], mkT: (ix: number) => T): T[] {
    return this.reduce((acc: T[], d, ix) => [...acc, mkT(ix), d], []).slice(1);
  };
}

if(!Array.prototype.checkChildArray){
    Array.prototype.checkChildArray= function():boolean{
        return this.some(item => item instanceof Array);
    }
}
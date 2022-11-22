export { }
declare global {
	interface Array<T> {
		/**
		* 检查是否(至少一个)为双层数组 [[]]
		*/
		checkChildArray(): boolean;

		/**
		 * 
		 * @param mkT 
		 */
		intersperse(mkT: (ix: number) => T): T[];
	}
}

if (!Array.prototype.intersperse) {
	Array.prototype.intersperse = function intersperse<T>(this: T[], mkT: (ix: number) => T): T[] {
		return this.reduce((acc: T[], d, ix) => [...acc, mkT(ix), d], []).slice(1);
	};
}

if (!Array.prototype.checkChildArray) {

	Array.prototype.checkChildArray = function (): boolean {
		return this.some(item => item instanceof Array);
	}
}



//return this.reduce((acc: T[], d, ix) => [...acc, mkT(ix), d], []).slice(1);
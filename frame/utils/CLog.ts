import { DEBUG } from "cc/env";
import { ColorType } from "../CEnum";


export class CLog {

	static getColor(index: number) {
		return ColorType[index % Object.keys(ColorType).length];
	}

	static getRandomColor() {
		return this.getColor[~~(Object.keys(ColorType).length * Math.random())];
	}

	static logList(list: any[], log: boolean = DEBUG) {
		if (!log) return;
		let color = this.getRandomColor();
		for (let i = 0; i < list.length; i++) {
			console.log(`%c${list[i]}`, `color:${ColorType.黑};background:${color}`);
		}
	}

	static log(msg, color = ColorType.绿, log: boolean = DEBUG) {
		if (!log) return;
		console.log(`%c${msg}`, `color:${ColorType.黑};background:${color}`)
	}

	static err(msg, log: boolean = DEBUG) {
		if (!log) return;
		console.log(`%c${msg}`, `color:${ColorType.白};background:${ColorType.红}`);
	}
}
import { clsx, } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export function range(s, e) {
	let l = []
	for (let v = s; v <= e; v++) {
		l.push(v)
	}
	return l
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
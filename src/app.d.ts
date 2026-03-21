declare global {
	namespace App {
		interface Locals {
			token?: string;
		}
	}
}

declare module "jsonwebtoken";

export {};

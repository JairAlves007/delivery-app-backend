export class InvalidCredentials extends Error {
	constructor() {
		super("Invalid credentials provided");
		this.name = "Invalid Credentials";
	}
}

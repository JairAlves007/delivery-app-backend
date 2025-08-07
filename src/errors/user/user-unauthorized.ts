export class UserUnauthorized extends Error {
	constructor() {
		super("User is unauthorized to perform this action");
		this.name = "Unauthorized";
	}
}

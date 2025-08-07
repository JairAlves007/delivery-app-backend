export class UserUnauthenticated extends Error {
	constructor() {
		super("User is not authenticated");
		this.name = "Unauthenticated";
	}
}

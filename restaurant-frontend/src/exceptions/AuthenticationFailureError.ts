export class AuthenticationFailureError extends Error {
	constructor(message) {
		super(message); 
		this.name = "ValidationError";
	}
}

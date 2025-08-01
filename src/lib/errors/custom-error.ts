export abstract class CustomError extends Error {
	constructor(message: string) {
		super(message);

		// Restore prototype chain for instanceof checks
		Object.setPrototypeOf(this, CustomError.prototype);
	}

	abstract statusCode: number;
	abstract serializeErrors: () => {
		field: string | null;
		message: string;
	}[];
}

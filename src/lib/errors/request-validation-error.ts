import { CustomError } from "./custom-error";

interface ZodTreeifiedError {
	properties?: Record<string, { errors: string[] }>;
}

export class RequestValidationError extends CustomError {
	constructor(public errors: ZodTreeifiedError) {
		super("پارامترهای درخواست نامعتبر هستند!");
		this.errors = errors;

		Object.setPrototypeOf(this, RequestValidationError.prototype);
	}

	statusCode = 400;
	serializeErrors = () => {
		const fieldErrors = Object.entries(this.errors.properties ?? {}).flatMap(
			([field, details]) =>
				details.errors.map((msg) => ({
					field,
					message: msg,
				})),
		);

		return fieldErrors;
	};
}

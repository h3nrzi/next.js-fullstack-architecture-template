import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
	constructor(public override message: string) {
		super(message);

		Object.setPrototypeOf(this, BadRequestError.prototype);
	}

	statusCode = 400;
	serializeErrors = () => [
		{
			field: null,
			message: this.message,
		},
	];
}

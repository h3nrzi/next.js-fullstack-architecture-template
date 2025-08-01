import { CustomError } from "./custom-error";

export class UnprocessableEntityError extends CustomError {
	constructor(public override message: string) {
		super(message);

		Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
	}

	statusCode = 422;
	serializeErrors = () => [
		{
			field: null,
			message: this.message,
		},
	];
}

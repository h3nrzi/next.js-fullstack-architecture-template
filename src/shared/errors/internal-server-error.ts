import { CustomError } from "./custom-error";

export class InternalServerError extends CustomError {
	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, InternalServerError.prototype);
	}

	statusCode = 500;
	serializeErrors = () => {
		return [
			{
				field: null,
				message: this.message,
			},
		];
	};
}

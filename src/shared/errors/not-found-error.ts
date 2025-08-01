import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, NotFoundError.prototype);
	}

	statusCode = 404;
	serializeErrors = () => {
		return [
			{
				field: null,
				message: this.message,
			},
		];
	};
}

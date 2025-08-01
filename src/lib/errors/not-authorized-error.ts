import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, NotAuthorizedError.prototype);
	}

	statusCode = 401;
	serializeErrors = () => {
		return [
			{
				field: null,
				message: this.message,
			},
		];
	};
}

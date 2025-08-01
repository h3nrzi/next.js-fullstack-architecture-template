import { CustomError } from "./custom-error";

export class ForbiddenError extends CustomError {
	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, ForbiddenError.prototype);
	}

	statusCode = 403;
	serializeErrors = () => {
		return [
			{
				field: null,
				message: this.message,
			},
		];
	};
}

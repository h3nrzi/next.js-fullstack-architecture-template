export interface ServerErrorResponse<T> {
	status: "fail";
	errors: T[];
}

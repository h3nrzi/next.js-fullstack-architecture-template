import { ServerErrorResponse } from "./ServerErrorResponse";

export interface RTKQueryErrorResponse {
	status: number;
	data: ServerErrorResponse<Error>;
}

export interface ApiResponse<T = any> {
	status: "success" | "fail";
	data?: T;
	errors?: Array<{ field: string | null; message: string }>;
}

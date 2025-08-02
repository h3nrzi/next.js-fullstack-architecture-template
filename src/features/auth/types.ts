export interface User {
	id: string;
	name: string;
	email: string;
}

export interface AuthPayload {
	user: User;
	accessToken: string;
	refreshToken: string;
}

// API Response types
export interface ApiResponse<T = any> {
	status: "success" | "fail";
	data?: T;
	errors?: Array<{ field: string | null; message: string }>;
}

export interface CurrentUserResponse {
	user: User;
}

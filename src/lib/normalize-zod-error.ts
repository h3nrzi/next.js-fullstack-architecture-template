type ZodTreeifiedError = {
	properties?: Record<string, { errors: string[] }>;
};

type NormalizedErrorResponse = {
	errors: {
		field: string;
		message: string;
	}[];
};

export function normalizeZodError(input: ZodTreeifiedError): NormalizedErrorResponse {
	const fieldErrors = Object.entries(input.properties ?? {}).flatMap(([field, details]) =>
		details.errors.map((msg) => ({
			field,
			message: msg,
		})),
	);

	return { errors: fieldErrors };
}

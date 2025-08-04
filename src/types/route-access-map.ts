import { AccessLevel } from "./access-level";

export type RouteAccessMap = {
	api: Record<AccessLevel, string[]>;
	page: Record<AccessLevel, string[]>;
};

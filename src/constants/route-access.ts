import { RouteAccessMap } from "@/types/route-access-map";

export const routeAccess: RouteAccessMap = {
	api: {
		public: ["/api/auth"],
		protected: ["/api/users"],
		admin: ["/api/admin"],
	},
	page: {
		public: ["/auth/login", "/auth/register"],
		protected: ["/dashboard", "/profile"],
		admin: ["/dashboard/admin"],
	},
};

import { forbidden } from "next/navigation";

export default async function ForbiddenPage() {
	forbidden();
	return <div>Forbidden</div>;
}

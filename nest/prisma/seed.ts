import { PrismaClient, Role, Action, App } from "@prisma/client";
import { actions } from "./seed-data/actions";
import { roles } from "./seed-data/roles";
import { apps } from "./seed-data/apps";

const prisma = new PrismaClient();

const seedApps = async () => {
	return await prisma.app.createManyAndReturn({
		data: [...apps],
	});
};

const seedActions = async () => {
	return await prisma.action.createManyAndReturn({
		data: [...actions],
	});
};

const seedRoles = async (apps: App[]) => {
	const appRoles = roles
		.flatMap(({ name, app: appName }) => {
			const app = apps.find((app) => app.name === appName);

			if (!app) return;

			return { name, appId: app.id };
		})
		.filter((appRole) => appRole !== undefined);

	return await prisma.role.createManyAndReturn({
		data: [...appRoles],
	});
};

const seedRoleActions = async (roles: Role[], actions: Action[]) => {
	const roleActions = roles.flatMap(({ id: roleId }) => {
		return actions.map(({ id: actionId }) => ({
			roleId: roleId,
			actionId: actionId,
		}));
	});

	return await prisma.roleAction.createManyAndReturn({
		data: [...roleActions],
	});
};

async function main() {
	const createdApps = await seedApps();
	const createdActions = await seedActions();
	const createdRoles = await seedRoles(createdApps);
	await seedRoleActions(createdRoles, createdActions);

	console.log("Seeding done");
}

main()
	.catch((e) => {
		console.log(e);
		process.exit(1);
	})
	.finally(() => {
		void prisma.$disconnect();
	});

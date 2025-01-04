type Role = 'user' | 'admin' | 'manager'; // New role
type Permission = 'getUsers' | 'manageUsers' | 'viewDashboard'; // New permission

const allRoles: Record<Role, Permission[]> = {
  user: [],
  admin: ['getUsers', 'manageUsers'],
  manager: ['getUsers', 'viewDashboard'], // Manager role with specific permissions
};


// Get the list of roles as an array of strings
const roles: string[] = Object.keys(allRoles);

// Create a Map for quick lookups of role permissions
const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));

// Export roles and roleRights
export {
  roles,
  roleRights,
};

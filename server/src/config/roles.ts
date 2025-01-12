type Role = 'user' | 'admin' | 'super_admin';

// Define all possible permissions in the system
type Permission = 
  // Super Admin Permissions
  | 'manage_admins'           // Create, update, delete admins
  | 'view_all_admins'        
  | 'activate_admin'          // Activate admin accounts
  | 'deactivate_admin'        // Deactivate admin accounts
  | 'view_admin_stats'        // View statistics about admin performance
  | 'manage_platform_settings'
  
  // Admin Permissions
  | 'create_ground'           // Create new grounds
  | 'update_own_ground'       // Update their own grounds
  | 'delete_own_ground'       // Delete their own grounds
  | 'view_own_grounds'        // View their grounds
  | 'manage_own_bookings'     // Manage bookings for their grounds
  | 'approve_booking'         // Approve user bookings
  | 'deny_booking'           // Deny user bookings
  | 'view_own_earnings'      // View their earnings
  | 'manage_ground_slots'    // Manage time slots for grounds
  
  // User Permissions
  | 'view_available_grounds' // View all available grounds
  | 'create_booking'        // Create new bookings
  | 'view_own_bookings'     // View their own bookings
  | 'cancel_own_booking'    // Cancel their own bookings
  | 'update_profile'        // Update their own profile
  | 'view_booking_history'; // View their booking history

// Define all permissions array
const allPermissions: Permission[] = [
  // Super Admin
  'manage_admins',
  'view_all_admins',
  'activate_admin',
  'deactivate_admin',
  'view_admin_stats',
  'manage_platform_settings',
  
  // Admin
  'create_ground',
  'update_own_ground',
  'delete_own_ground',
  'view_own_grounds',
  'manage_own_bookings',
  'approve_booking',
  'deny_booking',
  'view_own_earnings',
  'manage_ground_slots',
  
  // User
  'view_available_grounds',
  'create_booking',
  'view_own_bookings',
  'cancel_own_booking',
  'update_profile',
  'view_booking_history'
];

// Define role-based permissions
const allRoles: Record<Role, Permission[]> = {
  // Regular users can only manage their own bookings and view available grounds
  user: [
    'view_available_grounds',
    'create_booking',
    'view_own_bookings',
    'cancel_own_booking',
    'update_profile',
    'view_booking_history'
  ],
  
  // Admins can manage their own grounds and related bookings
  admin: [
    'create_ground',
    'update_own_ground',
    'delete_own_ground',
    'view_own_grounds',
    'manage_own_bookings',
    'approve_booking',
    'deny_booking',
    'view_own_earnings',
    'manage_ground_slots',
    'update_profile',
    // Include user permissions for admin's personal use
    'view_available_grounds',
    'create_booking',
    'view_own_bookings',
    'cancel_own_booking',
    'view_booking_history'
  ],
  
  // Super admins can manage admins but not interfere with grounds/bookings
  super_admin: [
    'manage_admins',
    'view_all_admins',
    'activate_admin',
    'deactivate_admin',
    'view_admin_stats',
    'manage_platform_settings',
    // Include basic user permissions for super admin's personal use
    'view_available_grounds',
    'create_booking',
    'view_own_bookings',
    'cancel_own_booking',
    'update_profile',
    'view_booking_history'
  ]
};

// Get the list of roles
const roles: Role[] = Object.keys(allRoles) as Role[];

// Create a Map for quick permission lookups
const roleRights: Map<Role, Permission[]> = new Map(Object.entries(allRoles) as [Role, Permission[]][]);

// Helper functions for permission checking
const hasPermission = (role: Role, permission: Permission): boolean => {
  return roleRights.get(role)?.includes(permission) ?? false;
};

// Function to check if user can perform action on a resource
const canAccess = (
  userRole: Role,
  permission: Permission,
  userId?: number,
  resourceOwnerId?: number
): boolean => {
  const hasRight = hasPermission(userRole, permission);
  
  // If user has no basic permission, return false
  if (!hasRight) return false;
  
  // For own resource checks
  if (permission.includes('own_') && userId && resourceOwnerId) {
    return userId === resourceOwnerId;
  }
  
  return true;
};

export {
  type Role,
  type Permission,
  roles,
  roleRights,
  hasPermission,
  canAccess,
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAccess = exports.hasPermission = exports.roleRights = exports.roles = void 0;
// Define all permissions array
const allPermissions = [
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
const allRoles = {
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
const roles = Object.keys(allRoles);
exports.roles = roles;
// Create a Map for quick permission lookups
const roleRights = new Map(Object.entries(allRoles));
exports.roleRights = roleRights;
// Helper functions for permission checking
const hasPermission = (role, permission) => {
    return roleRights.get(role)?.includes(permission) ?? false;
};
exports.hasPermission = hasPermission;
// Function to check if user can perform action on a resource
const canAccess = (userRole, permission, userId, resourceOwnerId) => {
    const hasRight = hasPermission(userRole, permission);
    // If user has no basic permission, return false
    if (!hasRight)
        return false;
    // For own resource checks
    if (permission.includes('own_') && userId && resourceOwnerId) {
        return userId === resourceOwnerId;
    }
    return true;
};
exports.canAccess = canAccess;

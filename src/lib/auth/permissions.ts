// src/lib/auth/permissions.ts
import { Role, OrgRole } from "@prisma/client";

type Permission = 
  | "create:task"
  | "read:task"
  | "update:task"
  | "delete:task"
  | "manage:users"
  | "manage:team"
  | "view:analytics"
  | "manage:billing"
  | "manage:settings";

const rolePermissions: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: [
    "create:task",
    "read:task",
    "update:task",
    "delete:task",
    "manage:users",
    "manage:team",
    "view:analytics",
    "manage:billing",
    "manage:settings",
  ],
  [Role.ADMIN]: [
    "create:task",
    "read:task",
    "update:task",
    "delete:task",
    "manage:team",
    "view:analytics",
    "manage:settings",
  ],
  [Role.MANAGER]: [
    "create:task",
    "read:task",
    "update:task",
    "manage:team",
    "view:analytics",
  ],
  [Role.USER]: [
    "create:task",
    "read:task",
    "update:task",
  ],
};

export function hasPermission(
  userRole: Role,
  permission: Permission
): boolean {
  return rolePermissions[userRole]?.includes(permission) ?? false;
}

export function canManageTask(
  userRole: Role,
  taskCreatorId: string,
  currentUserId: string,
  orgRole?: OrgRole
): boolean {
  // Admins can manage all tasks
  if ([Role.SUPER_ADMIN, Role.ADMIN].includes(userRole)) {
    return true;
  }
  
  // Managers can manage tasks in their org
  if (userRole === Role.MANAGER && orgRole === "ADMIN") {
    return true;
  }
  
  // Users can only manage their own tasks
  return taskCreatorId === currentUserId;
}
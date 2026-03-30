// src/hooks/usePermissions.ts
import { useSession } from "next-auth/react";
import { Role, OrgRole } from "@prisma/client";
import { hasPermission, canManageTask } from "@/lib/auth/permissions";

export function usePermissions() {
  const { data: session } = useSession();
  
  const userRole = session?.user?.role ?? Role.USER;
  const orgRole = session?.user?.orgRole;
  const userId = session?.user?.id;
  
  return {
    can: (permission: Parameters<typeof hasPermission>[1]) => 
      hasPermission(userRole, permission),
    
    canManageTask: (taskCreatorId: string) => 
      canManageTask(userRole, taskCreatorId, userId!, orgRole),
    
    isAdmin: [Role.SUPER_ADMIN, Role.ADMIN].includes(userRole),
    isManager: userRole === Role.MANAGER,
    isOwner: orgRole === "OWNER",
  };
}
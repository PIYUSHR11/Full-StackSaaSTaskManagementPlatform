// src/types/next-auth.d.ts
import { Role, OrgRole } from "@prisma/client";
import "@auth/core/adapters"
import "next-auth";

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: Role
    organizationId?: string
    orgRole?: OrgRole
  }
}

declare module "next-auth" {
  interface User {
    id: string;
    role: Role;
    organizationId?: string;
    orgRole?: OrgRole;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: Role;
      organizationId?: string;
      orgRole?: OrgRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    organizationId?: string;
    orgRole?: OrgRole;
  }
}
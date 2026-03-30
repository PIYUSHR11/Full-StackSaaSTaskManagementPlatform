// tests/unit/lib/auth/permissions.test.ts
import { hasPermission, canManageTask } from "@/lib/auth/permissions";
import { Role, OrgRole } from "@prisma/client";

describe("Permissions", () => {
  describe("hasPermission", () => {
    it("should allow SUPER_ADMIN to manage billing", () => {
      expect(hasPermission(Role.SUPER_ADMIN, "manage:billing")).toBe(true);
    });

    it("should not allow USER to manage team", () => {
      expect(hasPermission(Role.USER, "manage:team")).toBe(false);
    });
  });

  describe("canManageTask", () => {
    it("should allow ADMIN to manage any task", () => {
      expect(canManageTask(Role.ADMIN, "user1", "user2")).toBe(true);
    });

    it("should allow user to manage their own task", () => {
      expect(canManageTask(Role.USER, "user1", "user1")).toBe(true);
    });

    it("should not allow user to manage others' tasks", () => {
      expect(canManageTask(Role.USER, "user1", "user2")).toBe(false);
    });
  });
});
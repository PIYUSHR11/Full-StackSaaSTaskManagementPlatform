// tests/integration/tasks/create-task.test.ts
import { prisma } from "@/lib/db/prisma";
import { createTask } from "@/app/(dashboard)/tasks/actions";
import { Role } from "@prisma/client";

// Mock session
jest.mock("@/lib/auth/guards", () => ({
  requireAuth: jest.fn().mockResolvedValue({
    user: {
      id: "test-user-id",
      role: Role.USER,
      organizationId: "test-org-id",
    },
  }),
}));

describe("Create Task", () => {
  beforeEach(async () => {
    // Setup test data
    await prisma.organization.create({
      data: {
        id: "test-org-id",
        name: "Test Org",
        slug: "test-org",
        subscription: {
          create: {
            plan: "PRO",
          },
        },
      },
    });
  });

  afterEach(async () => {
    // Cleanup
    await prisma.task.deleteMany();
    await prisma.organization.deleteMany();
  });

  it("should create a task successfully", async () => {
    const formData = new FormData();
    formData.append("title", "Test Task");
    formData.append("description", "Test Description");
    formData.append("priority", "HIGH");

    const result = await createTask(formData);

    expect(result.success).toBe(true);
    expect(result.task).toHaveProperty("title", "Test Task");

    const task = await prisma.task.findFirst({
      where: { title: "Test Task" },
    });
    expect(task).toBeTruthy();
  });

  it("should fail validation with invalid data", async () => {
    const formData = new FormData();
    formData.append("title", ""); // Empty title

    const result = await createTask(formData);

    expect(result.error).toBeDefined();
  });
});
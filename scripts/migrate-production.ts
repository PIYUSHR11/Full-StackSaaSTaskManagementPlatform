// scripts/migrate-production.ts
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function runProductionMigration() {
  console.log("🚀 Starting production migration...");
  
  try {
    // Create backup
    console.log("📦 Creating database backup...");
    await execAsync("pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql");
    
    // Run migrations
    console.log("🔄 Running database migrations...");
    await execAsync("npx prisma migrate deploy");
    
    // Generate Prisma client
    console.log("🔧 Generating Prisma client...");
    await execAsync("npx prisma generate");
    
    // Run seed script if needed
    if (process.env.RUN_SEED === "true") {
      console.log("🌱 Running seed script...");
      await execAsync("npx prisma db seed");
    }
    
    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runProductionMigration();
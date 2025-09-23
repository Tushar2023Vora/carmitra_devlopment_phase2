import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js", 
  out: "./drizzle", // Where migration files will be stored
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_Eh7uCAKHqpx1@ep-flat-glitter-a1asuchm-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
  },
});

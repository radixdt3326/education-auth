import cron from "node-cron";
import { removeExpiredSession } from "../utils/common";
import pool from "../Db_connection/dbConfig";

cron.schedule("0 9,21 * * *", async () => {
  console.log("⏳ Running scheduled database query...");
  try {
    await removeExpiredSession(pool);
    const result = await pool.query("SELECT * FROM user_table");
    console.log("✅ Expired sessions removed successfully:", result.rows);
  } catch (err) {
    console.error("❌ Error while removing expired sessions:", err.message);
  }
});

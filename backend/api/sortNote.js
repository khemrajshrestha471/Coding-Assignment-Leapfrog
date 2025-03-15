const express = require("express");
// const pool = require("../../database/db");
const pool = require('/app/database/db');

const router = express.Router();

router.get("/sort-notes/:user_id", async (req, res) => {
    try {
      const { user_id } = req.params;
      const { sortBy } = req.query;
  
      // Validate user_id
      if (!user_id) {
        return res.status(400).json({ error: "user_id is required" });
      }
  
      // Define the sorting logic
      let orderBy = "created_at DESC"; // Default sorting by creation date
      if (sortBy === "updated_at") {
        orderBy = "updated_at DESC";
      } else if (sortBy === "title") {
        orderBy = "title ASC";
      }
  
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
  
      // Fetch notes from PostgreSQL with sorting
      const result = await pool.query(
        `SELECT * FROM Notes WHERE user_id = $1 ORDER BY ${orderBy} LIMIT $2 OFFSET $3`,
        [user_id, limit, offset]
      );
  
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  module.exports = router;
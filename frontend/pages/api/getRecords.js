// frontend/pages/api/getRecords.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join } from 'path';

const dbPath = join(process.cwd(), '..', 'backend', 'viewlog.db');
const db = new sqlite3.Database(dbPath);

const getRecords = async (req, res) => {
  if (req.method === 'GET') {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    const user_id = req.user?.id || 1;  // Ensure correctly setting req.user

    db.all(`SELECT Records.id, Media.title, Media.country_code, Media.year, Records.timestamp, Records.status
            FROM Records
            JOIN Media ON Records.media_id = Media.id
            WHERE Records.user_id = ?`, [user_id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
export default getRecords;
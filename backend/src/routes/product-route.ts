import express from 'express';
import connection from '../modules/db';
const router = express.Router();

router.get('/', async function(req, res) {
  const page = req.query.page as { number: string | null, size: string | null, }; // number = 2, size = 5 => 5, 5 gives row 6 - 10
  const offset = parseInt(page?.size || '100') * (parseInt(page?.number || '1') - 1);
  const sql = 'SELECT * FROM products LIMIT ?, ?';
  const data = await connection.execute(sql, [offset, page?.size ?? '100']);
  res.json({ data: data[0] });
});

router.get('/:id', async function(req, res) {
  const sql = 'SELECT * FROM products WHERE id = ?';
  const data = await connection.execute(sql, [ req.params.id ]);
  res.json({ data: data[0] });
});

export default router;

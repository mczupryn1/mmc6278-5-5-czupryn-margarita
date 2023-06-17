const router = require('express').Router()
const db = require('./db')

router
  .route('/inventory')
  .get(async (req, res) => {
    const [inventoryItems] = await db.query(`SELECT * FROM inventory`);
    res.json(inventoryItems);
  })
  .post(async (req, res) => {
    const { name, image, description, price, quantity } = req.body;
    await db.query(
      `INSERT INTO inventory(name, image, description, price, quantity) VALUES (?,?,?,?,?)`,
      [name, image, description, price, quantity]
    );
    res.status(204).end();
  });

router
  .route('/inventory/:id')
  .get(async (req, res) => {
    const [[item]] = await db.query(`SELECT * FROM inventory WHERE id = ?`, [req.params.id]);
    if (!item) {
      return res.status(404).send('Item not found');
    }
    res.json(item);
  })
  .put(async (req, res) => {
    const { name, image, description, price, quantity } = req.body;
    const [result] = await db.query(
      `UPDATE inventory SET name=?, image=?, description=?, price=?, quantity=? WHERE id=?`,
      [name, image, description, price, quantity, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send('No item found to update');
    }
    res.status(204).end();
  })
  .delete(async (req, res) => {
    const [result] = await db.query(`DELETE FROM inventory WHERE id = ?`, [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('No item found to delete');
    }
    res.status(204).end();
  });

// Other routes...

module.exports = router;

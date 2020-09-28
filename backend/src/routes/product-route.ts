import express from 'express';
import { getProductById, getProductsByPage } from '../controllers/product-controller';
const router = express.Router();

const type = 'products';

router.get('/', async function(_, res, next) {
  const { offset, size } = res.locals;
  const rows = await getProductsByPage({ offset, size });

  res.locals = {
    ...res.locals,
    rows,
    type,
  };

  next();
});

router.get('/:id', async function(req, res, next) {
  const rows = await getProductById({ id: req.params.id });
  const isSingleObject = true;

  res.locals = {
    ...res.locals,
    rows,
    type,
    isSingleObject,
  };

  next();
});

export default router;

import express from 'express';
import productRoute from './routes/product-route';
import userRoute from './routes/user-route';
const router = express.Router();
const app = express();

const PAGE_NUMBER = 1;
const PAGE_SIZE = 20;

// TODO: implement Authorization method (probably using JWT)
// EDIT: should be moved to [AUTH SERVICE]
app.use(function(req, res, next) {
  if(!req.headers.authorization) {
    res.status(400).json({ error: {} });
    return;
  }

  const page = req.query.page as { number: string, size: string, }; // number = 2, size = 5 => (5, 5) gives row 6 - 10
  const number = parseInt(page?.number) || PAGE_NUMBER;
  const size = parseInt(page?.size) || PAGE_SIZE;
  const offset = size * (number - 1);

  res.locals = {
    ...res.locals,
    number,
    size,
    offset
  };
  
  next();
});

router.use('/products', productRoute);
router.use('/users', userRoute);

app.use('/api', router);

app.use(function(_, res) {
  const { rows, type, isSingleObject } = res.locals;

  res.json({
    data: jsonApize({ rows, type, isSingleObject }),
  });
});

function jsonApize({ rows, type, isSingleObject }: { rows: any[], type: any, isSingleObject: boolean }) {
  rows = rows.map((attributes: any) => {
    const id = attributes.id;
    delete attributes.id;

    return {
      id,
      type,
      attributes,
    };
  });

  if(isSingleObject)
    return rows[0];
  return rows;
}

app.listen(3000);

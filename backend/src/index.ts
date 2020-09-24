import express from 'express';
import productRoute from './routes/product-route';
import userRoute from './routes/user-route';
const router = express.Router();
const app = express();

// TODO: implement Authorization method (probably using JWT)
app.use(function(req, res, next) {
  if(!req.headers.authorization)
    res.status(400).json({ error: {} });
  next();
});

router.use('/products', productRoute);
router.use('/users', userRoute);

app.use('/api', router);

app.listen(3000);

import express from "express";
import productRoute from "./components/product/product-route";
import userRoute from "./components/user/user-route";

const router = express.Router();
const app = express();

const PAGE_NUMBER = 1;
const PAGE_SIZE = 20;

function jsonApize({
  rows,
  type,
  isSingleObject,
}: {
  rows: any[];
  type: any;
  isSingleObject: boolean;
}) {
  const result = rows.map((attributes: any) => {
    const { id, ...otherThanId } = attributes;

    return {
      id,
      type,
      attributes: { ...otherThanId },
    };
  });

  return isSingleObject ? result[0] : result;
}

// TODO: implement Authorization method (probably using JWT)
// EDIT: should be moved to [AUTH SERVICE]
app.use((req, res, next) => {
  // if(!req.headers.authorization) {
  //   res.status(400).json({ error: {} });
  //   return;
  // }

  const page = req.query.page as { number: string; size: string }; // number = 2, size = 5 => (5, 5) gives row 6 - 10
  const number = Number(page?.number) || PAGE_NUMBER;
  const size = Number(page?.size) || PAGE_SIZE;
  const offset = size * (number - 1);

  res.locals = {
    ...res.locals,
    number,
    size,
    offset,
  };

  next();
});

router.use("/products", productRoute);
router.use("/users", userRoute);

app.use("/api", router);

app.use((_, res) => {
  const { rows, type, isSingleObject } = res.locals;

  res.json({
    data: jsonApize({ rows, type, isSingleObject }),
  });
});

app.listen(3000);

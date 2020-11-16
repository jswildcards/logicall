import { Page as PageConfig } from "./config";

export interface IPage {
  offset: number;
  limit: number;
}

// number = 2, size = 5 => (5, 5) gives row 6 - 10
function paging(page: any) {
  const number = Number(page?.number) || PageConfig.number;
  const limit = Number(page?.size) || PageConfig.size;
  const offset = limit * (number - 1);

  return { offset, limit };
}

export { paging };
export default { paging };

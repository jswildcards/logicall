import { Page as PageConfig } from "./config";

export interface IPage {
  offset: number;
  size: number;
}

// number = 2, size = 5 => (5, 5) gives row 6 - 10
export function paging(page: any) {
  const number = Number(page?.number) || PageConfig.number;
  const size = Number(page?.size) || PageConfig.size;
  const offset = size * (number - 1);

  return { offset, size };
}

export default { paging };

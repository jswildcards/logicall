import { decode } from "./here-polyline";

export function mapStringToPolylines(raw: string) {
  return JSON.parse(raw).flatMap((polyline) => decode(polyline).polyline);
}

export default { mapStringToPolylines };

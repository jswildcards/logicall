import { decode } from "./here-polyline";

function paddingZero(raw: number) {
  return Math.floor(raw / 10) === 0 ? `0${raw}` : `${raw}`;
}

export function mapStringToPolylines(raw: string) {
  return JSON.parse(raw).flatMap((polyline) => decode(polyline).polyline);
}

export function mapSecondsToHoursFormat(raw: number) {
  return `${paddingZero(Math.floor(raw / 3600))}:${paddingZero(
    Math.floor((raw % 3600) / 60)
  )}:${paddingZero(raw % 60)}`;
}

export default { mapStringToPolylines };

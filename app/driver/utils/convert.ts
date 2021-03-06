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

export function mapStatusToColor(status: string) {
  const colors = {
    Pending: { backgroundColor: "#FEFCBF", color: "#744210" },
    Rejected: { backgroundColor: "#FED7D7", color: "#822727" },
    Cancelled: { backgroundColor: "#EDF2F7", color: "#1A202C" },
    Approved: { backgroundColor: "#B2F5EA", color: "#234E52" },
    Collecting: { backgroundColor: "#BEE3F8", color: "#2A4365" },
    Delivering: { backgroundColor: "#C4F1F9", color: "#086F83" },
    Delivered: { backgroundColor: "#C6F6D5", color: "#22543D" },
  };

  return colors[status];
}

export default { mapStatusToColor, mapStringToPolylines };

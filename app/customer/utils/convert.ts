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

export default { mapStatusToColor };

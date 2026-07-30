import { useEffect, useMemo, useState } from "react";
import {
  loadBlockNotifications,
  saveBlockNotifications
} from "../data/adminBlockNotifications";

const now = () => new Date().toLocaleString("en-IN", {
  day: "2-digit", month: "short", year: "numeric",
  hour: "2-digit", minute: "2-digit", hour12: false
});

export const addBlockNotification = (guest, booking) => {
  const notifications = loadBlockNotifications();
  const nextNotifications = [
    {
      id: `BLK-${Date.now()}`,
      bookingId: booking?.id || booking?._id || "",
      guestName: guest?.name || "Unknown",
      guestPhone: guest?.phone || booking?.guestPhone || "",
      branchName: booking?.branch?.name || booking?.branchName || "",
      bedLabel: booking?.bed?.label || booking?.bedLabel || "",
      roomLabel: booking?.room?.name || (booking?.roomNumber ? `Room ${booking.roomNumber}` : ""),
      blockedAt: now()
    },
    ...notifications
  ].slice(0, 40);
  saveBlockNotifications(nextNotifications);
};

export const useLiveBlockNotifications = () => {
  const [blockNotifications, setBlockNotifications] = useState(() => loadBlockNotifications());

  useEffect(() => {
    const refresh = () => setBlockNotifications(loadBlockNotifications());

    window.addEventListener("pg:block-notifications-updated", refresh);

    return () => {
      window.removeEventListener("pg:block-notifications-updated", refresh);
    };
  }, []);

  return useMemo(() => blockNotifications, [blockNotifications]);
};

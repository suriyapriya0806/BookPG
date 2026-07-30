export const BLOCK_NOTIFICATION_KEY = "pg_block_notifications";

export const loadBlockNotifications = () => {
  const stored = localStorage.getItem(BLOCK_NOTIFICATION_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveBlockNotifications = (notifications) => {
  localStorage.setItem(BLOCK_NOTIFICATION_KEY, JSON.stringify(notifications));
  window.dispatchEvent(new CustomEvent("pg:block-notifications-updated", { detail: { notifications } }));
};

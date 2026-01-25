import type { NotificationType } from "../enums/NotificationTypeEnum";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
  url?: string;
  data?: Record<string, string>;
}

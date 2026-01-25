export enum NotificationTypeEnum {
  POSITION_ASSIGNED = "POSITION_ASSIGNED",
  POSITION_REMOVED = "POSITION_REMOVED",
}

export type NotificationType = keyof typeof NotificationTypeEnum;

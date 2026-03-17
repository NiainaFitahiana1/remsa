import { DeliveryStatus, StatusConfig } from "../types";

export const STATUS_CONFIG: Record<DeliveryStatus, StatusConfig> = {
  PENDING: {
    label: "À accepter",
    icon: "pending",
    allowedNext: ["ACCEPTED"],
  },
  ACCEPTED: {
    label: "Acceptée",
    icon: "thumb_up",
    allowedNext: ["PICKED_UP"],
  },
  PICKED_UP: {
    label: "Ramassée",
    icon: "package",
    allowedNext: ["IN_PROGRESS"],
  },
  IN_PROGRESS: {
    label: "En cours",
    icon: "local_shipping",
    allowedNext: ["DELIVERED"],
  },
  DELIVERED: {
    label: "Livrée",
    icon: "check_circle",
    allowedNext: [],
  },
  CANCELLED: {
    label: "Annulée",
    icon: "cancel",
    allowedNext: [],
  },
};

export const STATUSES = Object.keys(STATUS_CONFIG) as DeliveryStatus[];
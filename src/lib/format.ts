import { bugFlags } from "@/config/bugFlags";

export const formatMoney = (amount: number, currency = "NZD"): string => {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency,
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (value: string | Date, position = 0): string => {
  const date = value instanceof Date ? value : new Date(value);

  if (bugFlags.inconsistentDates && position % 2 === 1) {
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-NZ", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
};

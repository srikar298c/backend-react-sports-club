export interface SlotData {
  startHour: number;
  endHour: number;
  price: number;
  duration: number;
  recurring?: boolean;
}

export interface RecurrenceData {
  frequency: string;
  interval: number;
  endDate?: Date;
}

export interface BlockedSlotData {
  groundId: number;
  date: Date;
  startHour: number;
  endHour: number;
  reason?: string;
}

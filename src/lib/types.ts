export interface Task {
  _id?: string;
  id: string;
  text: string;
  dateKey: string;
  order: number;
  createdAt: string;
  time?: string;
  isMeeting?: boolean;
  notes?: string;
  label?: TaskLabel;
  meetingLink?: string;
}

export type TaskLabel =
  | "work" | "personal" | "health" | "finance"
  | "social" | "creative" | "urgent" | "travel" | null;

export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
}

export interface DragData {
  dateKey: string;
  taskIndex: number;
}

export interface TasksByDate {
  [dateKey: string]: Task[];
}

export interface HolidaysByDate {
  [dateKey: string]: string[];
}

export interface Country {
  code: string;
  name: string;
}

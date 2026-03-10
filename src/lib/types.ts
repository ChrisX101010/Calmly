export interface Task {
  _id?: string;
  id: string;
  text: string;
  dateKey: string; // "YYYY-MM-DD"
  order: number;
  createdAt: string;
}

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

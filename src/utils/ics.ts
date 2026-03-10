import { Task, TasksByDate } from "@/lib/types";
import { uid } from "./calendar";

export function generateICS(tasks: TasksByDate): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Calmly Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  Object.entries(tasks).forEach(([dateKey, list]) => {
    list.forEach((task) => {
      const d = dateKey.replace(/-/g, "");
      lines.push("BEGIN:VEVENT");
      lines.push(`DTSTART;VALUE=DATE:${d}`);
      lines.push(`DTEND;VALUE=DATE:${d}`);
      lines.push(`SUMMARY:${task.text}`);
      lines.push(`UID:${task.id}@calmly`);
      lines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`);
      lines.push("END:VEVENT");
    });
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function parseICS(text: string): TasksByDate {
  const tasks: TasksByDate = {};
  const events = text.split("BEGIN:VEVENT");

  events.slice(1).forEach((ev) => {
    const summaryMatch = ev.match(/SUMMARY:(.*)/);
    const dtMatch = ev.match(/DTSTART[^:]*:(\d{4})(\d{2})(\d{2})/);
    if (summaryMatch && dtMatch) {
      const key = `${dtMatch[1]}-${dtMatch[2]}-${dtMatch[3]}`;
      if (!tasks[key]) tasks[key] = [];
      tasks[key].push({
        id: uid(),
        text: summaryMatch[1].trim(),
        dateKey: key,
        order: tasks[key].length,
        createdAt: new Date().toISOString(),
      });
    }
  });

  return tasks;
}

export function generateJSON(tasks: TasksByDate): string {
  return JSON.stringify(tasks, null, 2);
}

export function parseJSON(text: string): TasksByDate {
  try {
    const parsed = JSON.parse(text);
    // Ensure each task has required fields
    const result: TasksByDate = {};
    Object.entries(parsed).forEach(([key, list]) => {
      if (Array.isArray(list)) {
        result[key] = (list as Task[]).map((t, i) => ({
          id: t.id || uid(),
          text: t.text || "",
          dateKey: key,
          order: t.order ?? i,
          createdAt: t.createdAt || new Date().toISOString(),
        }));
      }
    });
    return result;
  } catch {
    return {};
  }
}

export function generateCSV(tasks: TasksByDate): string {
  let csv = "Date,Task,Order\n";
  Object.entries(tasks).forEach(([dateKey, list]) => {
    list.forEach((t) => {
      csv += `${dateKey},"${t.text.replace(/"/g, '""')}",${t.order}\n`;
    });
  });
  return csv;
}

export function parseCSV(text: string): TasksByDate {
  const tasks: TasksByDate = {};
  const lines = text.split("\n").slice(1); // skip header

  lines.forEach((line) => {
    const match = line.match(/^(\d{4}-\d{2}-\d{2}),"?(.*?)"?,?(\d*)$/);
    if (match) {
      const key = match[1];
      const taskText = match[2].replace(/""/g, '"');
      if (!tasks[key]) tasks[key] = [];
      tasks[key].push({
        id: uid(),
        text: taskText,
        dateKey: key,
        order: tasks[key].length,
        createdAt: new Date().toISOString(),
      });
    }
  });

  return tasks;
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  DAYS_OF_WEEK,
  MONTH_NAMES,
  getDaysInMonth,
  getFirstDayOfWeek,
  toDateKey,
  isToday,
  uid,
} from "@/utils/calendar";
import {
  generateICS,
  parseICS,
  generateJSON,
  parseJSON,
  generateCSV,
  parseCSV,
  downloadFile,
} from "@/utils/ics";
import { Task, TasksByDate, HolidaysByDate, DragData } from "@/lib/types";
import { COUNTRIES } from "@/lib/constants";
import CalmlyMascot, { MascotMood } from "./CalmlyMascot";
import ToastSystem, { getRandomMessage, SCENARIO_MESSAGES } from "./ToastSystem";
import { playSound } from "@/utils/sounds";
import {
  GlobalStyles,
  AppWrapper,
  Header,
  Brand,
  Logo,
  BrandText,
  AppTitle,
  TaskCounter,
  Nav,
  NavButton,
  MonthLabel,
  Toolbar,
  SearchWrapper,
  SearchIcon,
  SearchInput,
  CountrySelect,
  Grid,
  DayHeader,
  Cell,
  DayNumber,
  TodayBadge,
  AddButton,
  HolidayTag,
  TaskList,
  TaskCard,
  TaskText,
  TaskActions,
  TinyButton,
  InlineInput,
  DragPlaceholder,
  ModalOverlay,
  ModalBox,
  ModalTitle,
  ModalLabel,
  ModalDescription,
  ModalBtnRow,
  ModalBtn,
  ModalDivider,
  ModalHint,
  HiddenFileInput,
  TASK_COLORS,
} from "./StyledComponents";
import styled from "styled-components";

// Extra styled components for mascot status bar
const StatusBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background: rgba(15, 23, 42, 0.5);
  border-bottom: 1px solid rgba(148, 163, 184, 0.06);
  gap: 16px;
  min-height: 70px;
`;

const StatusMessage = styled.div`
  font-size: 13px;
  color: #94A3B8;
  font-weight: 500;
  line-height: 1.5;
  max-width: 400px;
`;

const StatusHighlight = styled.span<{ $color: string }>`
  color: ${(p: { $color: string }) => p.$color};
  font-weight: 700;
`;

const SoundToggle = styled.button<{ $active: boolean }>`
  background: ${(p: { $active: boolean }) => p.$active ? "rgba(99,102,241,0.15)" : "rgba(148,163,184,0.08)"};
  border: 1px solid ${(p: { $active: boolean }) => p.$active ? "rgba(99,102,241,0.3)" : "rgba(148,163,184,0.12)"};
  border-radius: 8px;
  color: ${(p: { $active: boolean }) => p.$active ? "#818CF8" : "#64748B"};
  padding: 7px 12px;
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  transition: all 0.15s ease;
  &:hover { background: rgba(99, 102, 241, 0.2); }
`;

// API helpers
async function apiGet(year: number, month: number): Promise<TasksByDate> {
  try {
    const res = await fetch(`/api/tasks?year=${year}&month=${month}`);
    if (!res.ok) throw new Error("fetch failed");
    return await res.json();
  } catch { return {}; }
}

async function apiCreate(text: string, dateKey: string, order: number): Promise<Task | null> {
  try {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, dateKey, order }),
    });
    if (!res.ok) throw new Error("create failed");
    return await res.json();
  } catch { return null; }
}

async function apiUpdate(id: string, fields: Partial<Task>): Promise<Task | null> {
  try {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    if (!res.ok) throw new Error("update failed");
    return await res.json();
  } catch { return null; }
}

async function apiDelete(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    return res.ok;
  } catch { return false; }
}

async function apiBulkUpdate(tasks: Task[]): Promise<boolean> {
  try {
    const res = await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks }),
    });
    return res.ok;
  } catch { return false; }
}

// Mood calculator
function getOverallMood(tasks: TasksByDate): { mood: MascotMood; message: string; color: string } {
  const today = new Date();
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const totalTasks = Object.values(tasks).reduce((s, l) => s + l.length, 0);
  let overdueTasks = 0;
  let todayTasks = 0;

  Object.entries(tasks).forEach(([dateKey, list]) => {
    if (dateKey < todayKey && list.length > 0) overdueTasks += list.length;
    if (dateKey === todayKey) todayTasks = list.length;
  });

  if (overdueTasks > 3)
    return { mood: "sad", message: `${overdueTasks} overdue tasks... let's catch up!`, color: "#EF4444" };
  if (overdueTasks > 0)
    return { mood: "worried", message: `${overdueTasks} overdue task${overdueTasks > 1 ? "s" : ""} need attention`, color: "#F97316" };
  if (todayTasks > 5)
    return { mood: "worried", message: `Busy day! ${todayTasks} tasks today. You can do it!`, color: "#F97316" };
  if (todayTasks > 0)
    return { mood: "calm", message: `${todayTasks} task${todayTasks > 1 ? "s" : ""} today. Keep calm, you have time~`, color: "#6366F1" };
  if (totalTasks === 0)
    return { mood: "sleepy", message: "No tasks yet... a calm blank canvas~", color: "#94A3B8" };

  const dayOfWeek = today.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6)
    return { mood: "sleepy", message: "Weekend vibes... take it easy~", color: "#94A3B8" };

  return { mood: "happy", message: "Everything's looking good! Stay on track~", color: "#10B981" };
}

// Main Calendar Component
export default function Calendar() {
  const now = new Date();
  const [year, setYear] = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth());
  const [tasks, setTasks] = useState<TasksByDate>({});
  const [holidays, setHolidays] = useState<HolidaysByDate>({});
  const [country, setCountry] = useState<string>("US");
  const [search, setSearch] = useState<string>("");
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<{ dateKey: string; id: string } | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [dragItem, setDragItem] = useState<DragData | null>(null);
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hasWelcomed, setHasWelcomed] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const toastRef = useRef<((mood: MascotMood, message: string, sound?: Parameters<typeof playSound>[0]) => void) | null>(null);

  // Toast helper
  const toast = useCallback(
    (mood: MascotMood, message: string, sound?: Parameters<typeof playSound>[0]) => {
      if (toastRef.current) {
        toastRef.current(mood, message, soundEnabled ? sound : undefined);
      }
    },
    [soundEnabled]
  );

  // Welcome toast
  useEffect(() => {
    if (!loading && !hasWelcomed) {
      setHasWelcomed(true);
      setTimeout(() => {
        toast("love", getRandomMessage(SCENARIO_MESSAGES.welcome), "welcome");
      }, 600);
    }
  }, [loading, hasWelcomed, toast]);

  // Load tasks
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiGet(year, month).then((data) => {
      if (!cancelled) { setTasks(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [year, month]);

  // Check overdue on load
  useEffect(() => {
    if (loading || !hasWelcomed) return;
    const todayKey = toDateKey(now.getFullYear(), now.getMonth(), now.getDate());
    const todayTasks = tasks[todayKey] || [];
    let overdueCount = 0;
    Object.entries(tasks).forEach(([dateKey, list]) => {
      if (dateKey < todayKey && list.length > 0) overdueCount += list.length;
    });
    if (overdueCount > 0) {
      setTimeout(() => toast("worried", getRandomMessage(SCENARIO_MESSAGES.overdue), "overdue"), 2000);
    } else if (todayTasks.length > 0) {
      setTimeout(() => toast("calm", getRandomMessage(SCENARIO_MESSAGES.dueToday), "dueToday"), 2000);
    }
  }, [loading, hasWelcomed]);

  // Load holidays
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const map: HolidaysByDate = {};
        data.forEach((h: { date: string; localName: string; name: string }) => {
          if (!map[h.date]) map[h.date] = [];
          map[h.date].push(h.localName || h.name);
        });
        setHolidays(map);
      } catch { if (!cancelled) setHolidays({}); }
    })();
    return () => { cancelled = true; };
  }, [year, country]);

  // Focus inputs
  useEffect(() => {
    if ((editingCell || editingTask) && inputRef.current) inputRef.current.focus();
  }, [editingCell, editingTask]);

  // Navigation
  const prevMonth = useCallback(() => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1);
  }, [month]);
  const nextMonth = useCallback(() => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1);
  }, [month]);
  const goToday = useCallback(() => { setYear(now.getFullYear()); setMonth(now.getMonth()); }, []);

  // Task CRUD with toasts
  const addTask = useCallback(async (dateKey: string, text: string) => {
    if (!text.trim()) return;
    const currentList = tasks[dateKey] || [];
    const created = await apiCreate(text.trim(), dateKey, currentList.length);
    if (created) {
      setTasks((prev) => ({ ...prev, [dateKey]: [...(prev[dateKey] || []), created] }));
      toast("happy", getRandomMessage(SCENARIO_MESSAGES.taskCreated), "taskCreated");
    } else {
      toast("annoyed", getRandomMessage(SCENARIO_MESSAGES.error), "error");
    }
  }, [tasks, toast]);

  const deleteTask = useCallback(async (dateKey: string, taskId: string) => {
    const ok = await apiDelete(taskId);
    if (ok) {
      setTasks((prev) => {
        const list = (prev[dateKey] || []).filter((t) => t.id !== taskId);
        const next = { ...prev };
        if (list.length === 0) delete next[dateKey]; else next[dateKey] = list;
        return next;
      });
      toast("proud", getRandomMessage(SCENARIO_MESSAGES.taskDeleted), "taskDeleted");
    } else {
      toast("annoyed", getRandomMessage(SCENARIO_MESSAGES.error), "error");
    }
  }, [toast]);

  const updateTask = useCallback(async (dateKey: string, taskId: string, newText: string) => {
    if (!newText.trim()) { await deleteTask(dateKey, taskId); return; }
    const updated = await apiUpdate(taskId, { text: newText.trim() });
    if (updated) {
      setTasks((prev) => ({
        ...prev,
        [dateKey]: (prev[dateKey] || []).map((t) => t.id === taskId ? { ...t, text: newText.trim() } : t),
      }));
      toast("calm", getRandomMessage(SCENARIO_MESSAGES.taskEdited), "taskEdited");
    } else {
      toast("annoyed", getRandomMessage(SCENARIO_MESSAGES.error), "error");
    }
  }, [toast, deleteTask]);

  // Drag and Drop
  const handleDragStart = useCallback((e: React.DragEvent, dateKey: string, taskIndex: number) => {
    setDragItem({ dateKey, taskIndex });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, dateKey: string, idx?: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCell(dateKey);
    setDragOverIndex(idx !== undefined ? idx : null);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, targetDateKey: string) => {
    e.preventDefault();
    if (!dragItem) return;
    const { dateKey: srcKey, taskIndex: srcIdx } = dragItem;
    const srcTasks = [...(tasks[srcKey] || [])];
    const [moved] = srcTasks.splice(srcIdx, 1);
    if (!moved) return;

    if (srcKey === targetDateKey) {
      const insertAt = dragOverIndex !== null ? dragOverIndex : srcTasks.length;
      srcTasks.splice(insertAt, 0, moved);
      const reordered = srcTasks.map((t, i) => ({ ...t, order: i }));
      setTasks({ ...tasks, [srcKey]: reordered });
      await apiBulkUpdate(reordered);
    } else {
      const destTasks = [...(tasks[targetDateKey] || [])];
      const insertAt = dragOverIndex !== null ? dragOverIndex : destTasks.length;
      destTasks.splice(insertAt, 0, { ...moved, dateKey: targetDateKey });
      const reorderedSrc = srcTasks.map((t, i) => ({ ...t, order: i }));
      const reorderedDest = destTasks.map((t, i) => ({ ...t, order: i, dateKey: targetDateKey }));
      const updatedTasks = { ...tasks, [targetDateKey]: reorderedDest };
      if (reorderedSrc.length === 0) delete updatedTasks[srcKey]; else updatedTasks[srcKey] = reorderedSrc;
      setTasks(updatedTasks);
      await apiBulkUpdate([...reorderedSrc, ...reorderedDest]);
    }

    toast("excited", getRandomMessage(SCENARIO_MESSAGES.dragDrop), "dragDrop");
    setDragItem(null); setDragOverCell(null); setDragOverIndex(null);
  }, [dragItem, dragOverIndex, tasks, toast]);

  const handleDragEnd = useCallback(() => {
    setDragItem(null); setDragOverCell(null); setDragOverIndex(null);
  }, []);

  // Import / Export
  const handleExportICS = useCallback(() => {
    downloadFile(generateICS(tasks), "calmly-tasks.ics", "text/calendar");
    setShowModal(false);
    toast("proud", getRandomMessage(SCENARIO_MESSAGES.exportSuccess), "exportSuccess");
  }, [tasks, toast]);

  const handleExportJSON = useCallback(() => {
    downloadFile(generateJSON(tasks), "calmly-tasks.json", "application/json");
    setShowModal(false);
    toast("proud", getRandomMessage(SCENARIO_MESSAGES.exportSuccess), "exportSuccess");
  }, [tasks, toast]);

  const handleExportCSV = useCallback(() => {
    downloadFile(generateCSV(tasks), "calmly-tasks.csv", "text/csv");
    setShowModal(false);
    toast("proud", getRandomMessage(SCENARIO_MESSAGES.exportSuccess), "exportSuccess");
  }, [tasks, toast]);

  const handleImportFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    let imported: TasksByDate = {};
    if (file.name.endsWith(".ics")) imported = parseICS(text);
    else if (file.name.endsWith(".json")) imported = parseJSON(text);
    else if (file.name.endsWith(".csv")) imported = parseCSV(text);

    const merged = { ...tasks };
    let importCount = 0;
    for (const [dateKey, list] of Object.entries(imported)) {
      for (const task of list) {
        const created = await apiCreate(task.text, dateKey, (merged[dateKey] || []).length);
        if (created) {
          if (!merged[dateKey]) merged[dateKey] = [];
          merged[dateKey].push(created);
          importCount++;
        }
      }
    }
    setTasks(merged);
    setShowModal(false);
    if (fileRef.current) fileRef.current.value = "";
    if (importCount > 0) {
      toast("excited", `Imported ${importCount} task${importCount > 1 ? "s" : ""}! ${getRandomMessage(SCENARIO_MESSAGES.importSuccess)}`, "importSuccess");
    } else {
      toast("annoyed", "No tasks found in file...", "error");
    }
  }, [tasks, toast]);

  // Grid computation
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const filteredTasks = useMemo((): TasksByDate => {
    if (!search.trim()) return tasks;
    const q = search.toLowerCase();
    const result: TasksByDate = {};
    Object.entries(tasks).forEach(([key, list]) => {
      const match = list.filter((t) => t.text.toLowerCase().includes(q));
      if (match.length) result[key] = match;
    });
    return result;
  }, [tasks, search]);

  const taskCount = useMemo(() => Object.values(tasks).reduce((s, l) => s + l.length, 0), [tasks]);
  const overallMood = useMemo(() => getOverallMood(tasks), [tasks]);
  const todayKey = toDateKey(now.getFullYear(), now.getMonth(), now.getDate());

  return (
    <>
      <GlobalStyles />
      <AppWrapper>
        <ToastSystem toastRef={toastRef} />

        {/* Header */}
        <Header>
          <Brand>
            <Logo>C</Logo>
            <BrandText>
              <AppTitle>Calmly</AppTitle>
              <TaskCounter>{loading ? "Loading..." : `${taskCount} task${taskCount !== 1 ? "s" : ""}`}</TaskCounter>
            </BrandText>
          </Brand>

          <Nav>
            <NavButton onClick={prevMonth}>&#8249;</NavButton>
            <NavButton onClick={goToday}>Today</NavButton>
            <NavButton onClick={nextMonth}>&#8250;</NavButton>
            <MonthLabel>{MONTH_NAMES[month]} {year}</MonthLabel>
          </Nav>

          <Toolbar>
            <SearchWrapper>
              <SearchIcon>&#8981;</SearchIcon>
              <SearchInput placeholder="Filter tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </SearchWrapper>
            <CountrySelect value={country} onChange={(e) => setCountry(e.target.value)}>
              {COUNTRIES.map((c) => (<option key={c.code} value={c.code}>{c.name}</option>))}
            </CountrySelect>
            <SoundToggle $active={soundEnabled} onClick={() => setSoundEnabled((s) => !s)} title={soundEnabled ? "Mute sounds" : "Enable sounds"}>
              {soundEnabled ? "\uD83D\uDD0A" : "\uD83D\uDD07"}
            </SoundToggle>
            <NavButton onClick={() => setShowModal(true)}>&#8644; Import / Export</NavButton>
          </Toolbar>
        </Header>

        {/* Mascot Status Bar */}
        <StatusBar>
          <CalmlyMascot mood={overallMood.mood} size={48} message="" />
          <StatusMessage>
            <StatusHighlight $color={overallMood.color}>
              {overallMood.mood === "happy" ? "All good! " : overallMood.mood === "sad" ? "Uh oh... " : overallMood.mood === "worried" ? "Heads up! " : ""}
            </StatusHighlight>
            {overallMood.message}
          </StatusMessage>
        </StatusBar>

        {/* Grid */}
        <Grid>
          {DAYS_OF_WEEK.map((d) => (<DayHeader key={d}>{d}</DayHeader>))}

          {Array.from({ length: totalCells }).map((_, i) => {
            const dayNum = i - firstDay + 1;
            const isValid = dayNum >= 1 && dayNum <= daysInMonth;
            if (!isValid) return <Cell key={i} $isEmpty />;

            const dateKey = toDateKey(year, month, dayNum);
            const dayTasks = filteredTasks[dateKey] || [];
            const dayHolidays = holidays[dateKey] || [];
            const isTodayCell = isToday(year, month, dayNum);
            const isDragTarget = dragOverCell === dateKey;
            const isOverdue = dateKey < todayKey && dayTasks.length > 0;

            return (
              <Cell key={i} $isToday={isTodayCell} $isDragOver={isDragTarget}
                onDragOver={(e: React.DragEvent) => handleDragOver(e, dateKey)}
                onDrop={(e: React.DragEvent) => handleDrop(e, dateKey)}
                onDragLeave={() => { if (dragOverCell === dateKey) setDragOverCell(null); }}
                style={isOverdue ? { borderLeft: "2px solid #EF4444" } : undefined}
              >
                <DayNumber>
                  {isTodayCell ? <TodayBadge>{dayNum}</TodayBadge> : <span style={isOverdue ? { color: "#EF4444" } : undefined}>{dayNum}</span>}
                  <AddButton title="Add task" onClick={() => { setEditingCell(dateKey); setEditText(""); setEditingTask(null); }}>+</AddButton>
                </DayNumber>

                {dayHolidays.map((h, hi) => (<HolidayTag key={hi} title={h}>{h}</HolidayTag>))}

                <TaskList>
                  {dayTasks.map((task, ti) => {
                    const color = TASK_COLORS[ti % TASK_COLORS.length];
                    const isDragging = dragItem?.dateKey === dateKey && dragItem?.taskIndex === ti;

                    if (editingTask?.dateKey === dateKey && editingTask?.id === task.id) {
                      return (
                        <InlineInput key={task.id} ref={inputRef} value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { updateTask(dateKey, task.id, editText); setEditingTask(null); } if (e.key === "Escape") setEditingTask(null); }}
                          onBlur={() => { updateTask(dateKey, task.id, editText); setEditingTask(null); }}
                        />
                      );
                    }

                    return (
                      <div key={task.id}>
                        {isDragTarget && dragOverIndex === ti && dragItem?.dateKey !== dateKey && <DragPlaceholder />}
                        <TaskCard $bgColor={color.bg} $borderColor={isOverdue ? "#EF4444" : color.border} $textColor={color.text} $isDragging={isDragging}
                          draggable
                          onDragStart={(e: React.DragEvent) => handleDragStart(e, dateKey, ti)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); handleDragOver(e, dateKey, ti); }}
                          onDoubleClick={() => { setEditingTask({ dateKey, id: task.id }); setEditText(task.text); }}
                        >
                          <TaskText>{task.text}</TaskText>
                          <TaskActions>
                            <TinyButton title="Edit" onClick={(e) => { e.stopPropagation(); setEditingTask({ dateKey, id: task.id }); setEditText(task.text); }}>&#9998;</TinyButton>
                            <TinyButton title="Delete" onClick={(e) => { e.stopPropagation(); deleteTask(dateKey, task.id); }}>&#215;</TinyButton>
                          </TaskActions>
                        </TaskCard>
                      </div>
                    );
                  })}
                  {isDragTarget && (dragOverIndex === null || dragOverIndex >= dayTasks.length) && <DragPlaceholder />}
                </TaskList>

                {editingCell === dateKey && !editingTask && (
                  <InlineInput ref={inputRef} placeholder="New task..." value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { addTask(dateKey, editText); setEditText(""); setEditingCell(null); } if (e.key === "Escape") { setEditingCell(null); setEditText(""); } }}
                    onBlur={() => { if (editText.trim()) addTask(dateKey, editText); setEditingCell(null); setEditText(""); }}
                  />
                )}
              </Cell>
            );
          })}
        </Grid>

        {/* Import / Export Modal */}
        {showModal && (
          <ModalOverlay onClick={() => setShowModal(false)}>
            <ModalBox onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <CalmlyMascot mood="calm" size={36} message="" />
                <ModalTitle style={{ marginBottom: 0 }}>Import / Export</ModalTitle>
              </div>

              <ModalLabel>Export your tasks</ModalLabel>
              <ModalDescription>Download all tasks in a format compatible with your calendar app.</ModalDescription>
              <ModalBtnRow>
                <ModalBtn $primary onClick={handleExportICS}>Export .ics</ModalBtn>
                <ModalBtn onClick={handleExportJSON}>Export .json</ModalBtn>
                <ModalBtn onClick={handleExportCSV}>Export .csv</ModalBtn>
              </ModalBtnRow>
              <ModalHint>
                <strong>.ics</strong> -- Google Calendar, Apple Calendar, Outlook | <strong>.json</strong> -- Re-import into Calmly | <strong>.csv</strong> -- Spreadsheets
              </ModalHint>

              <ModalDivider />

              <ModalLabel>Import tasks</ModalLabel>
              <ModalDescription>Import from .ics, .json, or .csv files. Tasks merge with existing data.</ModalDescription>
              <ModalBtnRow>
                <ModalBtn $primary onClick={() => fileRef.current?.click()}>Choose File</ModalBtn>
                <ModalBtn onClick={() => setShowModal(false)}>Cancel</ModalBtn>
              </ModalBtnRow>
              <HiddenFileInput ref={fileRef} type="file" accept=".ics,.json,.csv" onChange={handleImportFile} />
            </ModalBox>
          </ModalOverlay>
        )}
      </AppWrapper>
    </>
  );
}

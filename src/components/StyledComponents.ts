"use client";

import styled, { css, keyframes, createGlobalStyle } from "styled-components";

/* ── Theme tokens ─────────────────────────────────────────────────────────── */
export const theme = {
  bg: "#0F172A",
  bgSecondary: "#1E293B",
  bgCell: "rgba(15,23,42,0.85)",
  bgCellEmpty: "rgba(15,23,42,0.4)",
  bgHover: "rgba(148,163,184,0.06)",
  bgGlass: "rgba(15,23,42,0.7)",
  border: "rgba(148,163,184,0.12)",
  borderLight: "rgba(148,163,184,0.08)",
  text: "#E2E8F0",
  textMuted: "#94A3B8",
  textDim: "#64748B",
  textBright: "#F1F5F9",
  accent: "#6366F1",
  accentLight: "#818CF8",
  accentSoft: "#A78BFA",
  holiday: "#F59E0B",
  danger: "#EF4444",
  success: "#10B981",
};

export const TASK_COLORS = [
  { bg: "#E8F0FE", border: "#4285F4", text: "#1A56DB" },
  { bg: "#FEF3E2", border: "#F59E0B", text: "#B45309" },
  { bg: "#ECFDF5", border: "#10B981", text: "#047857" },
  { bg: "#FDE8E8", border: "#EF4444", text: "#B91C1C" },
  { bg: "#F3E8FF", border: "#8B5CF6", text: "#6D28D9" },
  { bg: "#E0F2FE", border: "#0EA5E9", text: "#0369A1" },
];

/* ── Global Styles ────────────────────────────────────────────────────────── */
export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'DM Sans', 'Segoe UI', sans-serif;
    background: linear-gradient(145deg, ${theme.bg} 0%, ${theme.bgSecondary} 50%, ${theme.bg} 100%);
    color: ${theme.text};
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: ${theme.borderLight};
    border-radius: 4px;
  }
`;

/* ── Animations ───────────────────────────────────────────────────────────── */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

/* ── Layout ───────────────────────────────────────────────────────────────── */
export const AppWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

/* ── Header ───────────────────────────────────────────────────────────────── */
export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-bottom: 1px solid ${theme.border};
  backdrop-filter: blur(20px);
  background: ${theme.bgGlass};
  position: sticky;
  top: 0;
  z-index: 100;
  flex-wrap: wrap;
  gap: 12px;
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Logo = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, ${theme.accent}, ${theme.accentSoft});
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
  letter-spacing: -0.02em;
`;

export const BrandText = styled.div``;

export const AppTitle = styled.h1`
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${theme.textBright};
  line-height: 1.2;
`;

export const TaskCounter = styled.div`
  font-size: 11px;
  color: ${theme.textDim};
  font-weight: 500;
`;

/* ── Navigation ───────────────────────────────────────────────────────────── */
export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const NavButton = styled.button`
  background: ${theme.borderLight};
  border: 1px solid ${theme.border};
  border-radius: 8px;
  color: ${theme.textMuted};
  padding: 7px 14px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(148, 163, 184, 0.15);
    color: ${theme.textBright};
  }
`;

export const MonthLabel = styled.span`
  font-size: 16px;
  font-weight: 700;
  min-width: 180px;
  text-align: center;
  color: ${theme.textBright};
  letter-spacing: -0.01em;
`;

/* ── Toolbar ──────────────────────────────────────────────────────────────── */
export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

export const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SearchIcon = styled.span`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.textDim};
  font-size: 14px;
  pointer-events: none;
`;

export const SearchInput = styled.input`
  background: ${theme.borderLight};
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 8px;
  color: ${theme.text};
  padding: 7px 12px 7px 34px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  width: 200px;
  transition: border 0.15s ease;

  &:focus {
    border-color: ${theme.accent};
  }

  &::placeholder {
    color: ${theme.textDim};
  }
`;

export const CountrySelect = styled.select`
  background: ${theme.borderLight};
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 8px;
  color: ${theme.text};
  padding: 7px 10px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  cursor: pointer;

  option {
    background: ${theme.bgSecondary};
    color: ${theme.text};
  }
`;

/* ── Calendar Grid ────────────────────────────────────────────────────────── */
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: ${theme.borderLight};
  flex: 1;
`;

export const DayHeader = styled.div`
  padding: 10px 8px;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${theme.textDim};
  background: rgba(15, 23, 42, 0.9);
`;

interface CellProps {
  $isEmpty?: boolean;
  $isToday?: boolean;
  $isDragOver?: boolean;
}

export const Cell = styled.div<CellProps>`
  background: ${(p) => (p.$isEmpty ? theme.bgCellEmpty : theme.bgCell)};
  min-height: 125px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.15s ease;
  cursor: default;
  overflow: hidden;
  animation: ${fadeIn} 0.25s ease both;

  /* Subtle whiteboard texture */
  background-image: ${(p) => p.$isEmpty ? "none" : "radial-gradient(circle at 50% 50%, rgba(148,163,184,0.02) 1px, transparent 1px)"};
  background-size: 12px 12px;

  ${(p) =>
    p.$isToday &&
    css`
      background-color: rgba(99, 102, 241, 0.06);
      border-top: 2px solid ${theme.accent};
    `}

  ${(p) =>
    p.$isDragOver &&
    css`
      background-color: rgba(99, 102, 241, 0.1);
      box-shadow: inset 0 0 0 2px rgba(99, 102, 241, 0.35);
    `}
`;

export const DayNumber = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${theme.textMuted};
  margin-bottom: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 10;
  background: inherit;
  padding-bottom: 2px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.06);
  flex-shrink: 0;
`;

export const TodayBadge = styled.span`
  background: linear-gradient(135deg, ${theme.accent}, ${theme.accentSoft});
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
`;

export const AddButton = styled.button`
  background: none;
  border: none;
  color: ${theme.textDim};
  cursor: pointer;
  font-size: 17px;
  line-height: 1;
  padding: 0 2px;
  border-radius: 4px;
  transition: color 0.15s ease;
  font-family: inherit;

  &:hover {
    color: ${theme.accent};
  }
`;

/* ── Holidays ─────────────────────────────────────────────────────────────── */
export const HolidayTag = styled.div`
  font-size: 9px;
  color: ${theme.holiday};
  font-weight: 600;
  padding: 2px 5px;
  background: rgba(245, 158, 11, 0.08);
  border-radius: 4px;
  margin-bottom: 3px;
  line-height: 1.3;
  border-left: 2px solid ${theme.holiday};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* ── Tasks (Sticky Note Whiteboard Style) ─────────────────────────────────── */
export const TaskList = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 95px;
  padding: 1px;
  position: relative;
`;

/* Color palette for sticky notes - warm paper tones */
export const STICKY_COLORS = [
  { bg: "#FEF9C3", shadow: "#EAB308", text: "#713F12" },  // yellow
  { bg: "#DBEAFE", shadow: "#3B82F6", text: "#1E3A5F" },  // blue
  { bg: "#FCE7F3", shadow: "#EC4899", text: "#831843" },  // pink
  { bg: "#D1FAE5", shadow: "#10B981", text: "#064E3B" },  // green
  { bg: "#EDE9FE", shadow: "#8B5CF6", text: "#3B0764" },  // purple
  { bg: "#FFEDD5", shadow: "#F97316", text: "#7C2D12" },  // orange
];

interface StickyNoteProps {
  $bgColor: string;
  $shadowColor: string;
  $textColor: string;
  $rotation: number;
  $isDragging?: boolean;
  $index: number;
}

export const StickyNote = styled.div<StickyNoteProps>`
  width: calc(50% - 2px);
  min-height: 28px;
  max-height: 44px;
  padding: 4px 6px;
  border-radius: 1px 1px 1px 8px;
  background: ${(p) => p.$isDragging ? "rgba(99,102,241,0.3)" : p.$bgColor};
  color: ${(p) => p.$textColor};
  cursor: grab;
  display: flex;
  flex-direction: column;
  gap: 1px;
  opacity: ${(p) => p.$isDragging ? 0.5 : 1};
  user-select: none;
  line-height: 1.25;
  font-weight: 500;
  font-size: 9px;
  font-family: 'DM Sans', sans-serif;
  position: relative;
  transform: rotate(${(p) => p.$rotation}deg);
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.1s;
  box-shadow:
    1px 1px 2px rgba(0,0,0,0.15),
    inset 0 -1px 0 ${(p) => p.$shadowColor}22;
  z-index: ${(p) => p.$index + 1};
  overflow: hidden;
  margin: 1px;

  /* Tape / pin effect at top */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 3px;
    background: ${(p) => p.$shadowColor}40;
    border-radius: 0 0 2px 2px;
  }

  &:hover {
    transform: rotate(0deg) scale(1.05);
    box-shadow: 2px 3px 8px rgba(0,0,0,0.25);
    z-index: 20;
  }

  &:active {
    cursor: grabbing;
    transform: rotate(0deg) scale(1.08);
    z-index: 30;
    box-shadow: 3px 5px 12px rgba(0,0,0,0.3);
  }
`;

export const StickyNoteText = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 9px;
  line-height: 1.2;
`;

export const StickyNoteRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

export const StickyNoteActions = styled.span`
  display: flex;
  gap: 1px;
  opacity: 0;
  transition: opacity 0.15s ease;
  flex-shrink: 0;
  position: absolute;
  top: 2px;
  right: 2px;

  ${StickyNote}:hover & {
    opacity: 0.8;
  }
`;

export const StickyTinyBtn = styled.button`
  background: rgba(0,0,0,0.08);
  border: none;
  cursor: pointer;
  font-size: 8px;
  padding: 1px 3px;
  line-height: 1;
  color: inherit;
  font-family: inherit;
  border-radius: 2px;

  &:hover {
    background: rgba(0,0,0,0.15);
  }
`;

export const StickyLimitMsg = styled.div`
  font-size: 8px;
  color: #64748B;
  text-align: center;
  padding: 2px;
  width: 100%;
`;

/* Keep old TaskCard for backward compat but rename */
interface TaskCardProps {
  $bgColor: string;
  $borderColor: string;
  $textColor: string;
  $isDragging?: boolean;
}

export const TaskCard = styled.div<TaskCardProps>`
  font-size: 11px;
  padding: 3px 6px;
  border-radius: 4px;
  background: ${(p) => (p.$isDragging ? "rgba(99,102,241,0.3)" : p.$bgColor)};
  border-left: 3px solid ${(p) => p.$borderColor};
  color: ${(p) => p.$textColor};
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  opacity: ${(p) => (p.$isDragging ? 0.5 : 1)};
  transition: opacity 0.1s, transform 0.1s;
  user-select: none;
  line-height: 1.3;
  font-weight: 500;
  &:active { cursor: grabbing; }
`;

export const TaskText = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TaskActions = styled.span`
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.15s ease;
  flex-shrink: 0;

  ${TaskCard}:hover & {
    opacity: 1;
  }
`;

export const TinyButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 11px;
  padding: 0 2px;
  line-height: 1;
  color: inherit;
  font-family: inherit;

  &:hover {
    opacity: 0.7;
  }
`;

export const InlineInput = styled.input`
  font-size: 11px;
  padding: 3px 6px;
  border-radius: 4px;
  border: 1px solid rgba(99, 102, 241, 0.5);
  background: rgba(99, 102, 241, 0.08);
  color: ${theme.text};
  outline: none;
  width: 100%;
  font-family: inherit;
  box-sizing: border-box;
`;

export const DragPlaceholder = styled.div`
  width: calc(50% - 2px);
  height: 28px;
  border-radius: 2px;
  border: 2px dashed rgba(99,102,241,0.4);
  background: rgba(99,102,241,0.06);
  margin: 1px;
  transition: all 0.15s ease;
`;

/* ── Modal ─────────────────────────────────────────────────────────────────── */
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

export const ModalBox = styled.div`
  background: ${theme.bgSecondary};
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 16px;
  padding: 28px;
  max-width: 460px;
  width: 90%;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  animation: ${slideUp} 0.25s ease both;
`;

export const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${theme.textBright};
`;

export const ModalLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${theme.textMuted};
  margin-bottom: 6px;
  display: block;
`;

export const ModalDescription = styled.p`
  font-size: 12px;
  color: ${theme.textMuted};
  margin-bottom: 12px;
  line-height: 1.5;
`;

export const ModalBtnRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 14px;
  flex-wrap: wrap;
`;

interface ModalBtnProps {
  $primary?: boolean;
}

export const ModalBtn = styled.button<ModalBtnProps>`
  padding: 9px 18px;
  border-radius: 8px;
  border: ${(p) => (p.$primary ? "none" : `1px solid rgba(148,163,184,0.2)`)};
  background: ${(p) =>
    p.$primary
      ? `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`
      : theme.borderLight};
  color: ${(p) => (p.$primary ? "white" : theme.textMuted)};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

export const ModalDivider = styled.div`
  border-top: 1px solid ${theme.border};
  margin: 20px 0 16px;
`;

export const ModalHint = styled.div`
  font-size: 10px;
  color: ${theme.textDim};
  margin-top: 8px;
  line-height: 1.5;

  strong {
    color: ${theme.textMuted};
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

/* ── Meeting Task Styles ──────────────────────────────────────────────────── */
export const MeetingBadge = styled.span`
  font-size: 9px;
  font-weight: 700;
  color: ${theme.accent};
  background: rgba(99, 102, 241, 0.15);
  padding: 1px 5px;
  border-radius: 3px;
  margin-right: 4px;
  flex-shrink: 0;
`;

export const TimeInput = styled.input`
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 4px;
  border: 1px solid rgba(99, 102, 241, 0.4);
  background: rgba(99, 102, 241, 0.08);
  color: ${theme.text};
  outline: none;
  width: 62px;
  font-family: inherit;
  box-sizing: border-box;
  flex-shrink: 0;
`;

export const MeetingToggle = styled.button<{ $active: boolean }>`
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid ${(p: { $active: boolean }) => p.$active ? "rgba(99,102,241,0.5)" : "rgba(148,163,184,0.2)"};
  background: ${(p: { $active: boolean }) => p.$active ? "rgba(99,102,241,0.15)" : "transparent"};
  color: ${(p: { $active: boolean }) => p.$active ? theme.accent : theme.textDim};
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;

  &:hover {
    border-color: ${theme.accent};
  }
`;

export const AddTaskRow = styled.div`
  display: flex;
  gap: 3px;
  align-items: center;
`;

export const LabelBadge = styled.span<{ $color: string }>`
  font-size: 8px;
  font-weight: 700;
  color: ${(p: { $color: string }) => p.$color};
  background: ${(p: { $color: string }) => p.$color}18;
  padding: 1px 5px;
  border-radius: 3px;
  margin-right: 3px;
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;


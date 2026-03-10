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
  min-height: 115px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.15s ease;
  cursor: default;
  overflow: hidden;
  animation: ${fadeIn} 0.25s ease both;

  ${(p) =>
    p.$isToday &&
    css`
      background: rgba(99, 102, 241, 0.06);
      border-top: 2px solid ${theme.accent};
    `}

  ${(p) =>
    p.$isDragOver &&
    css`
      background: rgba(99, 102, 241, 0.12);
      box-shadow: inset 0 0 0 2px rgba(99, 102, 241, 0.4);
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

/* ── Tasks ─────────────────────────────────────────────────────────────────── */
export const TaskList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 90px;
`;

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

  &:active {
    cursor: grabbing;
  }
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
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, ${theme.accent}, ${theme.accentSoft});
  margin: 1px 0;
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

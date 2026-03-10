"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import CalmlyMascot from "./CalmlyMascot";
import { TasksByDate } from "@/lib/types";
import { generateICS, downloadFile } from "@/utils/ics";
import { playSound } from "@/utils/sounds";

interface Props {
  tasks: TasksByDate;
  dateKey: string;
  onDismiss: () => void;
  soundEnabled: boolean;
}

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const Wrap = styled.div`
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
  z-index: 8000; animation: ${slideIn} 0.35s ease both;
  background: rgba(30,41,59,0.95); backdrop-filter: blur(16px);
  border: 1px solid rgba(148,163,184,0.15); border-radius: 18px;
  padding: 16px 22px; box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  display: flex; align-items: center; gap: 14px; max-width: 520px; width: 90%;
`;

const Content = styled.div`flex: 1;`;

const Title = styled.div`
  font-size: 13px; font-weight: 700; color: #F1F5F9; margin-bottom: 4px;
`;

const Subtitle = styled.div`
  font-size: 11px; color: #94A3B8; margin-bottom: 10px; line-height: 1.4;
`;

const BtnRow = styled.div`
  display: flex; gap: 6px; flex-wrap: wrap; align-items: center;
`;

const SyncBtn = styled.button<{ $color: string }>`
  display: flex; align-items: center; gap: 5px;
  padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: all 0.15s;
  border: 1px solid ${(p:{$color:string}) => p.$color}40;
  background: ${(p:{$color:string}) => p.$color}15;
  color: ${(p:{$color:string}) => p.$color};
  &:hover { background: ${(p:{$color:string}) => p.$color}25; transform: translateY(-1px); }
`;

const DismissBtn = styled.button`
  padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: all 0.15s;
  border: 1px solid rgba(148,163,184,0.15); background: rgba(148,163,184,0.06);
  color: #64748B;
  &:hover { color: #94A3B8; background: rgba(148,163,184,0.12); }
`;

const DontShowBtn = styled.button`
  padding: 4px 8px; border: none; background: none; font-size: 10px;
  color: #475569; cursor: pointer; font-family: inherit; text-decoration: underline;
  &:hover { color: #64748B; }
`;

export default function SyncPrompt({ tasks, dateKey, onDismiss, soundEnabled }: Props) {
  const [dismissed, setDismissed] = useState(false);

  const handleExportDay = (format: "ics" | "google") => {
    const dayTasks: TasksByDate = {};
    if (tasks[dateKey]) dayTasks[dateKey] = tasks[dateKey];

    if (format === "ics") {
      downloadFile(generateICS(dayTasks), `calmly-${dateKey}.ics`, "text/calendar");
    } else if (format === "google") {
      // Open Google Calendar create event URL
      const t = tasks[dateKey]?.[0];
      if (t) {
        const d = dateKey.replace(/-/g, "");
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(t.text)}&dates=${d}/${d}&details=${encodeURIComponent("Exported from Calmly")}`;
        window.open(url, "_blank");
      }
    }

    if (soundEnabled) playSound("exportSuccess");
    onDismiss();
  };

  const handleDontShowToday = () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      sessionStorage.setItem("calmly-sync-dismissed", today);
    } catch {}
    onDismiss();
  };

  if (dismissed) return null;

  return (
    <Wrap>
      <CalmlyMascot mood="happy" size={44} message="" />
      <Content>
        <Title>Sync your tasks?</Title>
        <Subtitle>Export today's tasks to your other calendars</Subtitle>
        <BtnRow>
          <SyncBtn $color="#4285F4" onClick={() => handleExportDay("google")}>
            <span style={{ fontSize: 13 }}>G</span> Google Calendar
          </SyncBtn>
          <SyncBtn $color="#6366F1" onClick={() => handleExportDay("ics")}>
            <span style={{ fontSize: 11 }}>📅</span> Download .ics
          </SyncBtn>
          <DismissBtn onClick={onDismiss}>Not now</DismissBtn>
        </BtnRow>
        <DontShowBtn onClick={handleDontShowToday}>Don't show again today</DontShowBtn>
      </Content>
    </Wrap>
  );
}

export function shouldShowSyncPrompt(): boolean {
  try {
    const dismissed = sessionStorage.getItem("calmly-sync-dismissed");
    if (!dismissed) return true;
    const today = new Date().toISOString().split("T")[0];
    return dismissed !== today;
  } catch { return true; }
}

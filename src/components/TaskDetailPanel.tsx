"use client";

import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import CalmlyMascot from "./CalmlyMascot";
import { Task, TaskLabel } from "@/lib/types";

interface Props {
  task: Task;
  onSave: (updates: Partial<Task>) => void;
  onClose: () => void;
  onDelete: () => void;
}

const LABELS: { value: TaskLabel; label: string; color: string; emoji: string }[] = [
  { value: "work", label: "Work", color: "#3B82F6", emoji: "💼" },
  { value: "personal", label: "Personal", color: "#8B5CF6", emoji: "🏠" },
  { value: "health", label: "Health", color: "#10B981", emoji: "💚" },
  { value: "finance", label: "Finance", color: "#F59E0B", emoji: "💰" },
  { value: "social", label: "Social", color: "#EC4899", emoji: "👥" },
  { value: "creative", label: "Creative", color: "#06B6D4", emoji: "🎨" },
  { value: "urgent", label: "Urgent", color: "#EF4444", emoji: "🔥" },
  { value: "travel", label: "Travel", color: "#F97316", emoji: "✈️" },
];

export function getLabelInfo(label: TaskLabel) {
  return LABELS.find(l => l.value === label) || null;
}

// Animations
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const writeAnim = keyframes`
  0% { transform: translateY(0) rotate(0); }
  25% { transform: translateY(-2px) rotate(-3deg); }
  50% { transform: translateY(0) rotate(0); }
  75% { transform: translateY(-1px) rotate(2deg); }
  100% { transform: translateY(0) rotate(0); }
`;

// Styled
const Overlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.6);
  backdrop-filter: blur(10px); display: flex; align-items: center;
  justify-content: center; z-index: 9000; animation: ${fadeIn} 0.2s ease;
`;

const Panel = styled.div`
  background: #1E293B; border: 1px solid rgba(148,163,184,0.15);
  border-radius: 20px; width: 95%; max-width: 520px; max-height: 90vh;
  overflow-y: auto; box-shadow: 0 25px 60px rgba(0,0,0,0.5);
  animation: ${slideUp} 0.35s ease both;
  display: flex; flex-direction: column;
`;

const PanelHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px 0; gap: 12px;
`;

const PanelTitle = styled.input`
  font-size: 20px; font-weight: 700; color: #F1F5F9;
  background: none; border: none; outline: none; flex: 1;
  font-family: inherit; letter-spacing: -0.02em;
  &::placeholder { color: #475569; }
`;

const CloseBtn = styled.button`
  background: rgba(148,163,184,0.1); border: 1px solid rgba(148,163,184,0.15);
  border-radius: 10px; color: #94A3B8; width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 18px; font-family: inherit; transition: all 0.15s;
  &:hover { background: rgba(148,163,184,0.2); color: #F1F5F9; }
`;

const Section = styled.div`
  padding: 14px 24px; border-top: 1px solid rgba(148,163,184,0.08);
`;

const SectionLabel = styled.div`
  font-size: 11px; font-weight: 700; color: #64748B;
  text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;
`;

const LabelsRow = styled.div`
  display: flex; flex-wrap: wrap; gap: 6px;
`;

const LabelChip = styled.button<{ $color: string; $active: boolean }>`
  display: flex; align-items: center; gap: 4px;
  padding: 5px 12px; border-radius: 20px; font-size: 12px;
  font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s;
  border: 1.5px solid ${(p:{$color:string;$active:boolean}) => p.$active ? p.$color : "rgba(148,163,184,0.15)"};
  background: ${(p:{$color:string;$active:boolean}) => p.$active ? p.$color + "20" : "rgba(148,163,184,0.05)"};
  color: ${(p:{$color:string;$active:boolean}) => p.$active ? p.$color : "#94A3B8"};
  &:hover { border-color: ${(p:{$color:string}) => p.$color}; }
`;

const TimeRow = styled.div`
  display: flex; gap: 10px; align-items: center; flex-wrap: wrap;
`;

const InputField = styled.input`
  background: rgba(148,163,184,0.06); border: 1px solid rgba(148,163,184,0.15);
  border-radius: 10px; color: #E2E8F0; padding: 9px 14px; font-size: 13px;
  font-family: inherit; outline: none; transition: border 0.15s;
  &:focus { border-color: #6366F1; }
  &::placeholder { color: #475569; }
`;

const MeetingToggleBtn = styled.button<{ $active: boolean }>`
  padding: 9px 16px; border-radius: 10px; font-size: 12px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: all 0.15s;
  border: 1.5px solid ${(p:{$active:boolean}) => p.$active ? "#6366F1" : "rgba(148,163,184,0.15)"};
  background: ${(p:{$active:boolean}) => p.$active ? "rgba(99,102,241,0.15)" : "rgba(148,163,184,0.05)"};
  color: ${(p:{$active:boolean}) => p.$active ? "#818CF8" : "#94A3B8"};
  &:hover { border-color: #6366F1; }
`;

const LinkInput = styled(InputField)`
  flex: 1; min-width: 0;
`;

const LinkRow = styled.div`
  display: flex; gap: 8px; align-items: center;
`;

const JoinBtn = styled.a`
  padding: 9px 16px; border-radius: 10px; font-size: 12px; font-weight: 700;
  text-decoration: none; background: linear-gradient(135deg, #6366F1, #818CF8);
  color: white; flex-shrink: 0; transition: all 0.15s;
  &:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99,102,241,0.3); }
`;

// Sticky note style for notes
const NoteArea = styled.div`
  position: relative; background: rgba(254,243,199,0.06);
  border: 1px solid rgba(245,158,11,0.15); border-radius: 12px;
  padding: 14px; min-height: 100px;
`;

const NoteTextarea = styled.textarea`
  width: 100%; min-height: 80px; background: none; border: none;
  color: #E2E8F0; font-size: 13px; font-family: 'DM Sans', sans-serif;
  outline: none; resize: vertical; line-height: 1.6;
  &::placeholder { color: #64748B; }
`;

const MascotWriter = styled.div<{ $writing: boolean }>`
  position: absolute; bottom: 8px; right: 8px;
  opacity: ${(p:{$writing:boolean}) => p.$writing ? 1 : 0.3};
  transition: opacity 0.3s;
  animation: ${(p:{$writing:boolean}) => p.$writing ? writeAnim : "none"} 0.4s ease-in-out infinite;
`;

const NoteHint = styled.div`
  font-size: 10px; color: #64748B; margin-top: 6px;
  display: flex; align-items: center; gap: 4px;
`;

const FooterRow = styled.div`
  display: flex; gap: 8px; padding: 16px 24px; justify-content: space-between;
  border-top: 1px solid rgba(148,163,184,0.08); align-items: center;
`;

const SaveBtn = styled.button`
  padding: 10px 28px; border-radius: 10px; border: none;
  background: linear-gradient(135deg, #6366F1, #818CF8); color: white;
  font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit;
  transition: all 0.15s;
  &:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(99,102,241,0.3); }
`;

const DeleteBtn = styled.button`
  padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: all 0.15s;
  border: 1px solid rgba(239,68,68,0.3); background: rgba(239,68,68,0.08);
  color: #EF4444;
  &:hover { background: rgba(239,68,68,0.15); }
`;

const DateInfo = styled.div`
  font-size: 11px; color: #64748B; font-weight: 500;
`;

export default function TaskDetailPanel({ task, onSave, onClose, onDelete }: Props) {
  const [text, setText] = useState(task.text);
  const [notes, setNotes] = useState(task.notes || "");
  const [label, setLabel] = useState<TaskLabel>(task.label || null);
  const [isMeeting, setIsMeeting] = useState(task.isMeeting || false);
  const [time, setTime] = useState(task.time || "");
  const [meetingLink, setMeetingLink] = useState(task.meetingLink || "");
  const [isWriting, setIsWriting] = useState(false);
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNotesChange = (val: string) => {
    setNotes(val);
    setIsWriting(true);
    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => setIsWriting(false), 800);
  };

  const handleSave = () => {
    onSave({
      text: text.trim() || task.text,
      notes: notes || undefined,
      label: label || undefined,
      isMeeting: isMeeting || undefined,
      time: time || undefined,
      meetingLink: meetingLink || undefined,
    });
    onClose();
  };

  const formatDate = (dk: string) => {
    try {
      const d = new Date(dk + "T00:00:00");
      return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    } catch { return dk; }
  };

  return (
    <Overlay onClick={onClose}>
      <Panel onClick={e => e.stopPropagation()}>
        <PanelHeader>
          <PanelTitle value={text} onChange={e => setText(e.target.value)} placeholder="Task name..." />
          <CloseBtn onClick={onClose}>&#215;</CloseBtn>
        </PanelHeader>

        <div style={{ padding: "6px 24px" }}>
          <DateInfo>{formatDate(task.dateKey)}</DateInfo>
        </div>

        {/* Labels */}
        <Section>
          <SectionLabel>Label</SectionLabel>
          <LabelsRow>
            {LABELS.map(l => (
              <LabelChip key={l.value} $color={l.color} $active={label === l.value}
                onClick={() => setLabel(label === l.value ? null : l.value)}>
                <span>{l.emoji}</span> {l.label}
              </LabelChip>
            ))}
          </LabelsRow>
        </Section>

        {/* Time & Meeting */}
        <Section>
          <SectionLabel>Schedule</SectionLabel>
          <TimeRow>
            <MeetingToggleBtn $active={isMeeting} onClick={() => setIsMeeting(!isMeeting)}>
              {isMeeting ? "Meeting" : "Task"}
            </MeetingToggleBtn>
            <InputField type="time" value={time} onChange={e => setTime(e.target.value)}
              style={{ width: 130 }} />
          </TimeRow>
        </Section>

        {/* Meeting Link */}
        {isMeeting && (
          <Section>
            <SectionLabel>Meeting Link</SectionLabel>
            <LinkRow>
              <LinkInput placeholder="https://zoom.us/j/... or meet.google.com/..."
                value={meetingLink} onChange={e => setMeetingLink(e.target.value)} />
              {meetingLink && (
                <JoinBtn href={meetingLink.startsWith("http") ? meetingLink : `https://${meetingLink}`}
                  target="_blank" rel="noopener noreferrer">
                  Join
                </JoinBtn>
              )}
            </LinkRow>
          </Section>
        )}

        {/* Notes - Sticky note style */}
        <Section>
          <SectionLabel>Notes</SectionLabel>
          <NoteArea>
            <NoteTextarea placeholder="Add notes, links, groceries, reminders..."
              value={notes} onChange={e => handleNotesChange(e.target.value)} />
            <MascotWriter $writing={isWriting}>
              <CalmlyMascot mood={isWriting ? "happy" : "calm"} size={28} message="" />
            </MascotWriter>
          </NoteArea>
          <NoteHint>
            <span style={{ fontSize: 12 }}>📝</span> Your mascot takes notes with you
          </NoteHint>
        </Section>

        {/* Footer */}
        <FooterRow>
          <DeleteBtn onClick={onDelete}>Delete</DeleteBtn>
          <SaveBtn onClick={handleSave}>Save Changes</SaveBtn>
        </FooterRow>
      </Panel>
    </Overlay>
  );
}

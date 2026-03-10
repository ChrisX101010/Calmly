"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import styled, { keyframes } from "styled-components";
import CalmlyMascot, { MascotMood } from "./CalmlyMascot";
import { playSound } from "@/utils/sounds";

// ── Types ──
export interface ToastData {
  id: string;
  mood: MascotMood;
  message: string;
  sound?: Parameters<typeof playSound>[0];
  duration?: number;
}

interface ToastContextType {
  showToast: (mood: MascotMood, message: string, sound?: Parameters<typeof playSound>[0]) => void;
}

// ── Messages for different scenarios ──
const TASK_CREATED_MESSAGES = [
  "New task? You got this!",
  "Added! You're on a roll~",
  "Noted! Purr-fect planning!",
  "One more thing to conquer!",
  "Mew! Great addition!",
];

const TASK_DELETED_MESSAGES = [
  "Done and dusted!",
  "One less thing to worry about~",
  "Poof! It's gone!",
  "Cleaned up nicely!",
  "Less clutter, more calm~",
];

const TASK_EDITED_MESSAGES = [
  "Updated! Looking good~",
  "Nice tweak!",
  "Polished and purr-fect!",
];

const DRAG_DROP_MESSAGES = [
  "Swoosh! Rearranged!",
  "New spot, who dis?",
  "Shuffled like a pro!",
  "Moved with grace~",
];

const OVERDUE_MESSAGES = [
  "Oh no... this was due already!",
  "This one slipped by...",
  "Don't forget about this one!",
  "It's overdue... let's catch up!",
];

const DUE_TODAY_MESSAGES = [
  "Heads up! Tasks due today~",
  "Today's the day!",
  "Keep calm, you have time!",
  "A few things on today's plate~",
];

const IMPORT_MESSAGES = [
  "Tasks imported! Let's go!",
  "All loaded up! Exciting!",
  "Imported purr-fectly!",
];

const EXPORT_MESSAGES = [
  "Exported! All safe~",
  "Backed up like a pro!",
  "Your tasks are ready to go!",
];

const ERROR_MESSAGES = [
  "Hmm, something went wrong...",
  "Oops! Let's try that again.",
  "That didn't work... grr!",
];

const WELCOME_MESSAGES = [
  "Welcome back! Let's plan~",
  "Hey there! Ready to be productive?",
  "Meow! Good to see you!",
  "Another day, another adventure!",
];

export function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

export const SCENARIO_MESSAGES = {
  taskCreated: TASK_CREATED_MESSAGES,
  taskDeleted: TASK_DELETED_MESSAGES,
  taskEdited: TASK_EDITED_MESSAGES,
  dragDrop: DRAG_DROP_MESSAGES,
  overdue: OVERDUE_MESSAGES,
  dueToday: DUE_TODAY_MESSAGES,
  importSuccess: IMPORT_MESSAGES,
  exportSuccess: EXPORT_MESSAGES,
  error: ERROR_MESSAGES,
  welcome: WELCOME_MESSAGES,
};

// ── Animations ──
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(80px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(80px) scale(0.8);
  }
`;

// ── Styled ──
const ToastContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column-reverse;
  gap: 10px;
  pointer-events: none;
`;

const ToastItem = styled.div<{ $exiting: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 16px;
  padding: 12px 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  pointer-events: auto;
  cursor: pointer;
  animation: ${(p) => (p.$exiting ? slideOut : slideIn)} 0.35s ease both;
  max-width: 340px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

// ── Component ──
export default function ToastSystem({
  toastRef,
}: {
  toastRef: React.MutableRefObject<((mood: MascotMood, message: string, sound?: Parameters<typeof playSound>[0]) => void) | null>;
}) {
  const [toasts, setToasts] = useState<(ToastData & { exiting?: boolean })[]>([]);

  const showToast = useCallback(
    (mood: MascotMood, message: string, sound?: Parameters<typeof playSound>[0]) => {
      const id = Math.random().toString(36).slice(2, 8);
      const newToast: ToastData = { id, mood, message, sound };

      if (sound) {
        playSound(sound);
      }

      setToasts((prev) => [...prev.slice(-2), newToast]); // max 3 visible

      // Auto-dismiss after 3.5s
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
        );
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 350);
      }, 3500);
    },
    []
  );

  // Expose showToast to parent
  useEffect(() => {
    toastRef.current = showToast;
  }, [showToast, toastRef]);

  const dismiss = (id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 350);
  };

  if (toasts.length === 0) return null;

  return (
    <ToastContainer>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          $exiting={!!toast.exiting}
          onClick={() => dismiss(toast.id)}
        >
          <CalmlyMascot mood={toast.mood} size={40} message="" />
          <span style={{ fontSize: 13, fontWeight: 500, color: "#E2E8F0", lineHeight: 1.4 }}>
            {toast.message}
          </span>
        </ToastItem>
      ))}
    </ToastContainer>
  );
}

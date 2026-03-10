"use client";

import React from "react";
import styled, { keyframes, css } from "styled-components";

export type MascotMood =
  | "happy"      // task created, import success
  | "calm"       // default, before meetings, plenty of time
  | "sleepy"     // empty day, weekend
  | "excited"    // drag drop, export
  | "worried"    // task due today
  | "sad"        // missed/overdue task
  | "annoyed"    // error, failed action
  | "love"       // welcome back
  | "proud";     // task completed/deleted

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  message?: string;
}

const MOOD_DATA: Record<MascotMood, { emoji: string; color: string; label: string }> = {
  happy:    { emoji: "^", color: "#10B981", label: "Mew! Nice one!" },
  calm:     { emoji: "~", color: "#6366F1", label: "Take it easy~" },
  sleepy:   { emoji: "-", color: "#94A3B8", label: "Zzz..." },
  excited:  { emoji: ">", color: "#F59E0B", label: "Woohoo!" },
  worried:  { emoji: "o", color: "#F97316", label: "Hmm, check this..." },
  sad:      { emoji: "v", color: "#EF4444", label: "Oh no..." },
  annoyed:  { emoji: "x", color: "#DC2626", label: "Grr..." },
  love:     { emoji: "u", color: "#EC4899", label: "Welcome back!" },
  proud:    { emoji: "^", color: "#8B5CF6", label: "Well done!" },
};

// ── Animations ──
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;

const wiggle = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-6deg); }
  75% { transform: rotate(6deg); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  40% { transform: translateY(-8px) scale(1.05); }
  60% { transform: translateY(-3px) scale(1.02); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-3px); }
  40% { transform: translateX(3px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
`;

const sleepyBob = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  30% { transform: translateY(2px) rotate(-3deg); }
  70% { transform: translateY(1px) rotate(2deg); }
`;

const tailWag = keyframes`
  0%, 100% { transform: rotate(-15deg); }
  50% { transform: rotate(15deg); }
`;

const getMoodAnimation = (mood: MascotMood) => {
  switch (mood) {
    case "happy":
    case "proud":
      return css`animation: ${bounce} 0.8s ease infinite;`;
    case "calm":
    case "love":
      return css`animation: ${float} 2.5s ease-in-out infinite;`;
    case "sleepy":
      return css`animation: ${sleepyBob} 3s ease-in-out infinite;`;
    case "excited":
      return css`animation: ${wiggle} 0.4s ease-in-out infinite;`;
    case "worried":
      return css`animation: ${pulse} 1.2s ease-in-out infinite;`;
    case "sad":
      return css`animation: ${float} 3s ease-in-out infinite;`;
    case "annoyed":
      return css`animation: ${shake} 0.5s ease-in-out infinite;`;
    default:
      return css`animation: ${float} 2.5s ease-in-out infinite;`;
  }
};

// ── Styled ──
const Wrapper = styled.div<{ $mood: MascotMood }>`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  ${(p) => getMoodAnimation(p.$mood)}
`;

const CatFace = styled.div<{ $size: number; $color: string }>`
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  position: relative;
  filter: drop-shadow(0 2px 8px ${(p) => p.$color}33);
`;

const Message = styled.div<{ $color: string }>`
  font-size: 11px;
  font-weight: 600;
  color: ${(p) => p.$color};
  text-align: center;
  white-space: nowrap;
  letter-spacing: -0.01em;
`;

const Tail = styled.div<{ $color: string }>`
  position: absolute;
  bottom: 2px;
  right: -4px;
  width: 14px;
  height: 8px;
  border-bottom: 2.5px solid ${(p) => p.$color};
  border-right: 2.5px solid ${(p) => p.$color};
  border-radius: 0 0 12px 0;
  animation: ${tailWag} 1s ease-in-out infinite;
  transform-origin: left center;
`;

export default function CalmlyMascot({ mood = "calm", size = 48, message }: MascotProps) {
  const data = MOOD_DATA[mood];
  const displayMessage = message || data.label;

  // Eye style based on mood
  const getEyes = () => {
    switch (mood) {
      case "happy":
      case "proud":
        return { left: "^  ^", style: "happy" };
      case "sleepy":
        return { left: "-  -", style: "closed" };
      case "excited":
        return { left: "*  *", style: "star" };
      case "worried":
        return { left: "o  o", style: "wide" };
      case "sad":
        return { left: ";  ;", style: "tear" };
      case "annoyed":
        return { left: ">  <", style: "squint" };
      case "love":
        return { left: "u  u", style: "love" };
      case "calm":
      default:
        return { left: ".  .", style: "normal" };
    }
  };

  const getMouth = () => {
    switch (mood) {
      case "happy":
      case "excited":
      case "proud":
        return "w";
      case "sad":
        return "n";
      case "annoyed":
        return "~";
      case "worried":
        return "o";
      case "sleepy":
        return "z";
      case "love":
        return "3";
      case "calm":
      default:
        return "w";
    }
  };

  const eyes = getEyes();
  const mouth = getMouth();
  const s = size;

  return (
    <Wrapper $mood={mood}>
      <CatFace $size={s} $color={data.color}>
        <svg viewBox="0 0 64 64" width={s} height={s}>
          {/* Ears */}
          <polygon
            points="10,28 6,8 22,22"
            fill={data.color}
            opacity="0.9"
          />
          <polygon
            points="54,28 58,8 42,22"
            fill={data.color}
            opacity="0.9"
          />
          {/* Inner ears */}
          <polygon
            points="12,26 9,12 20,22"
            fill={`${data.color}55`}
          />
          <polygon
            points="52,26 55,12 44,22"
            fill={`${data.color}55`}
          />
          {/* Head */}
          <ellipse cx="32" cy="36" rx="22" ry="20" fill={data.color} opacity="0.15" />
          <ellipse cx="32" cy="36" rx="22" ry="20" fill="none" stroke={data.color} strokeWidth="2.5" />

          {/* Eyes */}
          {mood === "happy" || mood === "proud" ? (
            <>
              <path d="M20,33 Q23,29 26,33" fill="none" stroke={data.color} strokeWidth="2.5" strokeLinecap="round" />
              <path d="M38,33 Q41,29 44,33" fill="none" stroke={data.color} strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : mood === "sleepy" ? (
            <>
              <line x1="19" y1="33" x2="27" y2="33" stroke={data.color} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="37" y1="33" x2="45" y2="33" stroke={data.color} strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : mood === "sad" ? (
            <>
              <circle cx="23" cy="33" r="2.5" fill={data.color} />
              <circle cx="41" cy="33" r="2.5" fill={data.color} />
              {/* Tears */}
              <ellipse cx="20" cy="38" rx="1.2" ry="2" fill={`${data.color}66`} />
              <ellipse cx="44" cy="38" rx="1.2" ry="2" fill={`${data.color}66`} />
            </>
          ) : mood === "annoyed" ? (
            <>
              <path d="M19,31 L27,34" fill="none" stroke={data.color} strokeWidth="2.5" strokeLinecap="round" />
              <path d="M45,31 L37,34" fill="none" stroke={data.color} strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : mood === "worried" ? (
            <>
              <circle cx="23" cy="33" r="3.5" fill="none" stroke={data.color} strokeWidth="2" />
              <circle cx="23" cy="33" r="1.5" fill={data.color} />
              <circle cx="41" cy="33" r="3.5" fill="none" stroke={data.color} strokeWidth="2" />
              <circle cx="41" cy="33" r="1.5" fill={data.color} />
            </>
          ) : mood === "excited" ? (
            <>
              {/* Star eyes */}
              <text x="18" y="37" fontSize="10" fill={data.color} fontWeight="bold">*</text>
              <text x="38" y="37" fontSize="10" fill={data.color} fontWeight="bold">*</text>
            </>
          ) : mood === "love" ? (
            <>
              <path d="M20,32 Q23,28 23,31 Q23,28 26,32 Q23,36 20,32Z" fill={data.color} opacity="0.8" />
              <path d="M38,32 Q41,28 41,31 Q41,28 44,32 Q41,36 38,32Z" fill={data.color} opacity="0.8" />
            </>
          ) : (
            <>
              <circle cx="23" cy="33" r="2.5" fill={data.color} />
              <circle cx="41" cy="33" r="2.5" fill={data.color} />
            </>
          )}

          {/* Nose */}
          <ellipse cx="32" cy="39" rx="2" ry="1.5" fill={data.color} opacity="0.6" />

          {/* Mouth */}
          {mood === "sad" ? (
            <path d="M27,43 Q32,40 37,43" fill="none" stroke={data.color} strokeWidth="1.5" strokeLinecap="round" />
          ) : mood === "annoyed" ? (
            <path d="M27,43 Q32,42 37,43" fill="none" stroke={data.color} strokeWidth="1.5" strokeLinecap="round" />
          ) : mood === "worried" ? (
            <ellipse cx="32" cy="43" rx="3" ry="2" fill="none" stroke={data.color} strokeWidth="1.5" />
          ) : (
            <path d="M27,42 Q29.5,46 32,42 Q34.5,46 37,42" fill="none" stroke={data.color} strokeWidth="1.5" strokeLinecap="round" />
          )}

          {/* Whiskers */}
          <line x1="6" y1="36" x2="17" y2="38" stroke={data.color} strokeWidth="1" opacity="0.4" />
          <line x1="6" y1="40" x2="17" y2="40" stroke={data.color} strokeWidth="1" opacity="0.4" />
          <line x1="47" y1="38" x2="58" y2="36" stroke={data.color} strokeWidth="1" opacity="0.4" />
          <line x1="47" y1="40" x2="58" y2="40" stroke={data.color} strokeWidth="1" opacity="0.4" />

          {/* Blush for happy/love/proud */}
          {(mood === "happy" || mood === "love" || mood === "proud") && (
            <>
              <ellipse cx="16" cy="38" rx="4" ry="2.5" fill={data.color} opacity="0.12" />
              <ellipse cx="48" cy="38" rx="4" ry="2.5" fill={data.color} opacity="0.12" />
            </>
          )}

          {/* Z's for sleepy */}
          {mood === "sleepy" && (
            <>
              <text x="46" y="22" fontSize="8" fill={data.color} opacity="0.5" fontWeight="bold">z</text>
              <text x="52" y="16" fontSize="6" fill={data.color} opacity="0.35" fontWeight="bold">z</text>
              <text x="56" y="11" fontSize="5" fill={data.color} opacity="0.2" fontWeight="bold">z</text>
            </>
          )}

          {/* Sparkles for excited */}
          {mood === "excited" && (
            <>
              <text x="4" y="18" fontSize="7" fill={data.color} opacity="0.6">+</text>
              <text x="52" y="14" fontSize="6" fill={data.color} opacity="0.5">+</text>
              <text x="30" y="14" fontSize="5" fill={data.color} opacity="0.4">+</text>
            </>
          )}

          {/* Hearts for love */}
          {mood === "love" && (
            <>
              <text x="4" y="18" fontSize="8" fill={data.color} opacity="0.5">&#9829;</text>
              <text x="50" y="20" fontSize="6" fill={data.color} opacity="0.4">&#9829;</text>
            </>
          )}
        </svg>
      </CatFace>
      <Message $color={data.color}>{displayMessage}</Message>
    </Wrapper>
  );
}

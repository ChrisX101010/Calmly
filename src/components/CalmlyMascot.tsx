"use client";

import React from "react";
import styled, { keyframes, css } from "styled-components";

export type MascotMood =
  | "happy" | "calm" | "sleepy" | "excited" | "worried"
  | "sad" | "annoyed" | "love" | "proud" | "judging"
  | "empathy" | "dance" | "cheer";

export type HolidayAccessory =
  | "santa-hat" | "party-hat" | "bunny-ears" | "hearts" | "witch-hat"
  | "flag" | "hardhat" | "pilgrim-hat" | "flower-crown" | "tie" | "bow" | null;

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  message?: string;
  accessory?: HolidayAccessory;
  accentColor?: string;
}

const MOOD_DATA: Record<MascotMood, { color: string; label: string }> = {
  happy:    { color: "#10B981", label: "Mew! Nice one!" },
  calm:     { color: "#6366F1", label: "Take it easy~" },
  sleepy:   { color: "#94A3B8", label: "Zzz..." },
  excited:  { color: "#F59E0B", label: "Woohoo!" },
  worried:  { color: "#F97316", label: "Hmm, check this..." },
  sad:      { color: "#EF4444", label: "Oh no..." },
  annoyed:  { color: "#DC2626", label: "Grr..." },
  love:     { color: "#EC4899", label: "Awww~" },
  proud:    { color: "#8B5CF6", label: "Well done!" },
  judging:  { color: "#F97316", label: "..." },
  empathy:  { color: "#6366F1", label: "I'm here for you" },
  dance:    { color: "#F59E0B", label: "Let's go!" },
  cheer:    { color: "#10B981", label: "You got this!" },
};

// Animations
const float = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}`;
const wiggle = keyframes`0%,100%{transform:rotate(0)}25%{transform:rotate(-6deg)}75%{transform:rotate(6deg)}`;
const bounce = keyframes`0%,100%{transform:translateY(0) scale(1)}40%{transform:translateY(-8px) scale(1.05)}`;
const shake = keyframes`0%,100%{transform:translateX(0)}20%{transform:translateX(-3px)}40%{transform:translateX(3px)}60%{transform:translateX(-2px)}80%{transform:translateX(2px)}`;
const pulse = keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.08)}`;
const sleepyBob = keyframes`0%,100%{transform:translateY(0) rotate(0)}30%{transform:translateY(2px) rotate(-3deg)}70%{transform:translateY(1px) rotate(2deg)}`;
const danceMoves = keyframes`0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-6px) rotate(-5deg)}50%{transform:translateY(0) rotate(0)}75%{transform:translateY(-6px) rotate(5deg)}`;
const cheerBounce = keyframes`0%,100%{transform:translateY(0) scale(1)}25%{transform:translateY(-10px) scale(1.05)}50%{transform:translateY(0) scale(1)}75%{transform:translateY(-5px) scale(1.02)}`;

const getMoodAnim = (m: MascotMood) => {
  switch(m) {
    case "happy": case "proud": return css`animation:${bounce} .8s ease infinite;`;
    case "calm": case "love": case "empathy": return css`animation:${float} 2.5s ease-in-out infinite;`;
    case "sleepy": return css`animation:${sleepyBob} 3s ease-in-out infinite;`;
    case "excited": return css`animation:${wiggle} .4s ease-in-out infinite;`;
    case "worried": case "judging": return css`animation:${pulse} 1.2s ease-in-out infinite;`;
    case "sad": return css`animation:${float} 3s ease-in-out infinite;`;
    case "annoyed": return css`animation:${shake} .5s ease-in-out infinite;`;
    case "dance": return css`animation:${danceMoves} .6s ease-in-out infinite;`;
    case "cheer": return css`animation:${cheerBounce} .7s ease-in-out infinite;`;
    default: return css`animation:${float} 2.5s ease-in-out infinite;`;
  }
};

const Wrapper = styled.div<{$mood:MascotMood}>`
  display:inline-flex;flex-direction:column;align-items:center;gap:6px;
  ${p => getMoodAnim(p.$mood)}
`;
const Message = styled.div<{$color:string}>`
  font-size:11px;font-weight:600;color:${p => p.$color};text-align:center;white-space:nowrap;letter-spacing:-0.01em;
`;

// Holiday accessory SVG overlays
function AccessoryOverlay({ type, color }: { type: HolidayAccessory; color: string }) {
  if (!type) return null;
  switch(type) {
    case "santa-hat":
      return (
        <g>
          <path d="M12,28 Q32,-5 52,28" fill="#DC2626" stroke="#B91C1C" strokeWidth="1"/>
          <ellipse cx="32" cy="28" rx="24" ry="4" fill="white" opacity="0.9"/>
          <circle cx="50" cy="2" r="5" fill="white"/>
        </g>
      );
    case "party-hat":
      return (
        <g>
          <path d="M22,28 L32,0 L42,28" fill={color} opacity="0.8"/>
          <circle cx="32" cy="0" r="3" fill="#FBBF24"/>
          <line x1="28" y1="10" x2="36" y2="10" stroke="white" strokeWidth="1.5" opacity="0.5"/>
          <line x1="26" y1="18" x2="38" y2="18" stroke="white" strokeWidth="1.5" opacity="0.5"/>
        </g>
      );
    case "bunny-ears":
      return (
        <g>
          <ellipse cx="18" cy="10" rx="5" ry="14" fill="#F9A8D4" stroke="#EC4899" strokeWidth="1" transform="rotate(-10 18 10)"/>
          <ellipse cx="46" cy="10" rx="5" ry="14" fill="#F9A8D4" stroke="#EC4899" strokeWidth="1" transform="rotate(10 46 10)"/>
          <ellipse cx="18" cy="10" rx="3" ry="10" fill="#FDF2F8" transform="rotate(-10 18 10)"/>
          <ellipse cx="46" cy="10" rx="3" ry="10" fill="#FDF2F8" transform="rotate(10 46 10)"/>
        </g>
      );
    case "hearts":
      return (
        <g>
          <text x="5" y="15" fontSize="8" fill="#EC4899" opacity="0.7">&#9829;</text>
          <text x="50" y="12" fontSize="6" fill="#F43F5E" opacity="0.6">&#9829;</text>
          <text x="28" y="5" fontSize="5" fill="#FB7185" opacity="0.5">&#9829;</text>
        </g>
      );
    case "witch-hat":
      return (
        <g>
          <path d="M18,28 L32,-2 L46,28" fill="#7C3AED"/>
          <ellipse cx="32" cy="28" rx="22" ry="4" fill="#7C3AED"/>
          <rect x="29" y="10" width="6" height="3" rx="1" fill="#F59E0B"/>
        </g>
      );
    case "flower-crown":
      return (
        <g>
          <circle cx="15" cy="25" r="4" fill="#EC4899" opacity="0.8"/>
          <circle cx="25" cy="22" r="3.5" fill="#F9A8D4"/>
          <circle cx="32" cy="20" r="4" fill="#EC4899" opacity="0.8"/>
          <circle cx="39" cy="22" r="3.5" fill="#F9A8D4"/>
          <circle cx="49" cy="25" r="4" fill="#EC4899" opacity="0.8"/>
          <circle cx="15" cy="25" r="2" fill="#FBBF24"/>
          <circle cx="32" cy="20" r="2" fill="#FBBF24"/>
          <circle cx="49" cy="25" r="2" fill="#FBBF24"/>
        </g>
      );
    case "hardhat":
      return (
        <g>
          <ellipse cx="32" cy="26" rx="20" ry="8" fill="#F59E0B"/>
          <rect x="16" y="18" width="32" height="10" rx="3" fill="#FBBF24"/>
        </g>
      );
    case "bow":
    default:
      return (
        <g>
          <path d="M25,26 Q20,20 25,22 L32,26 L39,22 Q44,20 39,26 Z" fill={color} opacity="0.7"/>
          <circle cx="32" cy="26" r="2" fill={color}/>
        </g>
      );
  }
}

export default function CalmlyMascot({ mood = "calm", size = 48, message, accessory = null, accentColor }: MascotProps) {
  const data = MOOD_DATA[mood];
  const color = accentColor || data.color;
  const displayMessage = message || data.label;

  return (
    <Wrapper $mood={mood}>
      <svg viewBox="0 0 64 64" width={size} height={size}>
        {/* Ears */}
        <polygon points="10,28 6,8 22,22" fill={color} opacity="0.9"/>
        <polygon points="54,28 58,8 42,22" fill={color} opacity="0.9"/>
        <polygon points="12,26 9,12 20,22" fill={`${color}55`}/>
        <polygon points="52,26 55,12 44,22" fill={`${color}55`}/>

        {/* Head */}
        <ellipse cx="32" cy="36" rx="22" ry="20" fill={color} opacity="0.15"/>
        <ellipse cx="32" cy="36" rx="22" ry="20" fill="none" stroke={color} strokeWidth="2.5"/>

        {/* Eyes */}
        {(mood === "happy" || mood === "proud" || mood === "cheer") ? (
          <>
            <path d="M20,33 Q23,29 26,33" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M38,33 Q41,29 44,33" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
          </>
        ) : mood === "sleepy" ? (
          <>
            <line x1="19" y1="33" x2="27" y2="33" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="37" y1="33" x2="45" y2="33" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
          </>
        ) : (mood === "sad" || mood === "empathy") ? (
          <>
            <circle cx="23" cy="33" r="2.5" fill={color}/>
            <circle cx="41" cy="33" r="2.5" fill={color}/>
            <ellipse cx="20" cy="38" rx="1.2" ry="2" fill={`${color}66`}/>
            <ellipse cx="44" cy="38" rx="1.2" ry="2" fill={`${color}66`}/>
          </>
        ) : mood === "annoyed" ? (
          <>
            <path d="M19,31 L27,34" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M45,31 L37,34" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
          </>
        ) : (mood === "worried" || mood === "judging") ? (
          <>
            <circle cx="23" cy="33" r="3.5" fill="none" stroke={color} strokeWidth="2"/>
            <circle cx="23" cy="33" r="1.5" fill={color}/>
            <circle cx="41" cy="33" r="3.5" fill="none" stroke={color} strokeWidth="2"/>
            <circle cx="41" cy="33" r="1.5" fill={color}/>
            {mood === "judging" && <>
              <path d="M18,28 L28,30" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M46,28 L36,30" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
            </>}
          </>
        ) : (mood === "excited" || mood === "dance") ? (
          <>
            <text x="18" y="37" fontSize="10" fill={color} fontWeight="bold">*</text>
            <text x="38" y="37" fontSize="10" fill={color} fontWeight="bold">*</text>
          </>
        ) : mood === "love" ? (
          <>
            <path d="M20,32 Q23,28 23,31 Q23,28 26,32 Q23,36 20,32Z" fill={color} opacity="0.8"/>
            <path d="M38,32 Q41,28 41,31 Q41,28 44,32 Q41,36 38,32Z" fill={color} opacity="0.8"/>
          </>
        ) : (
          <>
            <circle cx="23" cy="33" r="2.5" fill={color}/>
            <circle cx="41" cy="33" r="2.5" fill={color}/>
          </>
        )}

        {/* Nose */}
        <ellipse cx="32" cy="39" rx="2" ry="1.5" fill={color} opacity="0.6"/>

        {/* Mouth */}
        {(mood === "sad" || mood === "empathy") ? (
          <path d="M27,43 Q32,40 37,43" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        ) : mood === "annoyed" ? (
          <path d="M27,43 Q32,42 37,43" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        ) : (mood === "worried" || mood === "judging") ? (
          <ellipse cx="32" cy="43" rx="3" ry="2" fill="none" stroke={color} strokeWidth="1.5"/>
        ) : mood === "love" ? (
          <path d="M29,42 Q32,45 35,42" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        ) : (
          <path d="M27,42 Q29.5,46 32,42 Q34.5,46 37,42" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        )}

        {/* Whiskers */}
        <line x1="6" y1="36" x2="17" y2="38" stroke={color} strokeWidth="1" opacity="0.4"/>
        <line x1="6" y1="40" x2="17" y2="40" stroke={color} strokeWidth="1" opacity="0.4"/>
        <line x1="47" y1="38" x2="58" y2="36" stroke={color} strokeWidth="1" opacity="0.4"/>
        <line x1="47" y1="40" x2="58" y2="40" stroke={color} strokeWidth="1" opacity="0.4"/>

        {/* Blush */}
        {(mood === "happy" || mood === "love" || mood === "proud" || mood === "cheer") && (
          <>
            <ellipse cx="16" cy="38" rx="4" ry="2.5" fill={color} opacity="0.12"/>
            <ellipse cx="48" cy="38" rx="4" ry="2.5" fill={color} opacity="0.12"/>
          </>
        )}

        {/* Sleepy Z's */}
        {mood === "sleepy" && <>
          <text x="46" y="22" fontSize="8" fill={color} opacity="0.5" fontWeight="bold">z</text>
          <text x="52" y="16" fontSize="6" fill={color} opacity="0.35" fontWeight="bold">z</text>
        </>}

        {/* Sparkles for excited/dance */}
        {(mood === "excited" || mood === "dance") && <>
          <text x="4" y="18" fontSize="7" fill={color} opacity="0.6">+</text>
          <text x="52" y="14" fontSize="6" fill={color} opacity="0.5">+</text>
        </>}

        {/* Hearts for love */}
        {mood === "love" && <>
          <text x="4" y="18" fontSize="8" fill={color} opacity="0.5">&#9829;</text>
          <text x="50" y="20" fontSize="6" fill={color} opacity="0.4">&#9829;</text>
        </>}

        {/* Holiday accessory */}
        <AccessoryOverlay type={accessory} color={color} />
      </svg>
      {displayMessage && <Message $color={color}>{displayMessage}</Message>}
    </Wrapper>
  );
}

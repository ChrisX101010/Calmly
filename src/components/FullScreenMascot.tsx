"use client";

import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { playSound, SoundType } from "@/utils/sounds";

export type FullScreenScenario =
  | "approaching"   // Meeting coming up - calm, big eyes, gentle
  | "now"           // Meeting is NOW - wide alert eyes, urgent
  | "late"          // You're late! - annoyed squinty eyes
  | "missed"        // Meeting missed - sad droopy eyes, tears
  | "recap"         // Came back after missing - sassy annoyed
  | null;

interface Props {
  scenario: FullScreenScenario;
  taskName?: string;
  timeInfo?: string;
  onDismiss: () => void;
  soundEnabled?: boolean;
}

// -- Animations --
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;
const popIn = keyframes`
  0% { transform: scale(0.3) translateY(60px); opacity: 0; }
  60% { transform: scale(1.08) translateY(-10px); opacity: 1; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
`;
const gentleFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
`;
const shake = keyframes`
  0%, 100% { transform: translateX(0) rotate(0); }
  15% { transform: translateX(-8px) rotate(-2deg); }
  30% { transform: translateX(8px) rotate(2deg); }
  45% { transform: translateX(-6px) rotate(-1deg); }
  60% { transform: translateX(6px) rotate(1deg); }
  75% { transform: translateX(-3px) rotate(0); }
`;
const bounce = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  30% { transform: translateY(-20px) scale(1.02); }
  50% { transform: translateY(-10px) scale(1.01); }
`;
const tailSwing = keyframes`
  0%, 100% { transform: rotate(-20deg); }
  50% { transform: rotate(20deg); }
`;
const earWiggle = keyframes`
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(-8deg); }
  75% { transform: rotate(8deg); }
`;
const blink = keyframes`
  0%, 90%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.05); }
`;
const tearDrop = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(30px); opacity: 0; }
`;
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 40px rgba(99,102,241,0.1); }
  50% { box-shadow: 0 0 80px rgba(99,102,241,0.25); }
`;
const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
`;

// -- Scenario configs --
const SCENARIOS = {
  approaching: {
    bg: "radial-gradient(ellipse at 50% 40%, #1a1f4e 0%, #0d1117 70%)",
    catColor: "#818CF8",
    catBg: "rgba(99,102,241,0.08)",
    title: "Meeting Approaching",
    subtitle: "Keep calm, you have time~",
    buttonText: "Got it!",
    buttonColor: "#6366F1",
    sound: "meetingApproaching" as SoundType,
    animation: gentleFloat,
    particles: "stars",
  },
  now: {
    bg: "radial-gradient(ellipse at 50% 40%, #1e3a2f 0%, #0d1117 70%)",
    catColor: "#34D399",
    catBg: "rgba(52,211,153,0.08)",
    title: "Meeting Starting NOW!",
    subtitle: "Time to join!",
    buttonText: "On my way!",
    buttonColor: "#10B981",
    sound: "meetingNow" as SoundType,
    animation: bounce,
    particles: "exclamation",
  },
  late: {
    bg: "radial-gradient(ellipse at 50% 40%, #3d1f1f 0%, #0d1117 70%)",
    catColor: "#F97316",
    catBg: "rgba(249,115,22,0.08)",
    title: "You're Late!",
    subtitle: "Hurry up, they're waiting!",
    buttonText: "Rushing now!",
    buttonColor: "#F97316",
    sound: "meetingLate" as SoundType,
    animation: shake,
    particles: "sweat",
  },
  missed: {
    bg: "radial-gradient(ellipse at 50% 40%, #2d1a2e 0%, #0d1117 70%)",
    catColor: "#EF4444",
    catBg: "rgba(239,68,68,0.08)",
    title: "Meeting Missed",
    subtitle: "Oh no... it's already over",
    buttonText: "I know...",
    buttonColor: "#EF4444",
    sound: "meetingMissed" as SoundType,
    animation: gentleFloat,
    particles: "tears",
  },
  recap: {
    bg: "radial-gradient(ellipse at 50% 40%, #2a2215 0%, #0d1117 70%)",
    catColor: "#F59E0B",
    catBg: "rgba(245,158,11,0.08)",
    title: "Where Were You?",
    subtitle: "You missed something important...",
    buttonText: "Sorry, I'm here now",
    buttonColor: "#F59E0B",
    sound: "meetingLate" as SoundType,
    animation: shake,
    particles: "question",
  },
};

// -- Styled --
const Overlay = styled.div<{ $bg: string; $exiting: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.$bg};
  animation: ${(p) => (p.$exiting ? fadeOut : fadeIn)} 0.5s ease both;
  overflow: hidden;
  cursor: default;
  font-family: 'DM Sans', sans-serif;
`;

const CatContainer = styled.div<{ $anim: ReturnType<typeof keyframes> }>`
  animation: ${popIn} 0.6s ease both, ${(p) => p.$anim} 2.5s ease-in-out 0.6s infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const CatSVG = styled.div`
  position: relative;
  width: 280px;
  height: 280px;
  filter: drop-shadow(0 20px 60px rgba(0,0,0,0.5));
  @media(max-width:480px){width:180px;height:180px;}
`;

const Title = styled.h1<{ $color: string }>`
  font-size: 32px;
  font-weight: 800;
  color: ${(p) => p.$color};
  text-align: center;
  letter-spacing: -0.02em;
  margin: 0;
  text-shadow: 0 2px 20px ${(p) => p.$color}44;
  @media(max-width:480px){font-size:22px;}
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #94A3B8;
  text-align: center;
  margin: 0;
  font-weight: 500;
  @media(max-width:480px){font-size:13px;}
`;

const TaskName = styled.div<{ $color: string }>`
  font-size: 18px;
  font-weight: 700;
  color: ${(p) => p.$color};
  background: ${(p) => p.$color}15;
  border: 1px solid ${(p) => p.$color}30;
  border-radius: 12px;
  padding: 10px 24px;
  text-align: center;
  max-width: 400px;
  @media(max-width:480px){font-size:14px;padding:8px 16px;max-width:280px;}
`;

const TimeInfo = styled.div`
  font-size: 14px;
  color: #64748B;
  font-weight: 600;
  @media(max-width:480px){font-size:12px;}
`;

const DismissBtn = styled.button<{ $color: string }>`
  margin-top: 12px;
  padding: 14px 40px;
  border-radius: 14px;
  border: none;
  background: ${(p) => p.$color};
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
  animation: ${pulseGlow} 2s ease-in-out infinite;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 30px ${(p) => p.$color}55;
  }

  @media(max-width:480px){padding:12px 32px;font-size:14px;}
`;

// Particle elements
const Star = styled.div<{ $x: number; $y: number; $delay: number; $color: string }>`
  position: absolute;
  left: ${(p) => p.$x}%;
  top: ${(p) => p.$y}%;
  width: 4px;
  height: 4px;
  background: ${(p) => p.$color};
  border-radius: 50%;
  animation: ${sparkle} ${() => 1.5 + Math.random() * 2}s ease-in-out ${(p) => p.$delay}s infinite;
`;

const FloatingText = styled.div<{ $x: number; $y: number; $delay: number; $color: string; $size: number }>`
  position: absolute;
  left: ${(p) => p.$x}%;
  top: ${(p) => p.$y}%;
  font-size: ${(p) => p.$size}px;
  color: ${(p) => p.$color};
  opacity: 0.3;
  animation: ${sparkle} ${() => 2 + Math.random() * 3}s ease-in-out ${(p) => p.$delay}s infinite;
  pointer-events: none;
`;

// -- Cat Face SVG for each scenario --
function CatFace({ scenario, color }: { scenario: string; color: string }) {
  const lightColor = color + "40";

  // Eyes based on scenario
  const renderEyes = () => {
    switch (scenario) {
      case "approaching":
        // Big calm round eyes with sparkles
        return (
          <>
            <ellipse cx="95" cy="128" rx="28" ry="30" fill="white" />
            <ellipse cx="185" cy="128" rx="28" ry="30" fill="white" />
            <circle cx="100" cy="130" r="16" fill={color} />
            <circle cx="180" cy="130" r="16" fill={color} />
            <circle cx="100" cy="130" r="9" fill="#1a1a2e" />
            <circle cx="180" cy="130" r="9" fill="#1a1a2e" />
            {/* Sparkle highlights */}
            <circle cx="106" cy="122" r="5" fill="white" opacity="0.9" />
            <circle cx="186" cy="122" r="5" fill="white" opacity="0.9" />
            <circle cx="94" cy="134" r="3" fill="white" opacity="0.5" />
            <circle cx="174" cy="134" r="3" fill="white" opacity="0.5" />
          </>
        );
      case "now":
        // Wide alert eyes
        return (
          <>
            <ellipse cx="95" cy="125" rx="30" ry="34" fill="white" />
            <ellipse cx="185" cy="125" rx="30" ry="34" fill="white" />
            <circle cx="100" cy="128" r="18" fill={color} />
            <circle cx="180" cy="128" r="18" fill={color} />
            <circle cx="100" cy="128" r="10" fill="#1a1a2e" />
            <circle cx="180" cy="128" r="10" fill="#1a1a2e" />
            <circle cx="108" cy="118" r="6" fill="white" opacity="0.9" />
            <circle cx="188" cy="118" r="6" fill="white" opacity="0.9" />
            {/* Raised eyebrow lines */}
            <path d="M65,100 Q95,85 125,100" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M155,100 Q185,85 215,100" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
          </>
        );
      case "late":
        // Annoyed squinty eyes
        return (
          <>
            <ellipse cx="95" cy="128" rx="26" ry="16" fill="white" />
            <ellipse cx="185" cy="128" rx="26" ry="16" fill="white" />
            <circle cx="98" cy="130" r="12" fill={color} />
            <circle cx="182" cy="130" r="12" fill={color} />
            <circle cx="98" cy="130" r="7" fill="#1a1a2e" />
            <circle cx="182" cy="130" r="7" fill="#1a1a2e" />
            {/* Angry eyebrows */}
            <path d="M65,108 L125,118" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
            <path d="M215,108 L155,118" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
          </>
        );
      case "missed":
        // Big sad eyes with tears
        return (
          <>
            <ellipse cx="95" cy="132" rx="26" ry="28" fill="white" />
            <ellipse cx="185" cy="132" rx="26" ry="28" fill="white" />
            <circle cx="95" cy="136" r="14" fill={color} />
            <circle cx="185" cy="136" r="14" fill={color} />
            <circle cx="95" cy="136" r="8" fill="#1a1a2e" />
            <circle cx="185" cy="136" r="8" fill="#1a1a2e" />
            <circle cx="101" cy="128" r="5" fill="white" opacity="0.8" />
            <circle cx="191" cy="128" r="5" fill="white" opacity="0.8" />
            {/* Sad eyebrows */}
            <path d="M65,112 Q95,120 125,108" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M155,108 Q185,120 215,112" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
            {/* Tear drops */}
            <ellipse cx="70" cy="152" rx="4" ry="6" fill={color} opacity="0.6">
              <animate attributeName="cy" values="152;180;152" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="210" cy="152" rx="4" ry="6" fill={color} opacity="0.6">
              <animate attributeName="cy" values="152;180;152" dur="2.3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="2.3s" repeatCount="indefinite" />
            </ellipse>
          </>
        );
      case "recap":
        // Sassy side-eye
        return (
          <>
            <ellipse cx="95" cy="128" rx="26" ry="24" fill="white" />
            <ellipse cx="185" cy="128" rx="26" ry="24" fill="white" />
            <circle cx="104" cy="130" r="14" fill={color} />
            <circle cx="194" cy="130" r="14" fill={color} />
            <circle cx="104" cy="130" r="8" fill="#1a1a2e" />
            <circle cx="194" cy="130" r="8" fill="#1a1a2e" />
            <circle cx="108" cy="124" r="4" fill="white" opacity="0.8" />
            <circle cx="198" cy="124" r="4" fill="white" opacity="0.8" />
            {/* One raised eyebrow */}
            <path d="M65,108 Q95,100 125,112" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M155,112 Q185,100 215,108" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
          </>
        );
      default:
        return null;
    }
  };

  // Mouth based on scenario
  const renderMouth = () => {
    switch (scenario) {
      case "approaching":
        return <path d="M120,168 Q130,178 140,168 Q150,178 160,168" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />;
      case "now":
        return <ellipse cx="140" cy="172" rx="12" ry="8" fill="#1a1a2e" stroke={color} strokeWidth="2" />;
      case "late":
        return <path d="M120,175 Q140,168 160,175" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />;
      case "missed":
        return <path d="M120,178 Q140,168 160,178" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />;
      case "recap":
        return <path d="M125,172 Q140,168 155,172" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />;
      default:
        return null;
    }
  };

  return (
    <svg viewBox="0 0 280 280" width="280" height="280">
      {/* Ears */}
      <path d="M50,110 L30,25 L105,80 Z" fill={color} opacity="0.9">
        <animateTransform attributeName="transform" type="rotate" values="0 50 110;-5 50 110;0 50 110;3 50 110;0 50 110" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M230,110 L250,25 L175,80 Z" fill={color} opacity="0.9">
        <animateTransform attributeName="transform" type="rotate" values="0 230 110;5 230 110;0 230 110;-3 230 110;0 230 110" dur="3.2s" repeatCount="indefinite" />
      </path>
      {/* Inner ears */}
      <path d="M58,105 L42,40 L100,82 Z" fill={lightColor} />
      <path d="M222,105 L238,40 L180,82 Z" fill={lightColor} />

      {/* Head */}
      <ellipse cx="140" cy="145" rx="100" ry="90" fill={color} opacity="0.1" />
      <ellipse cx="140" cy="145" rx="100" ry="90" fill="none" stroke={color} strokeWidth="4" />

      {/* Cheek blush */}
      <ellipse cx="55" cy="155" rx="18" ry="10" fill={color} opacity="0.1" />
      <ellipse cx="225" cy="155" rx="18" ry="10" fill={color} opacity="0.1" />

      {/* Eyes */}
      {renderEyes()}

      {/* Nose */}
      <path d="M134,158 L140,164 L146,158 Z" fill={color} opacity="0.7" />

      {/* Mouth */}
      {renderMouth()}

      {/* Whiskers */}
      <line x1="20" y1="148" x2="70" y2="155" stroke={color} strokeWidth="2" opacity="0.3">
        <animate attributeName="y1" values="148;145;148" dur="3s" repeatCount="indefinite" />
      </line>
      <line x1="20" y1="165" x2="70" y2="165" stroke={color} strokeWidth="2" opacity="0.3" />
      <line x1="20" y1="180" x2="70" y2="175" stroke={color} strokeWidth="2" opacity="0.3">
        <animate attributeName="y1" values="180;183;180" dur="3s" repeatCount="indefinite" />
      </line>
      <line x1="260" y1="148" x2="210" y2="155" stroke={color} strokeWidth="2" opacity="0.3">
        <animate attributeName="y1" values="148;145;148" dur="2.8s" repeatCount="indefinite" />
      </line>
      <line x1="260" y1="165" x2="210" y2="165" stroke={color} strokeWidth="2" opacity="0.3" />
      <line x1="260" y1="180" x2="210" y2="175" stroke={color} strokeWidth="2" opacity="0.3">
        <animate attributeName="y1" values="180;183;180" dur="2.8s" repeatCount="indefinite" />
      </line>

      {/* Paws peeking from bottom */}
      <ellipse cx="100" cy="235" rx="28" ry="16" fill={color} opacity="0.15" stroke={color} strokeWidth="3" />
      <ellipse cx="180" cy="235" rx="28" ry="16" fill={color} opacity="0.15" stroke={color} strokeWidth="3" />
      {/* Toe beans */}
      <circle cx="88" cy="233" r="5" fill={color} opacity="0.2" />
      <circle cx="100" cy="230" r="5" fill={color} opacity="0.2" />
      <circle cx="112" cy="233" r="5" fill={color} opacity="0.2" />
      <circle cx="168" cy="233" r="5" fill={color} opacity="0.2" />
      <circle cx="180" cy="230" r="5" fill={color} opacity="0.2" />
      <circle cx="192" cy="233" r="5" fill={color} opacity="0.2" />
    </svg>
  );
}

// -- Particles --
function Particles({ type, color }: { type: string; color: string }) {
  const items = Array.from({ length: 20 });
  switch (type) {
    case "stars":
      return <>{items.map((_, i) => <Star key={i} $x={Math.random() * 100} $y={Math.random() * 100} $delay={Math.random() * 3} $color={color + "60"} />)}</>;
    case "exclamation":
      return <>{items.slice(0, 8).map((_, i) => <FloatingText key={i} $x={10 + Math.random() * 80} $y={5 + Math.random() * 90} $delay={Math.random() * 2} $color={color} $size={20 + Math.random() * 20}>!</FloatingText>)}</>;
    case "sweat":
      return <>{items.slice(0, 6).map((_, i) => <FloatingText key={i} $x={15 + Math.random() * 70} $y={10 + Math.random() * 40} $delay={Math.random() * 2} $color={color} $size={16 + Math.random() * 12}>💧</FloatingText>)}</>;
    case "tears":
      return <>{items.slice(0, 8).map((_, i) => <FloatingText key={i} $x={10 + Math.random() * 80} $y={10 + Math.random() * 80} $delay={Math.random() * 3} $color={color} $size={14 + Math.random() * 10}>;</FloatingText>)}</>;
    case "question":
      return <>{items.slice(0, 6).map((_, i) => <FloatingText key={i} $x={10 + Math.random() * 80} $y={10 + Math.random() * 80} $delay={Math.random() * 2.5} $color={color} $size={18 + Math.random() * 18}>?</FloatingText>)}</>;
    default:
      return null;
  }
}

// -- Main Component --
export default function FullScreenMascot({ scenario, taskName, timeInfo, onDismiss, soundEnabled = true }: Props) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (scenario && soundEnabled) {
      const config = SCENARIOS[scenario];
      if (config?.sound) {
        playSound(config.sound);
      }
    }
  }, [scenario, soundEnabled]);

  // Auto-dismiss after 30s for non-critical
  useEffect(() => {
    if (!scenario) return;
    if (scenario === "approaching") {
      const timer = setTimeout(() => handleDismiss(), 30000);
      return () => clearTimeout(timer);
    }
  }, [scenario]);

  if (!scenario) return null;

  const config = SCENARIOS[scenario];

  const handleDismiss = () => {
    if (soundEnabled) playSound("dismiss");
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      onDismiss();
    }, 500);
  };

  return (
    <Overlay $bg={config.bg} $exiting={exiting} onClick={handleDismiss}>
      <Particles type={config.particles} color={config.catColor} />
      <CatContainer $anim={config.animation} onClick={(e) => e.stopPropagation()}>
        <CatSVG>
          <CatFace scenario={scenario} color={config.catColor} />
        </CatSVG>

        <Title $color={config.catColor}>{config.title}</Title>
        <Subtitle>{config.subtitle}</Subtitle>

        {taskName && <TaskName $color={config.catColor}>{taskName}</TaskName>}
        {timeInfo && <TimeInfo>{timeInfo}</TimeInfo>}

        <DismissBtn $color={config.buttonColor} onClick={handleDismiss}>
          {config.buttonText}
        </DismissBtn>
      </CatContainer>
    </Overlay>
  );
}

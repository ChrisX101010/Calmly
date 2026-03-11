"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const tick = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const ClockWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: rgba(148, 163, 184, 0.06);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 8px;
  font-variant-numeric: tabular-nums;

  @media (max-width: 768px) {
    padding: 4px 8px;
    gap: 4px;
  }
`;

const TimeDisplay = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #E2E8F0;
  letter-spacing: 0.02em;
  @media (max-width: 768px) { font-size: 12px; }
`;

const Separator = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #6366F1;
  animation: ${tick} 1s ease-in-out infinite;
  @media (max-width: 768px) { font-size: 12px; }
`;

const DateDisplay = styled.span`
  font-size: 10px;
  color: #64748B;
  font-weight: 500;
`;

const TzLabel = styled.span`
  font-size: 9px;
  color: #475569;
  font-weight: 600;
  @media (max-width: 480px) { display: none; }
`;

export default function LiveClock() {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.split("/").pop()?.replace(/_/g, " ") || "";

  return (
    <ClockWrapper title={`Your local time (${Intl.DateTimeFormat().resolvedOptions().timeZone})`}>
      <TimeDisplay>{hours}</TimeDisplay>
      <Separator>:</Separator>
      <TimeDisplay>{minutes}</TimeDisplay>
      {tz && <TzLabel>{tz}</TzLabel>}
    </ClockWrapper>
  );
}

"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  DAYS_OF_WEEK, MONTH_NAMES, getDaysInMonth, getFirstDayOfWeek,
  toDateKey, isToday, uid,
} from "@/utils/calendar";
import {
  generateICS, parseICS, generateJSON, parseJSON,
  generateCSV, parseCSV, downloadFile,
} from "@/utils/ics";
import { detectSentiment, getHolidayTheme, HolidayTheme } from "@/utils/sentiment";
import { Task, TasksByDate, HolidaysByDate, DragData } from "@/lib/types";
import { COUNTRIES } from "@/lib/constants";
import CalmlyMascot, { MascotMood, HolidayAccessory } from "./CalmlyMascot";
import ToastSystem, { getRandomMessage, SCENARIO_MESSAGES } from "./ToastSystem";
import FullScreenMascot, { FullScreenScenario } from "./FullScreenMascot";
import TaskDetailPanel, { getLabelInfo } from "./TaskDetailPanel";
import SyncPrompt, { shouldShowSyncPrompt } from "./SyncPrompt";
import LiveClock from "./LiveClock";
import { playSound } from "@/utils/sounds";
import {
  GlobalStyles, AppWrapper, Header, Brand, Logo, BrandText, AppTitle,
  TaskCounter, Nav, NavButton, MonthLabel, Toolbar, SearchWrapper,
  SearchIcon, SearchInput, CountrySelect, Grid, DayHeader, Cell,
  DayNumber, TodayBadge, AddButton, HolidayTag, TaskList,
  TaskCard, TaskText, TaskActions, TinyButton, InlineInput, DragPlaceholder,
  ModalOverlay, ModalBox, ModalTitle, ModalLabel, ModalDescription,
  ModalBtnRow, ModalBtn, ModalDivider, ModalHint, HiddenFileInput,
  TASK_COLORS, MeetingBadge, TimeInput, MeetingToggle, AddTaskRow,
  StickyNote, StickyNoteText, StickyNoteRow, StickyNoteActions,
  StickyTinyBtn, StickyLimitMsg, STICKY_COLORS,
} from "./StyledComponents";
import styled from "styled-components";

// -- Extra styled --
const LabelDot = styled.span<{$color:string}>`
  width:6px;height:6px;border-radius:50%;background:${(p:{$color:string})=>p.$color};flex-shrink:0;
`;
const NoteIcon = styled.span`
  font-size:9px;opacity:0.5;flex-shrink:0;cursor:pointer;
  &:hover{opacity:1;}
`;
const StatusBar = styled.div`
  display:flex;align-items:center;justify-content:center;
  padding:10px 20px;background:rgba(15,23,42,0.5);
  border-bottom:1px solid rgba(148,163,184,0.06);gap:16px;min-height:70px;
  flex-wrap:wrap;
  @media(max-width:768px){padding:8px 12px;gap:10px;min-height:50px;}
  @media(max-width:480px){padding:6px 8px;gap:8px;min-height:40px;}
`;
const StatusMessage = styled.div`
  font-size:13px;color:#94A3B8;font-weight:500;line-height:1.5;max-width:400px;
  @media(max-width:768px){font-size:11px;max-width:220px;}
`;
const StatusHighlight = styled.span<{$color:string}>`color:${(p:{$color:string})=>p.$color};font-weight:700;`;
const SoundToggle = styled.button<{$active:boolean}>`
  background:${(p:{$active:boolean})=>p.$active?"rgba(99,102,241,0.15)":"rgba(148,163,184,0.08)"};
  border:1px solid ${(p:{$active:boolean})=>p.$active?"rgba(99,102,241,0.3)":"rgba(148,163,184,0.12)"};
  border-radius:8px;color:${(p:{$active:boolean})=>p.$active?"#818CF8":"#64748B"};
  padding:7px 12px;cursor:pointer;font-size:13px;font-family:inherit;transition:all .15s ease;
  &:hover{background:rgba(99,102,241,0.2);}
`;
const HolidayMascotWrap = styled.div`
  display:flex;align-items:center;gap:4px;
  @media(max-width:768px){gap:2px;}
`;

// -- API --
async function apiGet(y:number,m:number):Promise<TasksByDate>{try{const r=await fetch(`/api/tasks?year=${y}&month=${m}`);if(!r.ok)throw 0;return await r.json();}catch{return{};}}
async function apiCreate(text:string,dateKey:string,order:number,time?:string,isMeeting?:boolean):Promise<Task|null>{try{const r=await fetch("/api/tasks",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text,dateKey,order,time,isMeeting})});if(!r.ok)throw 0;return await r.json();}catch{return null;}}
async function apiUpdate(id:string,fields:Partial<Task>):Promise<Task|null>{try{const r=await fetch(`/api/tasks/${id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(fields)});if(!r.ok)throw 0;return await r.json();}catch{return null;}}
async function apiDelete(id:string):Promise<boolean>{try{return(await fetch(`/api/tasks/${id}`,{method:"DELETE"})).ok;}catch{return false;}}
async function apiBulkUpdate(tasks:Task[]):Promise<boolean>{try{return(await fetch("/api/tasks",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({tasks})})).ok;}catch{return false;}}

// -- Detect country from timezone --
function guessCountryFromTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const map: Record<string, string> = {
      "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US",
      "America/Los_Angeles": "US", "America/Toronto": "CA", "America/Vancouver": "CA",
      "Europe/London": "GB", "Europe/Berlin": "DE", "Europe/Paris": "FR",
      "Europe/Rome": "IT", "Europe/Madrid": "ES", "Europe/Amsterdam": "NL",
      "Europe/Warsaw": "PL", "Europe/Belgrade": "RS", "Europe/Zagreb": "HR",
      "Europe/Bucharest": "RO", "Europe/Kiev": "UA", "Europe/Stockholm": "SE",
      "Europe/Oslo": "NO", "Europe/Vienna": "AT", "Europe/Zurich": "CH",
      "Europe/Prague": "CZ", "Europe/Dublin": "IE", "Europe/Lisbon": "PT",
      "Europe/Istanbul": "TR", "Asia/Tokyo": "JP", "Asia/Seoul": "KR",
      "Asia/Shanghai": "CN", "Asia/Kolkata": "IN", "Australia/Sydney": "AU",
      "America/Sao_Paulo": "BR", "America/Mexico_City": "MX",
      "America/Argentina/Buenos_Aires": "AR", "Africa/Johannesburg": "ZA",
    };
    return map[tz] || "US";
  } catch { return "US"; }
}

// -- Mood with holiday awareness --
function getOverallMood(tasks: TasksByDate, todayHolidays: string[]): { mood: MascotMood; message: string; color: string; accessory: HolidayAccessory } {
  const today = new Date();
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const totalTasks = Object.values(tasks).reduce((s, l) => s + l.length, 0);
  let overdue = 0, todayCount = 0, meetings = 0;
  Object.entries(tasks).forEach(([dk, l]) => {
    if (dk < todayKey && l.length > 0) overdue += l.length;
    if (dk === todayKey) { todayCount = l.length; meetings = l.filter(t => t.isMeeting).length; }
  });

  // Holiday check
  let accessory: HolidayAccessory = null;
  if (todayHolidays.length > 0) {
    const theme = getHolidayTheme(todayHolidays[0]);
    if (theme) accessory = theme.accessory as HolidayAccessory;
    return { mood: "dance", message: `Happy ${todayHolidays[0]}!`, color: theme?.colors[0] || "#F59E0B", accessory };
  }

  if (overdue > 3) return { mood: "sad", message: `${overdue} overdue tasks... let's catch up!`, color: "#EF4444", accessory };
  if (overdue > 0) return { mood: "worried", message: `${overdue} overdue task${overdue > 1 ? "s" : ""} need attention`, color: "#F97316", accessory };
  if (meetings > 0) return { mood: "calm", message: `${meetings} meeting${meetings > 1 ? "s" : ""} today. Keep calm~`, color: "#6366F1", accessory };
  if (todayCount > 5) return { mood: "worried", message: `Busy day! ${todayCount} tasks. You can do it!`, color: "#F97316", accessory };
  if (todayCount > 0) return { mood: "calm", message: `${todayCount} task${todayCount > 1 ? "s" : ""} today. Looking good~`, color: "#6366F1", accessory };
  if (totalTasks === 0) return { mood: "sleepy", message: "No tasks yet... a calm blank canvas~", color: "#94A3B8", accessory };
  const dow = today.getDay();
  if (dow === 0 || dow === 6) return { mood: "sleepy", message: "Weekend vibes... take it easy~", color: "#94A3B8", accessory };
  return { mood: "happy", message: "Everything's looking good! Stay on track~", color: "#10B981", accessory };
}

// -- Component --
export default function Calendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [tasks, setTasks] = useState<TasksByDate>({});
  const [holidays, setHolidays] = useState<HolidaysByDate>({});
  const [country, setCountry] = useState(() => guessCountryFromTimezone());
  const [search, setSearch] = useState("");
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<{dateKey:string;id:string}|null>(null);
  const [editText, setEditText] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");
  const [newTaskIsMeeting, setNewTaskIsMeeting] = useState(false);
  const [dragItem, setDragItem] = useState<DragData|null>(null);
  const [dragOverCell, setDragOverCell] = useState<string|null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number|null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [fullScreenScenario, setFullScreenScenario] = useState<FullScreenScenario>(null);
  const [fullScreenTask, setFullScreenTask] = useState("");
  const [fullScreenTime, setFullScreenTime] = useState("");
  const [notifiedMeetings, setNotifiedMeetings] = useState<Set<string>>(new Set());
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [showSyncPrompt, setShowSyncPrompt] = useState(false);
  const [syncDateKey, setSyncDateKey] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const toastRef = useRef<((mood:MascotMood,message:string,sound?:Parameters<typeof playSound>[0])=>void)|null>(null);

  const toast = useCallback((mood:MascotMood,message:string,sound?:Parameters<typeof playSound>[0])=>{
    if(toastRef.current)toastRef.current(mood,message,soundEnabled?sound:undefined);
  },[soundEnabled]);

  // Welcome
  useEffect(()=>{
    if(!loading&&!hasWelcomed){
      setHasWelcomed(true);
      setTimeout(()=>toast("love",getRandomMessage(SCENARIO_MESSAGES.welcome),"welcome"),600);
    }
  },[loading,hasWelcomed,toast]);

  // Load tasks
  useEffect(()=>{let c=false;setLoading(true);apiGet(year,month).then(d=>{if(!c){setTasks(d);setLoading(false);}});return()=>{c=true;};},[year,month]);

  // Meeting reminder system
  useEffect(()=>{
    if(loading)return;
    const check = () => {
      const now = new Date();
      const todayKey = toDateKey(now.getFullYear(),now.getMonth(),now.getDate());
      const todayTasks = tasks[todayKey]||[];
      const meetings = todayTasks.filter(t=>t.isMeeting&&t.time);
      meetings.forEach(meeting=>{
        const [h,m]=(meeting.time||"").split(":").map(Number);
        if(isNaN(h)||isNaN(m))return;
        const mt=new Date(now.getFullYear(),now.getMonth(),now.getDate(),h,m);
        const diff=(mt.getTime()-now.getTime())/60000;
        const mk=`${meeting.id}-${meeting.time}`;
        if(diff>0&&diff<=5&&!notifiedMeetings.has(mk+"-a")){
          setNotifiedMeetings(p=>new Set(p).add(mk+"-a"));
          setFullScreenTask(meeting.text);setFullScreenTime(`Starting in ${Math.ceil(diff)} min`);setFullScreenScenario("approaching");
        }else if(diff<=0&&diff>-1&&!notifiedMeetings.has(mk+"-n")){
          setNotifiedMeetings(p=>new Set(p).add(mk+"-n"));
          setFullScreenTask(meeting.text);setFullScreenTime("Starting now!");setFullScreenScenario("now");
        }else if(diff<=-1&&diff>-10&&!notifiedMeetings.has(mk+"-l")){
          setNotifiedMeetings(p=>new Set(p).add(mk+"-l"));
          setFullScreenTask(meeting.text);setFullScreenTime(`Started ${Math.abs(Math.floor(diff))} min ago`);setFullScreenScenario("late");
        }else if(diff<=-10&&!notifiedMeetings.has(mk+"-m")){
          setNotifiedMeetings(p=>new Set(p).add(mk+"-m"));
          setFullScreenTask(meeting.text);setFullScreenTime(`Was at ${meeting.time}`);setFullScreenScenario("missed");
        }
      });
    };
    check();const iv=setInterval(check,15000);return()=>clearInterval(iv);
  },[tasks,loading,notifiedMeetings]);

  // Load holidays
  useEffect(()=>{
    let c=false;
    (async()=>{try{
      const r=await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
      if(!r.ok)return;const d=await r.json();if(c)return;
      const map:HolidaysByDate={};
      d.forEach((h:any)=>{if(!map[h.date])map[h.date]=[];map[h.date].push(h.localName||h.name);});
      setHolidays(map);
    }catch{if(!c)setHolidays({});}})();
    return()=>{c=true;};
  },[year,country]);

  useEffect(()=>{if((editingCell||editingTask)&&inputRef.current)inputRef.current.focus();},[editingCell,editingTask]);

  // Nav
  const prevMonth=useCallback(()=>{if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1);},[month]);
  const nextMonth=useCallback(()=>{if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1);},[month]);
  const goToday=useCallback(()=>{setYear(now.getFullYear());setMonth(now.getMonth());},[]);

  // CRUD with sentiment detection
  const addTask = useCallback(async(dateKey:string,text:string)=>{
    if(!text.trim())return;
    // Limit 6 sticky notes per day
    const existing = tasks[dateKey]||[];
    if(existing.length >= 6){
      toast("annoyed","Max 6 notes per day! Move some to another day~","error");
      return;
    }
    const created = await apiCreate(text.trim(),dateKey,(tasks[dateKey]||[]).length,newTaskTime||undefined,newTaskIsMeeting||undefined);
    if(created){
      setTasks(prev=>({...prev,[dateKey]:[...(prev[dateKey]||[]),created]}));
      // Sentiment-aware reaction
      const sentiment = detectSentiment(text);
      if(sentiment.sentiment === "love"){
        toast("love",sentiment.reaction || "Awww~ How sweet!","taskCreated");
      } else if(sentiment.sentiment === "sad"){
        toast("empathy",sentiment.reaction || "I'm here for you...","taskCreated");
      } else if(sentiment.sentiment === "celebrate"){
        toast("excited",sentiment.reaction || "Time to celebrate!","taskCreated");
      } else if(sentiment.sentiment === "stress"){
        toast("cheer",sentiment.reaction || "You've got this!","taskCreated");
      } else if(sentiment.sentiment === "fitness"){
        toast("excited",sentiment.reaction || "Let's go!","taskCreated");
      } else if(sentiment.sentiment === "travel"){
        toast("dance",sentiment.reaction || "Bon voyage!","taskCreated");
      } else if(sentiment.sentiment === "relax"){
        toast("sleepy",sentiment.reaction || "Rest up~","taskCreated");
      } else if(sentiment.sentiment === "food"){
        toast("happy",sentiment.reaction || "Yummy!","taskCreated");
      } else if(sentiment.sentiment === "family"){
        toast("love",sentiment.reaction || "Family time!","taskCreated");
      } else if(sentiment.sentiment === "social"){
        toast("excited",sentiment.reaction || "Have fun!","taskCreated");
      } else if(sentiment.sentiment === "creative"){
        toast("happy",sentiment.reaction || "Create something amazing!","taskCreated");
      } else {
        toast("happy",getRandomMessage(SCENARIO_MESSAGES.taskCreated),"taskCreated");
      }
    } else toast("annoyed",getRandomMessage(SCENARIO_MESSAGES.error),"error");
    setNewTaskTime("");setNewTaskIsMeeting(false);
    // Show sync prompt for first task of the day
    if(shouldShowSyncPrompt()&&!showSyncPrompt){
      setTimeout(()=>{setSyncDateKey(dateKey);setShowSyncPrompt(true);},1500);
    }
  },[tasks,toast,newTaskTime,newTaskIsMeeting,showSyncPrompt]);

  const deleteTask=useCallback(async(dateKey:string,taskId:string)=>{
    const ok=await apiDelete(taskId);
    if(ok){setTasks(prev=>{const l=(prev[dateKey]||[]).filter(t=>t.id!==taskId);const n={...prev};if(l.length===0)delete n[dateKey];else n[dateKey]=l;return n;});toast("proud",getRandomMessage(SCENARIO_MESSAGES.taskDeleted),"taskDeleted");}
    else toast("annoyed",getRandomMessage(SCENARIO_MESSAGES.error),"error");
  },[toast]);

  const updateTask=useCallback(async(dateKey:string,taskId:string,newText:string)=>{
    if(!newText.trim()){await deleteTask(dateKey,taskId);return;}
    const u=await apiUpdate(taskId,{text:newText.trim()});
    if(u){setTasks(prev=>({...prev,[dateKey]:(prev[dateKey]||[]).map(t=>t.id===taskId?{...t,text:newText.trim()}:t)}));toast("calm",getRandomMessage(SCENARIO_MESSAGES.taskEdited),"taskEdited");}
    else toast("annoyed",getRandomMessage(SCENARIO_MESSAGES.error),"error");
  },[toast,deleteTask]);

  // Drag
  const handleDragStart=useCallback((e:React.DragEvent,dk:string,ti:number)=>{setDragItem({dateKey:dk,taskIndex:ti});e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain","");},[]);
  const handleDragOver=useCallback((e:React.DragEvent,dk:string,idx?:number)=>{e.preventDefault();e.dataTransfer.dropEffect="move";setDragOverCell(dk);setDragOverIndex(idx!==undefined?idx:null);},[]);
  const handleDrop=useCallback(async(e:React.DragEvent,tdk:string)=>{
    e.preventDefault();if(!dragItem)return;
    const{dateKey:sk,taskIndex:si}=dragItem;
    // Prevent dropping more than 6 on a day (unless reordering same day)
    if(sk!==tdk&&(tasks[tdk]||[]).length>=6){
      toast("annoyed","That day is full! Max 6 notes~","error");
      setDragItem(null);setDragOverCell(null);setDragOverIndex(null);return;
    }
    const st=[...(tasks[sk]||[])];const[mv]=st.splice(si,1);if(!mv)return;
    if(sk===tdk){const ins=dragOverIndex!==null?dragOverIndex:st.length;st.splice(ins,0,mv);const r=st.map((t,i)=>({...t,order:i}));setTasks({...tasks,[sk]:r});await apiBulkUpdate(r);}
    else{const dt=[...(tasks[tdk]||[])];const ins=dragOverIndex!==null?dragOverIndex:dt.length;dt.splice(ins,0,{...mv,dateKey:tdk});const rs=st.map((t,i)=>({...t,order:i}));const rd=dt.map((t,i)=>({...t,order:i,dateKey:tdk}));const u={...tasks,[tdk]:rd};if(rs.length===0)delete u[sk];else u[sk]=rs;setTasks(u);await apiBulkUpdate([...rs,...rd]);}
    toast("excited",getRandomMessage(SCENARIO_MESSAGES.dragDrop),"dragDrop");setDragItem(null);setDragOverCell(null);setDragOverIndex(null);
  },[dragItem,dragOverIndex,tasks,toast]);
  const handleDragEnd=useCallback(()=>{setDragItem(null);setDragOverCell(null);setDragOverIndex(null);},[]);

  // Import/Export
  const handleExportICS=useCallback(()=>{downloadFile(generateICS(tasks),"calmly-tasks.ics","text/calendar");setShowModal(false);toast("proud",getRandomMessage(SCENARIO_MESSAGES.exportSuccess),"exportSuccess");},[tasks,toast]);
  const handleExportJSON=useCallback(()=>{downloadFile(generateJSON(tasks),"calmly-tasks.json","application/json");setShowModal(false);toast("proud",getRandomMessage(SCENARIO_MESSAGES.exportSuccess),"exportSuccess");},[tasks,toast]);
  const handleExportCSV=useCallback(()=>{downloadFile(generateCSV(tasks),"calmly-tasks.csv","text/csv");setShowModal(false);toast("proud",getRandomMessage(SCENARIO_MESSAGES.exportSuccess),"exportSuccess");},[tasks,toast]);
  const handleImportFile=useCallback(async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0];if(!f)return;const t=await f.text();let imp:TasksByDate={};
    if(f.name.endsWith(".ics"))imp=parseICS(t);else if(f.name.endsWith(".json"))imp=parseJSON(t);else if(f.name.endsWith(".csv"))imp=parseCSV(t);
    const mg={...tasks};let cnt=0;
    for(const[dk,l]of Object.entries(imp)){for(const tt of l){const c=await apiCreate(tt.text,dk,(mg[dk]||[]).length);if(c){if(!mg[dk])mg[dk]=[];mg[dk].push(c);cnt++;}}}
    setTasks(mg);setShowModal(false);if(fileRef.current)fileRef.current.value="";
    if(cnt>0)toast("excited",`Imported ${cnt} task${cnt>1?"s":""}!`,"importSuccess");else toast("annoyed","No tasks found...","error");
  },[tasks,toast]);

  // Grid
  const daysInMonth=getDaysInMonth(year,month);
  const firstDay=getFirstDayOfWeek(year,month);
  const totalCells=Math.ceil((firstDay+daysInMonth)/7)*7;
  const filteredTasks=useMemo(():TasksByDate=>{
    if(!search.trim())return tasks;const q=search.toLowerCase();const r:TasksByDate={};
    Object.entries(tasks).forEach(([k,l])=>{const m=l.filter(t=>t.text.toLowerCase().includes(q));if(m.length)r[k]=m;});return r;
  },[tasks,search]);
  const taskCount=useMemo(()=>Object.values(tasks).reduce((s,l)=>s+l.length,0),[tasks]);

  // Today's holidays for mascot theming
  const todayKey=toDateKey(now.getFullYear(),now.getMonth(),now.getDate());
  const todayHolidays=holidays[todayKey]||[];
  const overallMood=useMemo(()=>getOverallMood(tasks,todayHolidays),[tasks,todayHolidays]);

  // Holiday theme for mascot in cells
  const getHolidayAccessory = useCallback((dateHolidays: string[]): { accessory: HolidayAccessory; theme: HolidayTheme | null } => {
    if (dateHolidays.length === 0) return { accessory: null, theme: null };
    const theme = getHolidayTheme(dateHolidays[0]);
    return { accessory: (theme?.accessory as HolidayAccessory) || null, theme };
  }, []);

  return (
    <>
      <GlobalStyles />
      <AppWrapper>
        <ToastSystem toastRef={toastRef} />
        <FullScreenMascot scenario={fullScreenScenario} taskName={fullScreenTask} timeInfo={fullScreenTime}
          onDismiss={()=>setFullScreenScenario(null)} soundEnabled={soundEnabled} />

        <Header>
          <Brand>
            <Logo>C</Logo>
            <BrandText>
              <AppTitle>Calmly</AppTitle>
              <TaskCounter>{loading?"Loading...":`${taskCount} task${taskCount!==1?"s":""}`}</TaskCounter>
            </BrandText>
          </Brand>
          <Nav>
            <NavButton onClick={prevMonth}>&#8249;</NavButton>
            <NavButton onClick={goToday}>Today</NavButton>
            <NavButton onClick={nextMonth}>&#8250;</NavButton>
            <MonthLabel>{MONTH_NAMES[month]} {year}</MonthLabel>
          </Nav>
          <Toolbar>
            <LiveClock />
            <SearchWrapper>
              <SearchIcon>&#8981;</SearchIcon>
              <SearchInput placeholder="Filter tasks..." value={search} onChange={e=>setSearch(e.target.value)} />
            </SearchWrapper>
            <CountrySelect value={country} onChange={e=>setCountry(e.target.value)}>
              {COUNTRIES.map(c=><option key={c.code} value={c.code}>{c.name}</option>)}
            </CountrySelect>
            <SoundToggle $active={soundEnabled} onClick={()=>setSoundEnabled(s=>!s)} title={soundEnabled?"Mute":"Unmute"}>
              {soundEnabled?"\uD83D\uDD0A":"\uD83D\uDD07"}
            </SoundToggle>
            <NavButton onClick={()=>setShowModal(true)}>&#8644; Import / Export</NavButton>
          </Toolbar>
        </Header>

        <StatusBar>
          <CalmlyMascot mood={overallMood.mood} size={48} message="" accessory={overallMood.accessory} accentColor={overallMood.color} />
          <StatusMessage>
            <StatusHighlight $color={overallMood.color}>
              {overallMood.mood==="happy"?"All good! ":overallMood.mood==="sad"?"Uh oh... ":overallMood.mood==="worried"?"Heads up! ":overallMood.mood==="dance"?"":""}
            </StatusHighlight>
            {overallMood.message}
          </StatusMessage>
        </StatusBar>

        <Grid>
          {DAYS_OF_WEEK.map(d=><DayHeader key={d}>{d}</DayHeader>)}
          {Array.from({length:totalCells}).map((_,i)=>{
            const dayNum=i-firstDay+1;
            const isValid=dayNum>=1&&dayNum<=daysInMonth;
            if(!isValid)return<Cell key={i} $isEmpty/>;
            const dateKey=toDateKey(year,month,dayNum);
            const dayTasks=filteredTasks[dateKey]||[];
            const dayHolidays=holidays[dateKey]||[];
            const isTodayCell=isToday(year,month,dayNum);
            const isDragTarget=dragOverCell===dateKey;
            const isOverdue=dateKey<todayKey&&dayTasks.length>0;
            const hTheme = getHolidayAccessory(dayHolidays);

            return(
              <Cell key={i} $isToday={isTodayCell} $isDragOver={isDragTarget}
                onDragOver={(e:React.DragEvent)=>handleDragOver(e,dateKey)}
                onDrop={(e:React.DragEvent)=>handleDrop(e,dateKey)}
                onDragLeave={()=>{if(dragOverCell===dateKey)setDragOverCell(null);}}
                style={isOverdue?{borderLeft:"2px solid #EF4444"}:undefined}>
                <DayNumber>
                  {isTodayCell?<TodayBadge>{dayNum}</TodayBadge>:<span style={isOverdue?{color:"#EF4444"}:undefined}>{dayNum}</span>}
                  <span style={{display:"flex",alignItems:"center",gap:3}}>
                    {dayTasks.length>0&&<span style={{fontSize:9,color:"#475569",fontWeight:600}}>{dayTasks.length}/6</span>}
                    {dayTasks.length<6&&<AddButton title="Add task" onClick={()=>{setEditingCell(dateKey);setEditText("");setEditingTask(null);setNewTaskTime("");setNewTaskIsMeeting(false);}}>+</AddButton>}
                  </span>
                </DayNumber>

                {/* Holidays with themed mascot */}
                {dayHolidays.map((h,hi)=>(
                  <HolidayMascotWrap key={hi}>
                    <CalmlyMascot mood="dance" size={16} message="" accessory={hTheme.accessory}
                      accentColor={hTheme.theme?.colors[0]} />
                    <HolidayTag title={h} style={{flex:1}}>{h}</HolidayTag>
                  </HolidayMascotWrap>
                ))}

                <TaskList>
                  {dayTasks.slice(0, 6).map((task,ti)=>{
                    const sColor=STICKY_COLORS[ti%STICKY_COLORS.length];
                    const isDragging=dragItem?.dateKey===dateKey&&dragItem?.taskIndex===ti;
                    const rot = ((task.id.charCodeAt(0)||0) % 5) - 2; // -2 to +2 degrees

                    if(editingTask?.dateKey===dateKey&&editingTask?.id===task.id){
                      return(<InlineInput key={task.id} ref={inputRef} value={editText}
                        onChange={e=>setEditText(e.target.value)}
                        onKeyDown={e=>{if(e.key==="Enter"){updateTask(dateKey,task.id,editText);setEditingTask(null);}if(e.key==="Escape")setEditingTask(null);}}
                        onBlur={()=>{updateTask(dateKey,task.id,editText);setEditingTask(null);}}
                        style={{width:"100%"}}/>);
                    }
                    const sentiment=detectSentiment(task.text);
                    const labelInfo=task.label?getLabelInfo(task.label):null;
                    const noteColor = labelInfo
                      ? { bg: labelInfo.color+"18", shadow: labelInfo.color, text: labelInfo.color }
                      : task.isMeeting
                        ? { bg:"#EDE9FE", shadow:"#8B5CF6", text:"#4338CA" }
                        : sColor;

                    return(
                      <StickyNote key={task.id}
                        $bgColor={noteColor.bg} $shadowColor={noteColor.shadow}
                        $textColor={noteColor.text} $rotation={rot}
                        $isDragging={isDragging} $index={ti}
                        draggable onDragStart={(e:React.DragEvent)=>handleDragStart(e,dateKey,ti)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e:React.DragEvent)=>{e.preventDefault();e.stopPropagation();handleDragOver(e,dateKey,ti);}}
                        onDoubleClick={()=>setDetailTask(task)}>
                        {/* Time + icons row */}
                        <StickyNoteRow>
                          {task.time&&<span style={{fontSize:8,fontWeight:700,opacity:0.7}}>{task.time}</span>}
                          {task.isMeeting&&<span style={{fontSize:7,fontWeight:700,background:"rgba(99,102,241,0.2)",padding:"0 3px",borderRadius:2}}>MTG</span>}
                          {sentiment.emoji&&<span style={{fontSize:8}}>{sentiment.emoji}</span>}
                          {task.notes&&<span style={{fontSize:7,opacity:0.5}}>📝</span>}
                          {task.meetingLink&&<span style={{fontSize:7,opacity:0.5,cursor:"pointer"}} onClick={e=>{e.stopPropagation();window.open(task.meetingLink!.startsWith("http")?task.meetingLink!:`https://${task.meetingLink!}`,"_blank");}}>🔗</span>}
                        </StickyNoteRow>
                        {/* Task name */}
                        <StickyNoteText>{task.text}</StickyNoteText>
                        {/* Hover actions */}
                        <StickyNoteActions>
                          <StickyTinyBtn title="Open" onClick={e=>{e.stopPropagation();setDetailTask(task);}}>&#9998;</StickyTinyBtn>
                          <StickyTinyBtn title="Delete" onClick={e=>{e.stopPropagation();deleteTask(dateKey,task.id);}}>&#215;</StickyTinyBtn>
                        </StickyNoteActions>
                      </StickyNote>);
                  })}
                  {dayTasks.length>6&&<StickyLimitMsg>+{dayTasks.length-6} more</StickyLimitMsg>}
                  {isDragTarget&&(dragOverIndex===null||dragOverIndex>=dayTasks.length)&&<DragPlaceholder/>}
                </TaskList>

                {editingCell===dateKey&&!editingTask&&(
                  <div>
                    <InlineInput ref={inputRef} placeholder={newTaskIsMeeting?"Meeting name...":"New task..."} value={editText}
                      onChange={e=>setEditText(e.target.value)}
                      onKeyDown={e=>{
                        if(e.key==="Enter"){addTask(dateKey,editText);setEditText("");setEditingCell(null);}
                        if(e.key==="Escape"){setEditingCell(null);setEditText("");setNewTaskTime("");setNewTaskIsMeeting(false);}
                      }}
                      onBlur={()=>{if(editText.trim())addTask(dateKey,editText);setEditingCell(null);setEditText("");setNewTaskTime("");setNewTaskIsMeeting(false);}}
                    />
                    <AddTaskRow>
                      <TimeInput type="time" value={newTaskTime} onChange={e=>setNewTaskTime(e.target.value)}
                        onMouseDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()}
                        placeholder="Time" title="Set time"/>
                      <MeetingToggle $active={newTaskIsMeeting} onClick={e=>{e.preventDefault();e.stopPropagation();setNewTaskIsMeeting(!newTaskIsMeeting);}}
                        onMouseDown={e=>e.preventDefault()}>
                        {newTaskIsMeeting?"Meeting":"Task"}
                      </MeetingToggle>
                    </AddTaskRow>
                  </div>
                )}
              </Cell>
            );
          })}
        </Grid>

        {showModal&&(
          <ModalOverlay onClick={()=>setShowModal(false)}>
            <ModalBox onClick={e=>e.stopPropagation()}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <CalmlyMascot mood="calm" size={36} message="" /><ModalTitle style={{marginBottom:0}}>Import / Export</ModalTitle>
              </div>
              <ModalLabel>Export your tasks</ModalLabel>
              <ModalDescription>Download all tasks in a compatible format.</ModalDescription>
              <ModalBtnRow>
                <ModalBtn $primary onClick={handleExportICS}>Export .ics</ModalBtn>
                <ModalBtn onClick={handleExportJSON}>Export .json</ModalBtn>
                <ModalBtn onClick={handleExportCSV}>Export .csv</ModalBtn>
              </ModalBtnRow>
              <ModalHint><strong>.ics</strong> -- Google Calendar, Apple, Outlook | <strong>.json</strong> -- Re-import | <strong>.csv</strong> -- Spreadsheets</ModalHint>
              <ModalDivider />
              <ModalLabel>Import tasks</ModalLabel>
              <ModalDescription>Import from .ics, .json, or .csv. Merges with existing data.</ModalDescription>
              <ModalBtnRow>
                <ModalBtn $primary onClick={()=>fileRef.current?.click()}>Choose File</ModalBtn>
                <ModalBtn onClick={()=>setShowModal(false)}>Cancel</ModalBtn>
              </ModalBtnRow>
              <HiddenFileInput ref={fileRef} type="file" accept=".ics,.json,.csv" onChange={handleImportFile} />
            </ModalBox>
          </ModalOverlay>
        )}

        {/* Task Detail Panel */}
        {detailTask && (
          <TaskDetailPanel task={detailTask}
            onSave={async (updates) => {
              const u = await apiUpdate(detailTask.id, updates);
              if (u) {
                setTasks(prev => ({
                  ...prev,
                  [detailTask.dateKey]: (prev[detailTask.dateKey] || []).map(t =>
                    t.id === detailTask.id ? { ...t, ...updates } : t
                  ),
                }));
                toast("calm", "Saved!", "taskEdited");
              }
            }}
            onClose={() => setDetailTask(null)}
            onDelete={async () => {
              await deleteTask(detailTask.dateKey, detailTask.id);
              setDetailTask(null);
            }}
          />
        )}

        {/* Sync Prompt */}
        {showSyncPrompt && (
          <SyncPrompt tasks={tasks} dateKey={syncDateKey}
            onDismiss={() => setShowSyncPrompt(false)} soundEnabled={soundEnabled} />
        )}
      </AppWrapper>
    </>
  );
}

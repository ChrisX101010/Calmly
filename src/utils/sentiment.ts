// Detects emotional context from task text to trigger mascot reactions

export type TaskSentiment =
  | "love"       // date, heart, love, wife, husband, partner, anniversary
  | "family"     // kids, family, children, school, parent
  | "celebrate"  // birthday, party, celebration, congrats
  | "sad"        // funeral, loss, hospital, surgery, goodbye
  | "stress"     // deadline, urgent, ASAP, overdue, critical
  | "fitness"    // gym, workout, run, yoga, exercise
  | "food"       // lunch, dinner, breakfast, restaurant, cook
  | "travel"     // flight, trip, vacation, hotel, airport
  | "relax"      // rest, nap, break, chill, spa, massage
  | "money"      // payment, invoice, salary, tax, budget
  | "creative"   // design, art, music, write, paint
  | "social"     // friends, hangout, drinks, bar, club
  | "neutral";

interface SentimentRule {
  sentiment: TaskSentiment;
  keywords: string[];
  emoji: string;
  mascotReaction: string;
}

const RULES: SentimentRule[] = [
  {
    sentiment: "love",
    keywords: ["love", "date", "wife", "husband", "partner", "girlfriend", "boyfriend", "anniversary", "valentine", "romance", "babe", "honey", "darling", "<3", "heart", "kiss", "cuddle", "marry", "wedding", "proposal"],
    emoji: "💕",
    mascotReaction: "Awww~ How sweet!",
  },
  {
    sentiment: "family",
    keywords: ["kids", "children", "family", "son", "daughter", "school", "parent", "mom", "dad", "baby", "toddler", "playground", "kindergarten", "pick up kids", "family dinner", "bedtime"],
    emoji: "🐱",
    mascotReaction: "Family time! Enjoy every moment~",
  },
  {
    sentiment: "celebrate",
    keywords: ["birthday", "party", "celebration", "celebrate", "congrats", "congratulations", "graduation", "promotion", "achievement", "surprise", "gift", "presents", "cake", "champagne", "fireworks", "new year"],
    emoji: "🎉",
    mascotReaction: "Time to celebrate! Woohoo!",
  },
  {
    sentiment: "sad",
    keywords: ["funeral", "loss", "hospital", "surgery", "goodbye", "memorial", "grief", "mourning", "condolence", "passed away", "sick", "illness", "cancer", "therapy", "counseling", "depression", "anxiety"],
    emoji: "💙",
    mascotReaction: "I'm here for you...",
  },
  {
    sentiment: "stress",
    keywords: ["deadline", "urgent", "asap", "overdue", "critical", "emergency", "rush", "hurry", "crunch", "pressure", "final", "exam", "test", "presentation"],
    emoji: "⚡",
    mascotReaction: "You've got this! Stay focused!",
  },
  {
    sentiment: "fitness",
    keywords: ["gym", "workout", "exercise", "run", "running", "yoga", "stretch", "swim", "bike", "hike", "fitness", "weights", "cardio", "pilates", "crossfit", "training"],
    emoji: "💪",
    mascotReaction: "Get those muscles moving!",
  },
  {
    sentiment: "food",
    keywords: ["lunch", "dinner", "breakfast", "brunch", "restaurant", "cook", "cooking", "recipe", "eat", "food", "meal", "pizza", "sushi", "cafe", "coffee", "snack", "groceries"],
    emoji: "🍽️",
    mascotReaction: "Yummy! Don't forget to eat well~",
  },
  {
    sentiment: "travel",
    keywords: ["flight", "trip", "vacation", "hotel", "airport", "travel", "roadtrip", "cruise", "passport", "luggage", "booking", "destination", "beach", "mountain"],
    emoji: "✈️",
    mascotReaction: "Adventure awaits! Bon voyage~",
  },
  {
    sentiment: "relax",
    keywords: ["rest", "nap", "break", "chill", "spa", "massage", "relax", "meditation", "sleep", "lazy", "netflix", "movie", "read", "reading", "bath"],
    emoji: "😴",
    mascotReaction: "Rest up... you deserve it~",
  },
  {
    sentiment: "money",
    keywords: ["payment", "invoice", "salary", "tax", "budget", "bank", "money", "finance", "invest", "stock", "crypto", "bill", "rent", "mortgage", "insurance"],
    emoji: "💰",
    mascotReaction: "Adulting is hard... but you're doing great!",
  },
  {
    sentiment: "creative",
    keywords: ["design", "art", "music", "write", "writing", "paint", "drawing", "sketch", "compose", "create", "craft", "photography", "video", "edit", "blog"],
    emoji: "🎨",
    mascotReaction: "Let that creativity flow!",
  },
  {
    sentiment: "social",
    keywords: ["friends", "hangout", "drinks", "bar", "club", "meetup", "get together", "catch up", "reunion", "karaoke"],
    emoji: "🥳",
    mascotReaction: "Have fun out there!",
  },
];

export function detectSentiment(text: string): { sentiment: TaskSentiment; emoji: string; reaction: string } {
  const lower = text.toLowerCase();

  for (const rule of RULES) {
    for (const keyword of rule.keywords) {
      if (lower.includes(keyword)) {
        return {
          sentiment: rule.sentiment,
          emoji: rule.emoji,
          reaction: rule.mascotReaction,
        };
      }
    }
  }

  return { sentiment: "neutral", emoji: "", reaction: "" };
}

// Holiday-themed mascot costumes/accessories
export interface HolidayTheme {
  accessory: string;      // SVG overlay description
  greeting: string;       // What the mascot says
  animation: string;      // Animation style hint
  colors: string[];       // Theme colors
}

export function getHolidayTheme(holidayName: string): HolidayTheme | null {
  const lower = holidayName.toLowerCase();

  // Christmas / Xmas
  if (lower.includes("christmas") || lower.includes("xmas") || lower.includes("noel") || lower.includes("bozic")) {
    return { accessory: "santa-hat", greeting: "Meowy Christmas!", animation: "jingle", colors: ["#DC2626", "#16A34A", "#FBBF24"] };
  }
  // New Year
  if (lower.includes("new year") || lower.includes("nova godin")) {
    return { accessory: "party-hat", greeting: "Happy Mew Year!", animation: "fireworks", colors: ["#FBBF24", "#818CF8", "#EC4899"] };
  }
  // Easter
  if (lower.includes("easter") || lower.includes("uskrs") || lower.includes("vaskrs")) {
    return { accessory: "bunny-ears", greeting: "Happy Easter! Hop hop!", animation: "hop", colors: ["#F9A8D4", "#C4B5FD", "#A7F3D0"] };
  }
  // Valentine's Day
  if (lower.includes("valentine")) {
    return { accessory: "hearts", greeting: "Purrs of love~", animation: "hearts", colors: ["#EC4899", "#F43F5E", "#FB7185"] };
  }
  // Halloween
  if (lower.includes("halloween")) {
    return { accessory: "witch-hat", greeting: "Trick or treat! Meow!", animation: "spooky", colors: ["#F97316", "#7C3AED", "#1F2937"] };
  }
  // Independence Day / National Day
  if (lower.includes("independence") || lower.includes("national day") || lower.includes("dan drzavnosti")) {
    return { accessory: "flag", greeting: "Happy National Day!", animation: "wave", colors: ["#3B82F6", "#EF4444", "#F8FAFC"] };
  }
  // Labor Day / May Day / Workers Day
  if (lower.includes("labour") || lower.includes("labor") || lower.includes("worker") || lower.includes("may day") || lower.includes("praznik rada")) {
    return { accessory: "hardhat", greeting: "Rest up today!", animation: "relax", colors: ["#F59E0B", "#6366F1"] };
  }
  // Thanksgiving
  if (lower.includes("thanksgiving")) {
    return { accessory: "pilgrim-hat", greeting: "Grateful for you!", animation: "warm", colors: ["#B45309", "#DC2626", "#F59E0B"] };
  }
  // Mother's / Father's Day
  if (lower.includes("mother")) {
    return { accessory: "flower-crown", greeting: "Happy Mother's Day!", animation: "hearts", colors: ["#EC4899", "#F9A8D4", "#FDF2F8"] };
  }
  if (lower.includes("father")) {
    return { accessory: "tie", greeting: "Happy Father's Day!", animation: "proud", colors: ["#3B82F6", "#1E40AF", "#93C5FD"] };
  }
  // Any other holiday
  return { accessory: "bow", greeting: "Happy Holiday!", animation: "celebrate", colors: ["#6366F1", "#818CF8", "#A78BFA"] };
}

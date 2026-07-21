
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Wind, Phone, X, Send, Moon, Feather } from "lucide-react";

// ---------- helpers ----------
const ADJECTIVES = ["هادئ", "لطيف", "صافي", "دافئ", "رايق", "ساكن", "نوراني", "خفيف"];
const NOUNS = ["نسيم", "بحر", "قمر", "غيمة", "نجمة", "ياسمين", "فجر", "ندى"];

function randomNickname() {
  const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const n = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${a} ${n}`;
}

const CRISIS_NUMBER = "16328";

// ---------- rule-based supportive responder (no API cost) ----------

const CRISIS_WORDS = [
  "انتحار", "اموت", "أموت", "عايز اموت", "مش عايز اعيش", "اذي نفسي",
  "أأذي نفسي", "هموت نفسي", "مفيش فايدة مني", "احسن اموت",
];

const KEYWORD_RESPONSES = [
  {
    words: ["زعلان", "حزين", "زهقان", "تعبان نفسيا", "مكتئب", "مضايق"],
    replies: [
      "حاسس إنك بتمر بوقت تقيل عليك. عايز تحكيلي إيه اللي حصل؟",
      "مسموحلك تحس بكده، مش لازم تكون كويس طول الوقت. أنا هنا أسمعك.",
      "الحزن ده معناه إن في حاجة مهمة عندك اتأثرت. تحب تتكلم أكتر عنها؟",
    ],
  },
  {
    words: ["قلقان", "خايف", "متوتر", "عصبي", "مش قادر انام"],
    replies: [
      "القلق بيبقى تقيل فعلاً. إيه اللي بيشغل بالك أكتر دلوقتي؟",
      "خد نفس بسيط معايا لو تحب... تحب نعمل تمرين تنفس سوا؟",
      "طبيعي تحس بالتوتر في مواقف زي دي. مش لازم تواجهها لوحدك.",
    ],
  },
  {
    words: ["وحيد", "لوحدي", "محدش فاهمني", "معنديش حد"],
    replies: [
      "الإحساس بالوحدة صعب فعلاً، وأنا سامعك دلوقتي. مش لازم تكون لوحدك في اللحظة دي.",
      "حتى لو حواليك ناس، ممكن تحس إن محدش فاهمك بجد. عايز تحكيلي أكتر؟",
    ],
  },
  {
    words: ["تعبت", "مش قادر", "مش قادرة", "مليت", "فاشل", "فاشلة"],
    replies: [
      "الإحساس ده بيبان تقيل، وطبيعي تحس بيه في فترات زي دي. مش معنى كده إنك فاشل.",
      "لما حد يقول 'مش قادر' غالبًا بيبقى محمّل حاجات كتير. إيه اللي مكتّر عليك دلوقتي؟",
    ],
  },
  {
    words: ["اهلا", "أهلا", "السلام عليكم", "هاي", "ازيك"],
    replies: [
      "أهلاً بيك. إزيك النهارده؟ عايز تتكلم عن إيه؟",
      "أهلاً، مبسوط إنك هنا. حاسس بإيه دلوقتي؟",
    ],
  },
  {
    words: ["شكرا", "متشكر", "شكرًا"],
    replies: [
      "العفو، أنا موجود كل ما تحتاج تتكلم.",
      "تحت أمرك دايمًا. اعتني بنفسك.",
    ],
  },
];

const DEFAULT_REPLIES = [
  "سامعك. احكيلي أكتر عن اللي بتحس بيه؟",
  "شكرًا إنك بتشاركني ده، مش كل حد بيقدر يعبّر عن نفسه بسهولة.",
  "طيب، وبعدين حصل إيه؟",
  "حاسس إن ده مهم بالنسبة لك. عايز تفصّل أكتر؟",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateReply(userText, onCrisisDetected) {
  const text = userText.toLowerCase();

  if (CRISIS_WORDS.some((w) => text.includes(w))) {
    onCrisisDetected();
    return "سامعك، وحابب تعرف إنك مش لوحدك دلوقتي. الخط الساخن للدعم النفسي (16328) شغال ٢٤ ساعة ومجاني وسري تمامًا — ده أفضل حد يقدر يساعدك دلوقتي. تقدر تتصل بيهم فورًا؟";
  }

  for (const group of KEYWORD_RESPONSES) {
    if (group.words.some((w) => text.includes(w))) {
      return pick(group.replies);
    }
  }

  return pick(DEFAULT_REPLIES);
}

// simulate a short thinking delay so it feels conversational, not instant
function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// ---------- UI pieces ----------

function BreathingOrb() {
  return (
    <div className="orb-wrap" aria-hidden="true">
      <div className="orb" />
      <div className="orb orb-2" />
    </div>
  );
}

function CrisisModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="إغلاق">
          <X size={18} />
        </button>
        <Phone size={28} color="#C17A5A" />
        <h3>محتاج تتكلم مع حد دلوقتي؟</h3>
        <p>
          الخط الساخن للدعم النفسي التابع لوزارة الصحة المصرية متاح ٢٤ ساعة،
          مجاني، وسري تمامًا.
        </p>
        <a className="crisis-call" href={`tel:${CRISIS_NUMBER}`}>
          اتصل الآن — {CRISIS_NUMBER}
        </a>
        <p className="modal-note">
          لو في خطر مباشر على حياتك أو حياة حد تاني، توجه لأقرب مستشفى فورًا.
        </p>
      </div>
    </div>
  );
}

function Onboarding({ onStart }) {
  const [nickname, setNickname] = useState(randomNickname());

  return (
    <div className="screen onboarding">
      <BreathingOrb />
      <h1>مساحة</h1>
      <p className="subtitle">مكان هادي تتكلم فيه براحتك، من غير أي أسماء حقيقية.</p>

      <label className="field-label">اسمك المستعار</label>
      <div className="nickname-row">
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={24}
          className="nickname-input"
        />
        <button
          className="dice-btn"
          onClick={() => setNickname(randomNickname())}
          aria-label="اسم عشوائي جديد"
          type="button"
        >
          <Feather size={16} />
        </button>
      </div>

      <button
        className="primary-btn"
        onClick={() => onStart(nickname.trim() || randomNickname())}
      >
        ابدأ الحديث
      </button>

      <p className="disclaimer">
        ده مساعد آلي بسيط لسماعك ومش بديل عن معالج نفسي متخصص. في حالة
        الطوارئ، اتصل بـ {CRISIS_NUMBER}.
      </p>
    </div>
  );
}

function ChatScreen({ nickname, messages, onSend, loading, onShowCrisis, onReset }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const submit = () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <div className="screen chat-screen">
      <header className="chat-header">
        <div className="chat-header-title">
          <Moon size={18} color="#3A5A52" />
          <div>
            <div className="chat-name">مساحة</div>
            <div className="chat-nick">أنت: {nickname}</div>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-btn crisis-btn" onClick={onShowCrisis} title="مساعدة عاجلة">
            <Phone size={16} />
            <span>عاجل</span>
          </button>
          <button className="icon-btn" onClick={onReset} title="بداية جديدة">
            <Wind size={16} />
          </button>
        </div>
      </header>

      <div className="messages">
        {messages.length === 0 && (
          <div className="empty-hint">
            اكتب أي حاجة في بالك… محدش هيحكم عليك هنا.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role === "user" ? "bubble-user" : "bubble-ai"}`}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="bubble bubble-ai bubble-typing">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="composer">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="اكتب هنا…"
          className="composer-input"
        />
        <button className="send-btn" onClick={submit} disabled={loading} aria-label="إرسال">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

// ---------- main app ----------

export default function App() {
  const [screen, setScreen] = useState("loading"); // loading | onboarding | chat
  const [nickname, setNickname] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = localStorage.getItem("mesaha-session");
        if (raw) {
          const parsed = JSON.parse(raw);
          setNickname(parsed.nickname || "");
          setMessages(parsed.messages || []);
          setScreen(parsed.nickname ? "chat" : "onboarding");
        } else {
          setScreen("onboarding");
        }
      } catch {
        setScreen("onboarding");
      }
    })();
  }, []);

  const persist = useCallback((nick, msgs) => {
    try {
      localStorage.setItem(
        "mesaha-session",
        JSON.stringify({ nickname: nick, messages: msgs })
      );
    } catch {
      // best-effort; ignore failures
    }
  }, []);

  const handleStart = (nick) => {
    setNickname(nick);
    setScreen("chat");
    persist(nick, []);
  };

  const handleReset = async () => {
    setMessages([]);
    setScreen("onboarding");
    try {
      localStorage.removeItem("mesaha-session");
    } catch {
      // ignore
    }
  };

  const handleSend = async (text) => {
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    persist(nickname, next);
    setLoading(true);

    await delay(500 + Math.random() * 500); // feels like someone is typing
    const reply = generateReply(text, () => setShowCrisis(true));
    const withReply = [...next, { role: "assistant", content: reply }];
    setMessages(withReply);
    persist(nickname, withReply);
    setLoading(false);
  };

  return (
    <div className="app-root">
      <style>{css}</style>
      {screen === "onboarding" && <Onboarding onStart={handleStart} />}
      {screen === "chat" && (
        <ChatScreen
          nickname={nickname}
          messages={messages}
          onSend={handleSend}
          loading={loading}
          onShowCrisis={() => setShowCrisis(true)}
          onReset={handleReset}
        />
      )}
      {showCrisis && <CrisisModal onClose={() => setShowCrisis(false)} />}
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap');

* { box-sizing: border-box; }

.app-root {
  direction: rtl;
  font-family: 'IBM Plex Sans Arabic', sans-serif;
  background: #F6F3EC;
  color: #22302B;
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
}

.screen {
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F6F3EC;
}

/* Onboarding */
.onboarding {
  align-items: center;
  justify-content: center;
  padding: 40px 28px;
  text-align: center;
}

.orb-wrap {
  position: relative;
  width: 140px;
  height: 140px;
  margin-bottom: 28px;
}
.orb {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #B9C9BE, #3A5A52);
  animation: breathe 4.5s ease-in-out infinite;
  opacity: 0.9;
}
.orb-2 {
  background: radial-gradient(circle at 60% 65%, #E8DCC833, #C17A5A55);
  animation-delay: 0.6s;
  filter: blur(2px);
}
@keyframes breathe {
  0%, 100% { transform: scale(0.85); }
  50% { transform: scale(1.05); }
}
@media (prefers-reduced-motion: reduce) {
  .orb, .orb-2 { animation: none; }
}

.onboarding h1 {
  font-family: 'Tajawal', sans-serif;
  font-weight: 900;
  font-size: 34px;
  margin: 0 0 6px;
  color: #2E4A45;
}
.subtitle {
  color: #55645D;
  font-size: 15px;
  margin: 0 0 32px;
  max-width: 320px;
  line-height: 1.7;
}

.field-label {
  align-self: flex-start;
  font-size: 13px;
  color: #55645D;
  margin-bottom: 6px;
}

.nickname-row {
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 320px;
  margin-bottom: 22px;
}
.nickname-input {
  flex: 1;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1.5px solid #DAD2BF;
  background: #FFFFFF;
  font-family: 'IBM Plex Sans Arabic', sans-serif;
  font-size: 15px;
  text-align: right;
  outline: none;
  transition: border-color .2s;
}
.nickname-input:focus { border-color: #3A5A52; }
.dice-btn {
  width: 46px;
  border-radius: 14px;
  border: 1.5px solid #DAD2BF;
  background: #FFFFFF;
  color: #3A5A52;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-btn {
  width: 100%;
  max-width: 320px;
  padding: 15px;
  border-radius: 16px;
  border: none;
  background: #3A5A52;
  color: #F6F3EC;
  font-family: 'Tajawal', sans-serif;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: transform .15s, background .2s;
}
.primary-btn:hover { background: #2E4A45; transform: translateY(-1px); }

.disclaimer {
  margin-top: 24px;
  font-size: 12px;
  color: #8A8577;
  max-width: 300px;
  line-height: 1.7;
}

/* Chat */
.chat-screen { height: 100vh; }

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  background: #FFFFFF;
  border-bottom: 1px solid #E9E3D3;
}
.chat-header-title { display: flex; align-items: center; gap: 10px; }
.chat-name {
  font-family: 'Tajawal', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: #2E4A45;
}
.chat-nick { font-size: 11px; color: #8A8577; }

.header-actions { display: flex; gap: 8px; }
.icon-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid #E9E3D3;
  background: #FBFAF6;
  color: #3A5A52;
  cursor: pointer;
  font-size: 12px;
  font-family: 'IBM Plex Sans Arabic', sans-serif;
}
.crisis-btn { color: #C17A5A; border-color: #EAD4C7; background: #FBF3EE; }

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.empty-hint {
  margin: auto;
  color: #8A8577;
  font-size: 14px;
  text-align: center;
  max-width: 240px;
  line-height: 1.8;
}

.bubble {
  max-width: 78%;
  padding: 12px 15px;
  border-radius: 18px;
  font-size: 14.5px;
  line-height: 1.75;
  white-space: pre-wrap;
}
.bubble-user {
  align-self: flex-start;
  background: #3A5A52;
  color: #F6F3EC;
  border-bottom-left-radius: 4px;
}
.bubble-ai {
  align-self: flex-end;
  background: #FFFFFF;
  border: 1px solid #E9E3D3;
  color: #22302B;
  border-bottom-right-radius: 4px;
}
.bubble-typing { display: flex; gap: 4px; padding: 16px; }
.dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #C1B9A3; animation: blink 1.2s infinite;
}
.dot:nth-child(2) { animation-delay: .2s; }
.dot:nth-child(3) { animation-delay: .4s; }
@keyframes blink { 0%,80%,100% { opacity: .3; } 40% { opacity: 1; } }

.composer {
  display: flex;
  gap: 8px;
  padding: 14px;
  background: #FFFFFF;
  border-top: 1px solid #E9E3D3;
}
.composer-input {
  flex: 1;
  padding: 13px 16px;
  border-radius: 14px;
  border: 1.5px solid #E9E3D3;
  background: #F6F3EC;
  font-family: 'IBM Plex Sans Arabic', sans-serif;
  font-size: 14.5px;
  text-align: right;
  outline: none;
}
.composer-input:focus { border-color: #3A5A52; }
.send-btn {
  width: 46px;
  border-radius: 14px;
  border: none;
  background: #3A5A52;
  color: #F6F3EC;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.send-btn:disabled { opacity: .5; cursor: default; }

/* Crisis modal */
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(34,48,43,0.5);
  display: flex; align-items: center; justify-content: center;
  padding: 20px; z-index: 50;
}
.modal {
  position: relative;
  background: #FFFFFF;
  border-radius: 20px;
  padding: 28px 24px;
  max-width: 340px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.modal h3 {
  font-family: 'Tajawal', sans-serif;
  margin: 4px 0 0;
  font-size: 18px;
  color: #2E4A45;
}
.modal p { font-size: 13.5px; color: #55645D; line-height: 1.7; margin: 0; }
.modal-note { font-size: 12px; color: #B0876F; }
.modal-close {
  position: absolute; top: 12px; left: 12px;
  border: none; background: transparent; color: #8A8577; cursor: pointer;
}
.crisis-call {
  display: block;
  width: 100%;
  padding: 13px;
  border-radius: 14px;
  background: #C17A5A;
  color: #FFFFFF;
  font-family: 'Tajawal', sans-serif;
  font-weight: 700;
  text-decoration: none;
  margin: 6px 0;
}
`;

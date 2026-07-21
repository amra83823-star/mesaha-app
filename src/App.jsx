import React from 'react';

const ADJECTIVES = ["عفيف", "نوراني", "ساكن", "وليد", "صافي", "عاطر", "لطيف", "هدير"];
const NOUNS = ["ندى", "فجر", "ياسمين", "نجمة", "غيمة", "قمر", "بدر", "نسيم"];

function randomNickname() {
  const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const n = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${a} ${n}`;
}

const CRISIS_NUMBER = "16328";

const CRISIS_WORDS = [
  "أذي نفسي", "مش عايز أعيش", "عايز أموت", "أموت", "انتحار",
  "أحسن أموت", "مفيش فايدة مني", "هموت نفسي", "أأذي نفسي"
];

const KEYWORD_RESPONSES = [
  {
    words: ["متضايق", "مكتئب", "تعبان نفسيا", "زعلان", "حزين"],
    replies: [
      "حاسس إنك بتمر بوقت ثقيل عليك، حابب تحكيلي إيه اللي حصل؟",
      "مسموحلك تحس بكدة، مش لازم تكون كويس طول الوقت. أنا هنا أسمعك",
      "الحزن ده معناه إن فيه حاجة مهمة عندك اتأذت.. تعالى نتكلم أكثر عنها"
    ],
  },
  {
    words: ["مش قادر انام", "حاسس", "متوتر", "خايف", "تعبان"],
    replies: [
      "القلق بيكون صعب جداً، حاول تاخد نفس عميق وتهدي نفسك."
    ],
  }
];

export default function App() {
  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>تطبيق مساحة للدعم النفسي</h1>
      <p>أهلاً بك في مساحتك الآمنة للدردشة والدعم النفسي.</p>
    </div>
  );
}

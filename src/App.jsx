import React, { useState, useEffect, useRef, useCallback } from "react";
import { Wind, Phone, X, Send, Moon, Feather } from "lucide-react";

const ADJECTIVES = ["هادئ", "لطيف", "صافي", "دافئ", "رايق", "ساكن", "نوراني", "خفيف"];
const NOUNS = ["نسيم", "بحر", "قمر", "غيمة", "نجمة", "ياسمين", "فجر", "ندى"];

function randomNickname() {
  const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const n = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${a} ${n}`;
}

const CRISIS_NUMBER = "16328";

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
      "القلق بي

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

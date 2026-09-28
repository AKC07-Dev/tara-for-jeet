import { motion } from "motion/react";

type BearProps = {
  mood?: "wave" | "sleep" | "heart" | "peek" | "together" | "sign";
  className?: string;
};

function BearFace({ x = 0, blush = false }: { x?: number; blush?: boolean }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <circle cx="33" cy="30" r="12" fill="var(--bear)" stroke="var(--bear-line)" strokeWidth="1.4" />
      <circle cx="87" cy="30" r="12" fill="var(--bear)" stroke="var(--bear-line)" strokeWidth="1.4" />
      <ellipse cx="60" cy="66" rx="45" ry="43" fill="var(--bear)" stroke="var(--bear-line)" strokeWidth="1.5" />
      <ellipse cx="45" cy="67" rx="2.2" ry="2.8" fill="var(--bear-line)" />
      <ellipse cx="75" cy="67" rx="2.2" ry="2.8" fill="var(--bear-line)" />
      <ellipse cx="60" cy="79" rx="3.8" ry="2.7" fill="var(--bear-line)" />
      <path d="M60 81v3m-5 0q5 5 10 0" fill="none" stroke="var(--bear-line)" strokeWidth="1.5" strokeLinecap="round" />
      {blush && <><ellipse cx="31" cy="78" rx="7" ry="3" fill="var(--bear-blush)" opacity=".7" /><ellipse cx="89" cy="78" rx="7" ry="3" fill="var(--bear-blush)" opacity=".7" /></>}
    </g>
  );
}

export function Bear({ mood = "wave", className = "" }: BearProps) {
  if (mood === "together") return (
    <motion.svg className={className} viewBox="0 0 220 155" role="img" aria-label="Two little bears sitting together" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .8 }}>
      <path d="M11 147Q110 138 209 147" fill="none" stroke="var(--bear-line)" opacity=".4" />
      <g transform="translate(0 5)"><BearFace blush /><ellipse cx="60" cy="136" rx="34" ry="21" fill="var(--bear)" stroke="var(--bear-line)" strokeWidth="1.5" /><ellipse cx="34" cy="134" rx="12" ry="7" fill="var(--bear)" stroke="var(--bear-line)" /><ellipse cx="86" cy="134" rx="12" ry="7" fill="var(--bear)" stroke="var(--bear-line)" /></g>
      <g transform="translate(102 8)"><BearFace blush /><ellipse cx="60" cy="133" rx="34" ry="21" fill="var(--bear)" stroke="var(--bear-line)" strokeWidth="1.5" /><ellipse cx="34" cy="132" rx="12" ry="7" fill="var(--bear)" stroke="var(--bear-line)" /><ellipse cx="86" cy="132" rx="12" ry="7" fill="var(--bear)" stroke="var(--bear-line)" /></g>
      <path d="M109 105c-7-10-18 0 0 14 18-14 7-24 0-14Z" fill="var(--bear-blush)" />
    </motion.svg>
  );
  return (
    <motion.svg className={className} viewBox="0 0 120 155" role="img" aria-label={`A little ${mood === "sleep" ? "sleeping" : "smiling"} bear`} initial={{ rotate: -5 }} animate={{ rotate: mood === "sleep" ? -4 : 3 }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.8, ease: "easeInOut" }}>
      <ellipse cx="60" cy="129" rx="34" ry="23" fill="var(--bear)" stroke="var(--bear-line)" strokeWidth="1.5" />
      <ellipse cx="33" cy="130" rx="13" ry="7" fill="var(--bear)" stroke="var(--bear-line)" strokeWidth="1.4" />
      <ellipse cx="87" cy="130" rx="13" ry="7" fill="var(--bear)" stroke="var(--bear-line)" strokeWidth="1.4" />
      <BearFace blush />
      {mood === "sleep" ? <g fill="none" stroke="var(--bear-line)" strokeWidth="1.5" strokeLinecap="round"><path d="M40 67q5 5 10 0M70 67q5 5 10 0" /><path d="M94 37l7-5h-6l7-5" opacity=".5" /></g> : null}
      {mood === "heart" ? <path d="M60 116c-23-17-12-29 0-18 12-11 23 1 0 18Z" fill="var(--bear-blush)" stroke="var(--bear-line)" strokeWidth="1" /> : null}
      {mood === "wave" || mood === "peek" ? <g transform="rotate(-23 99 112)"><ellipse cx="99" cy="113" rx="10" ry="18" fill="var(--bear)" stroke="var(--bear-line)" strokeWidth="1.5" /></g> : null}
      {mood === "sign" ? <><rect x="20" y="102" width="80" height="32" rx="3" fill="var(--paper)" stroke="var(--bear-line)" /><text x="60" y="123" textAnchor="middle" fontSize="12" fill="var(--bear-line)" fontFamily="serif">hi, jeet ♡</text></> : null}
    </motion.svg>
  );
}
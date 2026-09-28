import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Heart, RotateCcw, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Bear } from "@/components/Bear";
import { Button } from "@/components/ui/button";

type Stage = "intro" | "password" | "welcome" | "rules" | "quiz" | "notice" | "open" | "stars" | "press" | "slow" | "letter" | "promise" | "final";
const journey: Stage[] = ["rules", "quiz", "notice", "open", "stars", "press", "slow", "letter", "promise"];
const chapterNames = ["The rules", "A small interrogation", "Things I notice", "Open when...", "The constellation", "Do not press", "Read this slowly", "The letter", "The promise"];
const rules = [
  { question: "Do you agree that you deserve happiness?", yes: "Good. This was not actually up for debate.", no: "Incorrect, but I admire the confidence. Try again." },
  { question: "Do you agree that taking care of everyone doesn't mean forgetting yourself?", yes: "Excellent. Please remember that outside this website too.", no: "Jeet. Even your phone needs charging. Again." },
  { question: "Do you agree that Tara is allowed to annoy you indefinitely?", yes: "A legally binding agreement. Probably.", no: "Unfortunately, this clause is non-negotiable." },
  { question: "Do you accept that you are loved?", yes: "There you go. That's all I wanted to hear.", no: "You don't have to believe it yet. I'll keep reminding you." },
];
const quiz = [
  { q: "When something bothers you, what do you usually do?", options: ["Actually talk about it", "Overthink in complete silence", "Say ‘I'm fine’", "Work until I forget"] },
  { q: "Your idea of a break is...", options: ["A real day off", "Checking one tiny work thing", "Making plans for next week", "What's a break?"] },
  { q: "When someone asks how you are, you say...", options: ["Honestly? I'm tired", "All good", "Busy, but fine", "Let's talk about you instead"] },
];
const notices = [
  "I know you don't always say when you're tired.",
  "I know you've had to grow up faster than you should have.",
  "I know trusting people hasn't always been easy.",
  "I know you carry more than you tell people.",
  "And I know you probably don't realize how important you are to me.",
];
const letters = [
  { title: "WHEN YOU'RE TIRED", message: "You can stop for a minute. The world won't fall apart because you rested. And if it feels like it might, call me. I'll sit with you while it doesn't." },
  { title: "WHEN YOU'RE ANGRY", message: "You don't have to make your feelings smaller for me. Tell me the whole messy version. I can handle it." },
  { title: "WHEN YOU FEEL ALONE", message: "Even if we're not in the same room, you don't have to do this by yourself. Message me anything. Even just a dot." },
  { title: "WHEN YOU DON'T TRUST ANYONE", message: "I know trust isn't something I can ask you to hand over. I'll just keep showing up, in the little ways, for as long as you let me." },
  { title: "WHEN YOU THINK YOU'RE NOT DOING ENOUGH", message: "Look at how much you're already carrying. You don't have to prove your worth by exhausting yourself. I'm proud of you, right now." },
  { title: "WHEN YOU NEED TO SMILE", message: "Imagine me very seriously telling a tiny bear about you. The bear agrees with me: you're pretty wonderful. Also, it says you owe it a snack." },
];
const truths = ["Someone is proud of you.", "Someone wants you to rest.", "Someone believes in you.", "Someone wants to hear your nonsense.", "Someone wants you to be happy.", "Someone is here."];
const starPositions = [{ x: 16, y: 30 }, { x: 33, y: 15 }, { x: 51, y: 31 }, { x: 70, y: 15 }, { x: 86, y: 30 }, { x: 51, y: 80 }];
const presses = ["Why did you listen to the website?", "Jeet.", "You really cannot resist buttons.", "Okay fine. One more.", "I made this just to make you smile."];
const slowLines = ["You don't have to explain everything.", "You don't have to be strong around me.", "You don't have to pretend.", "You don't have to earn your place in my life.", "You can come to me when everything feels too much.", "You can also come to me when absolutely nothing is wrong.", "You can talk.", "You can stay quiet.", "You can be yourself.", "I'll still be here."];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "for jeet, from tara — a little place just for you" },
    { name: "description", content: "A private little world from Tara to Jeet. Come back whenever you need." },
    { property: "og:title", content: "for jeet, from tara" },
    { property: "og:description", content: "A private little world from Tara to Jeet. Come back whenever you need." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Gift,
});

function Gift() {
  const [stage, setStage] = useState<Stage>("intro");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [opened, setOpened] = useState<number | null>(null);
  const [seenLetters, setSeenLetters] = useState<number[]>([]);
  const [seenStars, setSeenStars] = useState<number[]>([]);
  const [activeStar, setActiveStar] = useState<number | null>(null);
  const [pressCount, setPressCount] = useState(0);
  const [letterOpen, setLetterOpen] = useState(false);
  const [letterOpening, setLetterOpening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const reducedMotion = useReducedMotion();
  const chapter = journey.indexOf(stage);
  const night = stage === "stars" || stage === "final";

  useEffect(() => {
    try { if (window.localStorage.getItem("jeet-tara-entered") === "yes") setStage("welcome"); } catch { /* storage may be unavailable */ }
  }, []);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [stage]);
  const go = (to: Stage) => { setStep(0); setFeedback(""); setStage(to); };
  const next = () => { const index = journey.indexOf(stage); if (index >= 0) go(journey[index + 1] ?? "final"); };
  const back = () => { const index = journey.indexOf(stage); if (index > 0) go(journey[index - 1] ?? "welcome"); else if (index === 0) go("welcome"); };
  const enter = () => {
    if (password.trim().toLowerCase() !== "tara") { setPasswordError(password ? "Hmm. Try the name of the person who made this for you." : "A little hint: you know her name."); return; }
    setPasswordError("");
    try { window.localStorage.setItem("jeet-tara-entered", "yes"); } catch { /* theatrical gate works without storage */ }
    go("welcome");
  };
  const reset = () => { setQuizAnswers([]); setSeenLetters([]); setSeenStars([]); setPressCount(0); setLetterOpen(false); setLetterOpening(false); setThinking(false); setOpened(null); go("rules"); };
  const openLetter = () => { setLetterOpening(true); window.setTimeout(() => setLetterOpen(true), reducedMotion ? 0 : 800); };
  const press = () => { setPressCount((value) => value + 1); setCelebrating(true); window.setTimeout(() => setCelebrating(false), 1300); };

  return <main className={`story-shell ${night ? "story-night" : ""}`}>
    <div className="story-frame">
      {night && <div className="night-stars" aria-hidden="true" />}
      <header className="absolute top-0 left-0 right-0 z-10 flex h-20 items-center justify-between px-9 sm:px-14">
        <span className="story-script text-[23px] leading-none">for jeet, from tara<span className="text-rose"> ♡</span></span>
        {chapter >= 0 && <span className="story-eyebrow text-muted-foreground tabular-nums">{String(chapter + 1).padStart(2, "0")} / 09</span>}
        {stage === "final" && <span className="story-eyebrow text-muted-foreground">always yours</span>}
      </header>
      {chapter >= 0 && <div className="absolute top-[79px] left-9 right-9 sm:left-14 sm:right-14 h-px bg-border/60 z-10"><motion.div className="h-px bg-rose" animate={{ width: `${((chapter + 1) / 9) * 100}%` }} transition={{ duration: .7 }} /></div>}
      {chapter >= 0 && <Button variant="quiet" size="icon" aria-label="Previous chapter" title="Previous chapter" onClick={back} className="absolute bottom-5 left-8 sm:left-14 z-10"><ArrowLeft /></Button>}
      <AnimatePresence mode="wait">
        <motion.div key={stage} className="story-content" initial={reducedMotion ? false : { opacity: 0, y: 24, filter: "blur(5px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={reducedMotion ? {} : { opacity: 0, y: -18, filter: "blur(4px)" }} transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}>
          {stage === "intro" && <section className="w-full max-w-[680px] text-center flex flex-col items-center">
            <p className="story-script text-rose text-4xl sm:text-5xl -rotate-6">pssst...</p>
            <div className="mt-7 h-px w-16 bg-rose/50" />
            <p className="story-eyebrow text-muted-foreground mt-10 max-w-[250px] leading-[2.2]">this little place is only for one very specific person.</p>
            <h1 className="story-title text-[clamp(4rem,11vw,8rem)] mt-10">Are you <em className="font-normal text-rose">Jeet?</em></h1>
            <Bear mood="peek" className="w-20 sm:w-24 mt-4 -mb-4" />
            <Button variant="story" size="story" className="mt-7" onClick={() => go("password")}>yes, obviously <ArrowRight /></Button>
            <p className="story-script text-muted-foreground text-xl mt-9">a very important question, actually</p>
          </section>}
          {stage === "password" && <section className="w-full max-w-[500px] text-center flex flex-col items-center">
            <p className="story-eyebrow text-rose">the extremely exclusive entrance</p>
            <h1 className="story-title text-6xl sm:text-8xl mt-9">Okay then...<br/><em>prove it.</em></h1>
            <p className="text-muted-foreground text-sm mt-7">One name. You know the one.</p>
            <form className="w-full max-w-[300px] mt-9 flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); enter(); }}>
              <input autoFocus type="password" autoComplete="off" aria-label="Password" placeholder="her name" value={password} onChange={(event) => { setPassword(event.target.value); setPasswordError(""); }} className="h-13 w-full border-b border-border bg-transparent px-4 text-center text-lg outline-none placeholder:text-muted-foreground/60 focus:border-rose" />
              <Button type="submit" variant="story" size="story">let me in <ArrowRight /></Button>
            </form>
            <p role="alert" className="min-h-7 mt-5 story-script text-rose text-xl">{passwordError}</p>
            <Button variant="quiet" size="touch" className="mt-5" onClick={() => go("intro")}><ArrowLeft /> back</Button>
          </section>}
          {stage === "welcome" && <section className="w-full max-w-[730px] text-center flex flex-col items-center">
            <span className="story-eyebrow text-rose">access granted · for one person only</span>
            <h1 className="story-title text-6xl sm:text-[106px] mt-8">Fine.<br/><em>You may enter.</em></h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-7 max-w-[380px] mt-9">I made you a little place to get away from everything for a while.</p>
            <Bear mood="sign" className="w-25 mt-8 -mb-2" />
            <Button variant="story" size="story" className="mt-6" onClick={() => go("rules")}>come on in <ArrowRight /></Button>
            <p className="story-script text-rose text-xl mt-7">— tara</p>
          </section>}
          {stage === "rules" && <section className="w-full max-w-[670px] text-center flex flex-col items-center">
            <ChapterLabel number="01" title="a few ground rules" />
            <h1 className="story-title text-5xl sm:text-7xl mt-7">First, we need to<br/><em>agree on something.</em></h1>
            <div className="story-rule mt-10" />
            <AnimatePresence mode="wait"><motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-[230px] w-full flex flex-col items-center justify-center">
              <span className="story-eyebrow text-rose mb-5">question {step + 1} of {rules.length}</span>
              <p className="font-display text-[clamp(2rem,6vw,3.6rem)] leading-[1.07] max-w-[580px]">{rules[step]?.question}</p>
            </motion.div></AnimatePresence>
            <p role="status" className="story-script text-rose text-xl min-h-8 mb-4">{feedback}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="story" size="touch" onClick={() => { setFeedback(rules[step]?.yes ?? "Good."); window.setTimeout(() => { if (step < rules.length - 1) { setStep(step + 1); setFeedback(""); } else next(); }, 1100); }}>I agree <Check /></Button>
              <Button variant="paper" size="touch" onClick={() => setFeedback(rules[step]?.no ?? "Try again.")}>hmm, no</Button>
            </div>
            <div className="story-rule mt-10" />
            <Bear mood="heart" className="w-16 mt-4" />
          </section>}
          {stage === "quiz" && <section className="w-full max-w-[680px] text-center flex flex-col items-center">
            <ChapterLabel number="02" title="an extremely scientific assessment" />
            {step < quiz.length ? <>
              <h1 className="story-title text-5xl sm:text-7xl mt-8">Just a few<br/><em>questions.</em></h1>
              <span className="story-eyebrow text-muted-foreground mt-8">{step + 1} / {quiz.length}</span>
              <AnimatePresence mode="wait"><motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="w-full">
                <p className="font-display text-3xl sm:text-4xl mt-7 mb-8">{quiz[step]?.q}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {(quiz[step]?.options ?? []).map((option, index) => <Button key={option} variant="paper" size="touch" className="!h-auto min-h-17 whitespace-normal text-left justify-start px-5 py-4 leading-5" onClick={() => { setQuizAnswers([...quizAnswers, index]); setStep(step + 1); }}>{String.fromCharCode(65 + index)}. &nbsp;{option}</Button>)}
                </div>
              </motion.div></AnimatePresence>
            </> : <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
              <Bear mood="sleep" className="w-24 mt-8" />
              <p className="story-eyebrow text-rose mt-5">your official diagnosis</p>
              <h1 className="story-title text-5xl sm:text-7xl mt-5 max-w-[600px]">You are ridiculously bad at admitting when you're tired.</h1>
              <p className="story-script text-rose text-3xl mt-6">Luckily, Tara knows.</p>
              <Button variant="story" size="story" className="mt-9" onClick={next}>continue <ArrowRight /></Button>
            </motion.div>}
          </section>}
          {stage === "notice" && <section className="w-full max-w-[800px] text-center flex flex-col items-center">
            <ChapterLabel number="03" title="things i notice" />
            <p className="story-script text-rose text-2xl mt-5">even when you don't tell me</p>
            <div className="w-full mt-10 sm:mt-12 space-y-6 sm:space-y-8">
              {notices.slice(0, step + 1).map((line, i) => <motion.p key={line} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }} className={`font-display leading-[1.08] ${i === step ? "text-[clamp(2.35rem,7vw,4.8rem)] text-foreground" : "text-xl sm:text-2xl text-muted-foreground/70"}`}>{line}</motion.p>)}
            </div>
            <Button variant="story" size="story" className="mt-11" onClick={() => step < notices.length - 1 ? setStep(step + 1) : next()}>{step < notices.length - 1 ? "there's more" : "keep going"} <ArrowRight /></Button>
          </section>}
          {stage === "open" && <section className="w-full max-w-[940px] text-center flex flex-col items-center">
            <ChapterLabel number="04" title="a drawer of little reminders" />
            <h1 className="story-title text-6xl sm:text-8xl mt-6">Open <em>when...</em></h1>
            <p className="text-sm text-muted-foreground mt-5">Pick whichever one you need right now.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full mt-10">
              {letters.map((item, index) => <Button key={item.title} variant="paper" className="relative !h-auto min-h-36 sm:min-h-44 flex-col whitespace-normal px-3 sm:px-6 py-6 text-center group" onClick={() => { setOpened(index); setSeenLetters((seen) => seen.includes(index) ? seen : [...seen, index]); }}>
                <span className="font-display text-3xl text-rose group-hover:scale-110 transition-transform">✉</span>
                <span className="story-eyebrow text-[9px] sm:text-[10px] mt-3 leading-5">{item.title}</span>
                {seenLetters.includes(index) && <span className="absolute top-3 right-3 text-rose"><Check size={13} /></span>}
              </Button>)}
            </div>
            <Button variant="quiet" size="touch" className="mt-7" onClick={next}>continue when you're ready <ArrowRight /></Button>
            <AnimatePresence>{opened !== null && <motion.div className="fixed inset-0 z-30 flex items-center justify-center bg-night/70 px-5 py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpened(null)}>
              <motion.div role="dialog" aria-modal="true" aria-label={letters[opened]?.title ?? "A little note"} className="letter-paper w-full max-w-[480px] relative px-8 sm:px-12 py-11 sm:py-14 text-left" initial={{ y: 30, rotate: -2, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} exit={{ y: 25, opacity: 0 }} onClick={(event) => event.stopPropagation()}>
                <span className="story-eyebrow text-rose">a note from tara</span>
                <h2 className="font-display text-4xl sm:text-5xl mt-5 leading-none">{(letters[opened]?.title ?? "A little note").toLowerCase()}</h2>
                <div className="story-rule my-7" />
                <p className="font-display text-[25px] sm:text-[29px] leading-[1.25]">{letters[opened]?.message}</p>
                <p className="story-script text-rose text-3xl mt-8">— tara ♡</p>
                <Button variant="quiet" size="touch" className="mt-7 -ml-3" onClick={() => setOpened(null)}>close this note <ArrowRight /></Button>
              </motion.div>
            </motion.div>}</AnimatePresence>
          </section>}
          {stage === "stars" && <section className="w-full max-w-[900px] text-center flex flex-col items-center">
            <ChapterLabel number="05" title="the constellation" />
            <h1 className="story-title text-5xl sm:text-7xl mt-6">Look up, <em>Jeet.</em></h1>
            <p className="text-sm text-muted-foreground mt-4">Some things are true even in the dark. Touch the stars.</p>
            <div className="relative w-full max-w-[700px] h-[310px] sm:h-[380px] mt-4" aria-label="Six stars with messages">
              <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {seenStars.length >= 4 && <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: .52 }} transition={{ duration: 1.5 }} d="M51 80 C37 66 16 49 16 30 C16 15 33 10 51 31 C69 10 86 15 86 30 C86 49 65 66 51 80" fill="none" stroke="var(--gold)" strokeWidth=".18" />}
              </svg>
              {starPositions.map((position, index) => <Button key={index} variant="quiet" size="icon" className={`star-point ${seenStars.includes(index) ? "active text-gold" : "text-night-foreground/70"}`} style={{ left: `${position.x}%`, top: `${position.y}%` }} aria-label={`Reveal star ${index + 1}`} title={`Star ${index + 1}`} onClick={() => { setActiveStar(index); setSeenStars((seen) => seen.includes(index) ? seen : [...seen, index]); }}><Star size={index === 5 ? 20 : 15} fill={seenStars.includes(index) ? "currentColor" : "none"} /></Button>)}
            </div>
            <div className="h-14 flex items-center justify-center" role="status"><AnimatePresence mode="wait">{activeStar !== null && <motion.p key={activeStar} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-display text-2xl sm:text-3xl text-gold">{truths[activeStar]}</motion.p>}</AnimatePresence></div>
            {seenStars.length >= 4 && <Button variant="story" size="story" className="mt-5" onClick={next}>take this with you <ArrowRight /></Button>}
            <p className="story-eyebrow text-muted-foreground mt-6">{seenStars.length} of 6 little truths found</p>
          </section>}
          {stage === "press" && <section className="w-full max-w-[700px] text-center flex flex-col items-center relative">
            <ChapterLabel number="06" title="important warning" />
            <h1 className="story-title text-6xl sm:text-8xl mt-8">Whatever you do...</h1>
            <motion.div whileHover={{ rotate: 2, scale: 1.04 }} whileTap={{ scale: .91 }} className="mt-12"><Button variant="rose" onClick={press} className="!rounded-full !w-48 !h-48 sm:!w-56 sm:!h-56 !text-base sm:!text-lg !font-bold !whitespace-normal !shadow-[0_12px_0_var(--border)] tracking-[0.1em]">DO NOT<br/>PRESS</Button></motion.div>
            {celebrating && <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <motion.span key={`${pressCount}-${i}`} className="confetti-piece" style={{ left: "50%", top: "55%" }} initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }} animate={{ x: Math.cos(i * 2.4) * (90 + i * 9), y: Math.sin(i * 2.4) * (65 + i * 8) + 80, opacity: 0, rotate: i * 33 }} transition={{ duration: 1.2, ease: "easeOut" }} />)}</div>}
            <AnimatePresence mode="wait"><motion.p key={pressCount} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl sm:text-4xl mt-12 min-h-12">{pressCount === 0 ? "You know you want to." : presses[Math.min(pressCount - 1, presses.length - 1)]}</motion.p></AnimatePresence>
            {pressCount >= 2 && <Bear mood="heart" className="w-18 mt-2" />}
            {pressCount >= 5 && <Button variant="story" size="story" className="mt-6" onClick={next}>okay, okay. continue <ArrowRight /></Button>}
          </section>}
          {stage === "slow" && <section className="w-full max-w-[760px] text-center flex flex-col items-center">
            <ChapterLabel number="07" title="read this slowly" />
            <div className="w-9 h-px bg-rose mt-12 mb-8" />
            <div className="min-h-[235px] sm:min-h-[270px] flex items-center justify-center w-full"><AnimatePresence mode="wait"><motion.h1 key={step} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: .6 }} className="story-title text-[clamp(2.9rem,8vw,6rem)]">{slowLines[step]}</motion.h1></AnimatePresence></div>
            <div className="w-9 h-px bg-rose mt-7 mb-10" />
            <Button variant="story" size="story" onClick={() => step < slowLines.length - 1 ? setStep(step + 1) : next()}>{step < slowLines.length - 1 ? "and..." : "one more thing"} <ArrowRight /></Button>
            <span className="story-eyebrow text-muted-foreground mt-8 tabular-nums">{String(step + 1).padStart(2, "0")} / 10</span>
          </section>}
          {stage === "letter" && <section className="w-full max-w-[760px] text-center flex flex-col items-center">
            <ChapterLabel number="08" title="the letter" />
            {!letterOpen ? <>
              <h1 className="story-title text-5xl sm:text-7xl mt-7">There's something I couldn't<br/><em>turn into a button.</em></h1>
              <div className={`envelope mt-14 ${letterOpening ? "open" : ""}`} aria-label="A sealed letter from Tara"><span className="envelope-seal">t</span></div>
              <Button variant="story" size="story" className="mt-11" disabled={letterOpening} onClick={openLetter}>open it <Heart /></Button>
            </> : <motion.div initial={{ opacity: 0, y: 30, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: .85 }} className="letter-paper w-full max-w-[660px] text-left px-7 sm:px-14 py-10 sm:py-14 mt-7">
              <span className="story-eyebrow text-rose">a letter, just for you</span>
              <h1 className="font-display text-5xl sm:text-6xl mt-5">Dear Jeet,</h1>
              <div className="font-display text-[23px] sm:text-[27px] leading-[1.33] space-y-5 mt-7">
                <p>I know life has asked a lot of you, maybe earlier than it should have. You stepped up, kept going, and made space for everyone else's needs. I see that. I also see how tired you get, even when you say you're fine.</p>
                <p>I know people have given you reasons to be careful with your trust. I won't pretend a letter can undo that. I just want you to know that with me, you don't have to have the right words. You don't have to be cheerful. You don't have to carry everything alone.</p>
                <p>You are not a bad person because of what you've been through. Your past isn't the whole story of you. And the things you do for everyone else are not the only reason you matter to me. You matter on the quiet days too, when you haven't achieved anything at all.</p>
                <p>Come to me when you're frustrated. Come to me when you're happy. Come to me when you have no idea what you need. We can talk, or we can just sit. I really do mean it: I'm here.</p>
                <p>I hope there are softer, lighter days ahead. I want you to be around to enjoy them.</p>
              </div>
              <p className="story-script text-rose text-4xl mt-10">Love, Tara ♡</p>
              <div className="story-rule mt-8" />
              <Button variant="story" size="story" className="mt-8" onClick={next}>fold this away <ArrowRight /></Button>
            </motion.div>}
          </section>}
          {stage === "promise" && <section className="w-full max-w-[700px] text-center flex flex-col items-center">
            <ChapterLabel number="09" title="before you go" />
            <Bear mood="heart" className="w-26 mt-8" />
            <h1 className="story-title text-6xl sm:text-8xl mt-6">One tiny <em>promise?</em></h1>
            <p className="font-display text-3xl sm:text-5xl leading-[1.1] mt-9 max-w-[610px]">Please don't forget to take care of yourself while taking care of everyone else.</p>
            <p role="status" className="story-script text-rose text-2xl min-h-10 mt-8">{thinking ? "That's a very businessman answer." : ""}</p>
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              <Button variant="story" size="story" onClick={() => go("final")}>Deal 🤝</Button>
              {!thinking && <Button variant="paper" size="story" onClick={() => setThinking(true)}>I'll think about it</Button>}
            </div>
          </section>}
          {stage === "final" && <section className="w-full max-w-[750px] text-center flex flex-col items-center">
            <span className="story-eyebrow text-gold">a little place to return to</span>
            <div className="mt-9 space-y-2 sm:space-y-3">
              {["Whatever happens...", "however heavy life gets...", "you will always have a place here."].map((line, i) => <motion.p key={line} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5 + i * .85, duration: .85 }} className={`font-display leading-[1.05] ${i === 2 ? "text-[clamp(3rem,8vw,6rem)] text-night-foreground" : "text-[clamp(2.2rem,6vw,4rem)] text-night-foreground/70"}`}>{line}</motion.p>)}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.1 }} className="flex flex-col items-center">
              <Bear mood="together" className="w-47 sm:w-55 mt-9" />
              <p className="font-display text-3xl sm:text-4xl mt-5">Come back whenever you need.</p>
              <p className="story-script text-gold text-4xl mt-4">— Tara</p>
              <Button variant="quiet" size="touch" className="mt-9" onClick={reset}><RotateCcw /> start again</Button>
            </motion.div>
          </section>}
        </motion.div>
      </AnimatePresence>
      <footer className="absolute bottom-6 right-9 sm:right-14 text-muted-foreground/70 story-eyebrow text-[8px] z-10 hidden sm:block">made only for you <Sparkles className="inline w-3 h-3 ml-1" /></footer>
    </div>
  </main>;
}
function ChapterLabel({ number, title }: { number: string; title: string }) {
  return <p className="story-eyebrow text-rose flex items-center gap-3"><span className="w-6 h-px bg-rose/60" />{number} — {title}<span className="w-6 h-px bg-rose/60" /></p>;
}

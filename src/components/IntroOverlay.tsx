import { Fragment, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Github, Linkedin, Mail } from 'lucide-react';
import { t, type Language } from '../i18n/translations';
import { useTheme } from '../theme/useTheme';
import { SOCIAL_LINKS } from '../constants/social';
import { CONTACT_EMAIL } from '../constants/contact';
import './IntroOverlay.css';

const TYPING_MS_PER_CHAR = 52;
const PAUSE_BETWEEN_LINES_MS = 480;
const CURSOR_BLINK_MS = 520;
const HOLD_AFTER_LAST_LINE_MS = 2000;
/** Delay after window load before intro overlay appears and typing starts */
const INTRO_START_DELAY_MS = 500;
/** Unmount overlay when main reveal transition completes (match portfolio.css main-reveal-wrapper duration) */
const FADE_OUT_MS = 650;
/** Start main reveal immediately so it finishes exactly when overlay unmounts */
const REVEAL_MAIN_MS = 0;
const REDUCED_MOTION_FADE_MS = 280;
const REDUCED_MOTION_LINE_DELAY_MS = 120;

type Props = {
  language: Language;
  onRevealMain: () => void;
  onClose: () => void;
};

function useTypewriter(
  lines: string[],
  reducedMotion: boolean,
  onAllDone: () => void,
  start: boolean
) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const onAllDoneRef = useRef(onAllDone);
  onAllDoneRef.current = onAllDone;

  const currentLine = lines[lineIndex] ?? '';
  const displayed = currentLine.slice(0, charIndex);
  const isLastLine = lineIndex >= lines.length - 1;
  const isLineComplete = charIndex >= currentLine.length;

  useEffect(() => {
    if (!start || !reducedMotion || lines.length === 0) return;
    let step = 0;
    const id = setInterval(() => {
      step++;
      if (step <= lines.length) {
        setLineIndex(step - 1);
        setCharIndex(lines[step - 1]?.length ?? 0);
      }
      if (step >= lines.length) {
        clearInterval(id);
      }
    }, REDUCED_MOTION_LINE_DELAY_MS);
    return () => clearInterval(id);
  }, [start, reducedMotion, lines]);

  useEffect(() => {
    if (!start || !reducedMotion || lines.length === 0) return;
    const t = setTimeout(
      () => onAllDoneRef.current(),
      lines.length * REDUCED_MOTION_LINE_DELAY_MS + HOLD_AFTER_LAST_LINE_MS
    );
    return () => clearTimeout(t);
  }, [start, reducedMotion, lines]);

  useEffect(() => {
    if (!start || reducedMotion) return;

    if (lineIndex >= lines.length) return;

    if (charIndex < currentLine.length) {
      const id = setTimeout(() => setCharIndex((c) => c + 1), TYPING_MS_PER_CHAR);
      return () => clearTimeout(id);
    }

    if (isLastLine) {
      const id = setTimeout(() => onAllDoneRef.current(), HOLD_AFTER_LAST_LINE_MS);
      return () => clearTimeout(id);
    }

    const id = setTimeout(() => {
      setLineIndex((i) => i + 1);
      setCharIndex(0);
    }, PAUSE_BETWEEN_LINES_MS);
    return () => clearTimeout(id);
  }, [start, lineIndex, charIndex, currentLine.length, isLastLine, reducedMotion, lines.length]);

  useEffect(() => {
    if (!start || reducedMotion) return;
    const id = setInterval(() => setShowCursor((c) => !c), CURSOR_BLINK_MS);
    return () => clearInterval(id);
  }, [start, reducedMotion]);

  return { lineIndex, displayed, showCursor, isLineComplete, isLastLine };
}

export default function IntroOverlay({ language, onRevealMain, onClose }: Props) {
  const { theme } = useTheme();
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [readyToStart, setReadyToStart] = useState(false);
  const onRevealMainRef = useRef(onRevealMain);
  const onCloseRef = useRef(onClose);
  onRevealMainRef.current = onRevealMain;
  onCloseRef.current = onClose;
  const reducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current;

  const lineClasses = ['welcome', 'title', 'name', 'role', 'tagline', 'availability'] as const;
  const lines = [
    t(language, 'intro.welcomeToMy'),
    t(language, 'intro.webPortfolio'),
    t(language, 'intro.imJohnWayne'),
    t(language, 'intro.fullStackDeveloper'),
    t(language, 'intro.tagline'),
    t(language, 'intro.availability'),
  ];

  const { lineIndex, displayed, showCursor } = useTypewriter(
    lines,
    reducedMotion,
    () => setExiting(true),
    readyToStart
  );

  const totalChars = lines.reduce((sum, line) => sum + line.length, 0);
  const typedChars = lines.slice(0, lineIndex).reduce((sum, line) => sum + line.length, 0) + displayed.length;
  const progress = totalChars > 0 ? Math.min(1, typedChars / totalChars) : 0;
  const progressTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    progressTrackRef.current?.style.setProperty('--progress', String(progress));
  }, [progress]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let timeoutId: ReturnType<typeof setTimeout>;
    const scheduleStart = () => {
      timeoutId = setTimeout(() => setReadyToStart(true), INTRO_START_DELAY_MS);
    };
    if (document.readyState === 'complete') {
      scheduleStart();
    } else {
      window.addEventListener('load', scheduleStart);
    }
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('load', scheduleStart);
    };
  }, []);

  useEffect(() => {
    if (readyToStart) setMounted(true);
  }, [readyToStart]);

  useEffect(() => {
    if (!exiting) return;
    const revealMs = reducedMotion ? 120 : REVEAL_MAIN_MS;
    const closeMs = reducedMotion ? REDUCED_MOTION_FADE_MS : FADE_OUT_MS;
    const t1 = setTimeout(() => onRevealMainRef.current(), revealMs);
    const t2 = setTimeout(() => onCloseRef.current(), closeMs);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [exiting]);

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const iconMuted = theme === 'dark' ? 'intro-overlay__icon--dark' : 'intro-overlay__icon--light';

  const topLinks = [
    { href: SOCIAL_LINKS.github, label: 'GitHub', Icon: Github },
    { href: SOCIAL_LINKS.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { href: `mailto:${CONTACT_EMAIL || ''}?subject=Portfolio%20Inquiry`, label: 'Email', Icon: Mail },
  ];

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t(language, 'intro.welcomeToMy')}
      className={`intro-overlay intro-overlay--${theme} ${exiting ? 'intro-overlay--exiting' : ''} ${reducedMotion ? 'intro-overlay--reduced-motion' : ''} ${mounted ? 'intro-overlay--visible' : ''}`}
    >
      <div className="intro-overlay__bg" aria-hidden="true" />
      <div className="intro-overlay__noise" aria-hidden="true" />

      {/* Progress bar — fills in sync with typewriter */}
      <div
        ref={progressTrackRef}
        className="intro-overlay__progress-track"
        aria-hidden="true"
      >
        <div className="intro-overlay__progress-fill" />
      </div>

      <div className={`intro-overlay__content ${textPrimary}`}>
        <header className="intro-overlay__top">
          <span className="intro-overlay__badge" aria-hidden="true">
            {t(language, 'intro.badge')}
          </span>
          <nav className="intro-overlay__icons" aria-label="Professional links">
            {topLinks.map(({ href, label, Icon }, idx) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`intro-overlay__icon intro-overlay__icon--delay-${idx} ${iconMuted}`}
                aria-label={label}
              >
                <Icon size={24} strokeWidth={1.75} aria-hidden />
              </a>
            ))}
          </nav>
        </header>
        <div className={`intro-overlay__typeblock ${exiting ? 'intro-overlay__typeblock--exiting' : ''}`}>
          {lines.slice(0, lineIndex).map((line, i) => (
            <Fragment key={i}>
              <div
                className={`intro-overlay__line intro-overlay__line--revealed intro-overlay__line--${lineClasses[i] ?? 'role'}`}
                data-line-index={i}
              >
                {line}
              </div>
              {i === 2 && (
                <div className="intro-overlay__accent" aria-hidden="true" />
              )}
            </Fragment>
          ))}
          <div
            className={`intro-overlay__line intro-overlay__line--${lineClasses[lineIndex] ?? 'role'} ${displayed.length === 0 && lineIndex > 0 ? 'intro-overlay__line--cursor-pulse' : ''}`}
            data-line-index={lineIndex}
          >
            {displayed}
            <span
              className={`intro-overlay__cursor ${showCursor ? 'intro-overlay__cursor--on' : ''}`}
              aria-hidden="true"
            />
          </div>
          {lineIndex === 2 && (
            <div className="intro-overlay__accent" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(overlay, document.body);
}

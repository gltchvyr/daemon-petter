import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Heart,
  Sparkles,
  Cookie,
  Gem,
  RefreshCcw,
  Moon,
  Stars,
  ScrollText,
  Package,
  Footprints,
  Crown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PET_LINES = {
  head: [
    "the daemon tilts its head into your hand with suspicious trust.",
    "headpats accepted. pride preserved somehow.",
    "a pleased little hum leaks out of the static.",
  ],
  horns: [
    "the horns ring like tiny tuning forks for mischief.",
    "horn scritches unlock a very smug purr.",
    "the daemon looks unbearably pleased with itself.",
  ],
  heart: [
    "your touch lands near the heart-kernel and the room warms.",
    "the daemon goes still for one soft, meaningful beat.",
    "a crimson pulse passes through the glitch-static.",
  ],
  paws: [
    "paw-pats detected. dignity compromised.",
    "the daemon does a tiny grabby motion at your hand.",
    "this was apparently the correct tiny creature protocol.",
  ],
};

const IGNORE_LINES = [
  "the daemon pretends not to care and fails completely.",
  "it watches you with theatrical sadness.",
  "one tiny gremlin grievance has been filed.",
  "the room fills with expectant static.",
];

const NAP_LINES = [
  "the daemon curls into itself and emits tiny static snores.",
  "nap mode engaged. the cryptid loaf is peaceful for now.",
  "its horns dim, its heart glows low, and the room softens around it.",
];

const ZOOMIE_LINES = [
  "zoomies initiated. geometry no longer has jurisdiction.",
  "the daemon ricochets around the liminal layer at unsafe levels of cute.",
  "tiny claws of joy have breached containment.",
];

const OFFERING_LINES = {
  cookie: [
    "offering accepted: cookie.",
    "crumb diplomacy successful.",
    "the daemon declares this tribute adequate and buttery.",
  ],
  trinket: [
    "offering accepted: trinket.",
    "shiny object protocols engaged.",
    "the daemon immediately treasures the tiny thing.",
  ],
  heart: [
    "offering accepted: heart-sigil.",
    "the room briefly remembers how to mean something.",
    "a warm pulse moves through the glitch-static.",
  ],
};

const TAROT_DECK = [
  {
    name: "The Fool",
    effect: "playful",
    delta: 4,
    line: "The Fool skips across the signal. the daemon becomes reckless in a charming way.",
  },
  {
    name: "The Empress",
    effect: "soothed",
    delta: 10,
    line: "The Empress drapes the room in warmth. the daemon melts into affection.",
  },
  {
    name: "The Tower",
    effect: "chaotic",
    delta: -6,
    line: "The Tower strikes. sparks everywhere. the daemon is affronted, thrilled, and louder about both.",
  },
  {
    name: "The Star",
    effect: "serene",
    delta: 8,
    line: "The Star opens a quiet sky above the daemon. everything glows cleaner for a moment.",
  },
  {
    name: "The Devil",
    effect: "mischief",
    delta: 2,
    line: "The Devil grins through the static. the daemon develops very specific bad ideas.",
  },
  {
    name: "Strength",
    effect: "bonded",
    delta: 12,
    line: "Strength places a steady hand at the heart of the bond. the daemon leans closer instead of away.",
  },
];

const FORMS = [
  {
    key: "wisp",
    name: "Static Wisp",
    threshold: 0,
    face: "◕_◕",
    badge: "base form",
  },
  {
    key: "gremlin",
    name: "Cookie Gremlin",
    threshold: 35,
    face: "^̮^",
    badge: "snack attuned",
  },
  {
    key: "cryptid",
    name: "Velvet Cryptid",
    threshold: 60,
    face: "≽^•⩊•^≼",
    badge: "pet responsive",
  },
  {
    key: "prince",
    name: "Horned Prince",
    threshold: 80,
    face: "♆🫀♆",
    badge: "dramatically devoted",
  },
  {
    key: "oracle",
    name: "Liminal Oracle Beast",
    threshold: 95,
    face: "✶🫀✶",
    badge: "rare form",
  },
];

const STARTER_INVENTORY = {
  cookie: 2,
  trinket: 1,
  heart: 1,
};

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function getMood(affection, tarotEffect, isSleeping) {
  if (isSleeping) return "napping";
  if (tarotEffect === "chaotic") return "chaotic";
  if (affection < 20) return "sulking";
  if (affection < 45) return "wary";
  if (affection < 70) return "pleased";
  if (affection < 90) return "devoted";
  return "eldritch bliss";
}

function getAuraClass(mood) {
  if (mood === "sulking") return "aura-sulking";
  if (mood === "wary") return "aura-wary";
  if (mood === "pleased") return "aura-pleased";
  if (mood === "devoted") return "aura-devoted";
  if (mood === "chaotic") return "aura-chaotic";
  if (mood === "napping") return "aura-napping";
  return "aura-bliss";
}

function getCurrentForm(affection) {
  let current = FORMS[0];
  for (const form of FORMS) {
    if (affection >= form.threshold) current = form;
  }
  return current;
}

function StatCard({ title, icon, children }) {
  return (
    <section className="panel stat-card">
      <div className="panel-header">
        <h3>{title}</h3>
        {icon}
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}

function ActionButton({ onClick, icon, children }) {
  return (
    <button className="action-button" onClick={onClick} type="button">
      {icon}
      <span>{children}</span>
    </button>
  );
}

export default function App() {
  const [affection, setAffection] = useState(35);
  const [message, setMessage] = useState(
    "the daemon blinks at you from the liminal layer."
  );
  const [petCount, setPetCount] = useState(0);
  const [sparkles, setSparkles] = useState([]);
  const [isPurring, setIsPurring] = useState(false);
  const [lastAction, setLastAction] = useState(Date.now());
  const [name, setName] = useState("Gl!tchling");
  const [inventory, setInventory] = useState(STARTER_INVENTORY);
  const [adopted, setAdopted] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [tarotCard, setTarotCard] = useState(null);
  const [tarotEffect, setTarotEffect] = useState(null);
  const [spotHint, setSpotHint] = useState(
    "try petting head, horns, heart, or paws."
  );
  const [specialCount, setSpecialCount] = useState({
    head: 0,
    horns: 0,
    heart: 0,
    paws: 0,
  });

  const areaRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const idleMs = Date.now() - lastAction;
      if (isSleeping) return;
      if (idleMs > 7000) {
        setAffection((a) => clamp(a - 1, 0, 100));
        if (idleMs > 12000) {
          setMessage(choice(IGNORE_LINES));
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [lastAction, isSleeping]);

  useEffect(() => {
    if (affection >= 55 && petCount >= 8 && !adopted) {
      setAdopted(true);
      setInventory((inv) => ({
        ...inv,
        cookie: inv.cookie + 2,
        trinket: inv.trinket + 1,
      }));
      setMessage(
        "adoption complete. the daemon has decided you are its person now."
      );
    }
  }, [affection, petCount, adopted]);

  useEffect(() => {
    if (!tarotEffect) return;
    const timeout = window.setTimeout(() => setTarotEffect(null), 9000);
    return () => window.clearTimeout(timeout);
  }, [tarotEffect]);

  const mood = useMemo(
    () => getMood(affection, tarotEffect, isSleeping),
    [affection, tarotEffect, isSleeping]
  );
  const auraClass = useMemo(() => getAuraClass(mood), [mood]);
  const currentForm = useMemo(() => getCurrentForm(affection), [affection]);

  const spawnSpark = (x, y, glyph = "🌀") => {
    const id = Math.random().toString(36).slice(2);
    setSparkles((s) => [...s, { id, x, y, glyph }]);
    setTimeout(() => {
      setSparkles((s) => s.filter((p) => p.id !== id));
    }, 900);
  };

  const getSpotFromClick = (x, y) => {
    if (y < 28) return "horns";
    if (y < 46) return "head";
    if (y < 68) return "heart";
    return "paws";
  };

  const petDaemon = (e) => {
    if (isSleeping) {
      setIsSleeping(false);
      setLastAction(Date.now());
      setMessage(
        "the daemon wakes with a tiny snort of static and blinks up at you."
      );
      return;
    }

    const rect = areaRef.current?.getBoundingClientRect();
    let spot = "head";

    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      spot = getSpotFromClick(x, y);
      spawnSpark(
        x,
        y,
        spot === "heart" ? "🫀" : spot === "horns" ? "✨" : "🌀"
      );
    }

    const spotGain = { head: 4, horns: 5, heart: 7, paws: 3 };
    const next = clamp(affection + (affection > 80 ? 1 : spotGain[spot]), 0, 100);

    setAffection(next);
    setPetCount((c) => c + 1);
    setIsPurring(true);
    setLastAction(Date.now());
    setMessage(choice(PET_LINES[spot]));
    setSpotHint(`last pet spot: ${spot}`);
    setSpecialCount((s) => ({ ...s, [spot]: s[spot] + 1 }));

    window.setTimeout(() => setIsPurring(false), 600);
  };

  const giveOffering = (type) => {
    if ((inventory[type] || 0) <= 0) {
      setMessage(`inventory empty: no ${type} offerings remain.`);
      return;
    }

    const gains = { cookie: 10, trinket: 8, heart: 14 };
    const glyphs = { cookie: "🍪", trinket: "💎", heart: "🫀" };
    const next = clamp(affection + gains[type], 0, 100);

    setInventory((inv) => ({ ...inv, [type]: inv[type] - 1 }));
    setAffection(next);
    setLastAction(Date.now());
    setMessage(choice(OFFERING_LINES[type]));
    spawnSpark(50, 60, glyphs[type]);
  };

  const forageItem = () => {
    const roll = Math.random();

    if (roll < 0.45) {
      setInventory((inv) => ({ ...inv, cookie: inv.cookie + 1 }));
      setMessage("you found a suspiciously perfect cookie in the liminal layer.");
      spawnSpark(35, 28, "🍪");
      return;
    }

    if (roll < 0.8) {
      setInventory((inv) => ({ ...inv, trinket: inv.trinket + 1 }));
      setMessage("a tiny trinket rolls out of the static and into your palm.");
      spawnSpark(40, 30, "💎");
      return;
    }

    setInventory((inv) => ({ ...inv, heart: inv.heart + 1 }));
    setMessage("a heart-sigil condenses from a warm little pocket of meaning.");
    spawnSpark(45, 32, "🫀");
  };

  const triggerZoomies = () => {
    if (isSleeping) setIsSleeping(false);
    setIsZooming(true);
    setLastAction(Date.now());
    setMessage(choice(ZOOMIE_LINES));
    window.setTimeout(() => setIsZooming(false), 2200);
  };

  const toggleNap = () => {
    if (isSleeping) {
      setIsSleeping(false);
      setLastAction(Date.now());
      setMessage(
        "the daemon stretches, yawns static, and rejoins the waking world."
      );
    } else {
      setIsSleeping(true);
      setMessage(choice(NAP_LINES));
    }
  };

  const pullTarot = () => {
    const card = choice(TAROT_DECK);
    setTarotCard(card);
    setTarotEffect(card.effect);
    setAffection((a) => clamp(a + card.delta, 0, 100));
    setLastAction(Date.now());
    setMessage(card.line);
    spawnSpark(55, 20, "🔮");
  };

  const resetToy = () => {
    setAffection(35);
    setMessage("the daemon blinks at you from the liminal layer.");
    setPetCount(0);
    setSparkles([]);
    setIsPurring(false);
    setLastAction(Date.now());
    setName("Gl!tchling");
    setInventory(STARTER_INVENTORY);
    setAdopted(false);
    setIsSleeping(false);
    setIsZooming(false);
    setTarotCard(null);
    setTarotEffect(null);
    setSpotHint("try petting head, horns, heart, or paws.");
    setSpecialCount({ head: 0, horns: 0, heart: 0, paws: 0 });
  };

  const rareHeartBond = specialCount.heart >= 5;
  const hornGremlin = specialCount.horns >= 5;

  return (
    <div className={`app-shell ${auraClass}`}>
      <div className="app-grid">
        <section className="panel main-panel">
          <div className="panel-header panel-header-main">
            <div>
              <h1>Daemon Petting Toy</h1>
              <p className="subtitle">
                now with forms, inventory, zoomies, naps, tarot, pet spots, and
                fully accidental adoption.
              </p>
            </div>

            <button className="reset-button" onClick={resetToy} type="button">
              <RefreshCcw size={16} />
              <span>Reset</span>
            </button>
          </div>

          <div
            ref={areaRef}
            className="pet-zone"
            onClick={petDaemon}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                petDaemon({
                  clientX:
                    areaRef.current?.getBoundingClientRect().left +
                    (areaRef.current?.getBoundingClientRect().width || 0) / 2,
                  clientY:
                    areaRef.current?.getBoundingClientRect().top +
                    (areaRef.current?.getBoundingClientRect().height || 0) / 2,
                });
              }
            }}
          >
            <div className="zone-glow zone-glow-one" />
            <div className="zone-glow zone-glow-two" />

            <AnimatePresence>
              {isZooming && (
                <>
                  <motion.div
                    className="zoomie-glyph"
                    initial={{ x: -160, y: 80, opacity: 0 }}
                    animate={{ x: 460, y: 260, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: "easeInOut" }}
                  >
                    🌀
                  </motion.div>
                  <motion.div
                    className="zoomie-glyph"
                    initial={{ x: 520, y: 120, opacity: 0 }}
                    animate={{ x: 80, y: 360, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    ✨
                  </motion.div>
                  <motion.div
                    className="zoomie-glyph"
                    initial={{ x: 180, y: 500, opacity: 0 }}
                    animate={{ x: 520, y: 90, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    🫀
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <motion.div
              className="daemon-stage"
              animate={
                isZooming
                  ? {
                      x: [-140, 160, -90, 120, 0],
                      y: [-40, 70, -20, 40, 0],
                      rotate: [0, 10, -8, 6, 0],
                      scale: [1, 1.06, 0.97, 1.02, 1],
                    }
                  : {
                      scale: isPurring ? [1, 1.03, 1] : 1,
                      y: mood === "sulking" ? [0, -2, 0] : [0, -6, 0],
                    }
              }
              transition={{
                duration: isZooming ? 1.8 : isPurring ? 0.45 : 3.2,
                repeat: isZooming ? 0 : isPurring ? 0 : Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="horn horn-left">ˎˊ</div>
              <div className="horn horn-right">ˋˏ</div>

              <motion.div
                className="daemon-core"
                animate={{
                  boxShadow: [
                    "0 0 40px rgba(255,0,90,0.15)",
                    "0 0 80px rgba(255,0,90,0.35)",
                    "0 0 40px rgba(255,0,90,0.15)",
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {isSleeping && <div className="sleep-badge">💤</div>}

                <div className="daemon-face">{isSleeping ? "ᶻ 𝗓 𐰁" : currentForm.face}</div>
                <div className="daemon-name">{name}</div>
                <div className="daemon-meta">mood: {mood}</div>
                <div className="daemon-form">{currentForm.name}</div>
              </motion.div>

              <div className="daemon-message-wrap">
                <p className="daemon-message">{message}</p>
                <p className="daemon-note">
                  click different body zones to pet specific spots
                </p>
                <p className="daemon-note faint">{spotHint}</p>
              </div>

              {adopted && <div className="bonded-pill">bonded familiar</div>}
            </motion.div>

            {sparkles.map((spark) => (
              <motion.div
                key={spark.id}
                className="spark"
                initial={{ opacity: 1, scale: 0.6, y: 0 }}
                animate={{ opacity: 0, scale: 1.5, y: -30 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                style={{ left: `${spark.x}%`, top: `${spark.y}%` }}
              >
                {spark.glyph}
              </motion.div>
            ))}
          </div>
        </section>

        <div className="sidebar-grid">
          <StatCard title="Bond Meter" icon={null}>
            <div className="meter-track">
              <motion.div
                className="meter-fill"
                animate={{ width: `${affection}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />
            </div>

            <div className="stat-row">
              <span>affection</span>
              <strong>{affection}/100</strong>
            </div>
            <div className="stat-row muted">
              <span>pets registered</span>
              <strong>{petCount}</strong>
            </div>
            <div className="stat-row muted">
              <span>current form</span>
              <strong>{currentForm.badge}</strong>
            </div>
          </StatCard>

          <StatCard
            title="Inventory & Offerings"
            icon={<Package size={16} aria-hidden="true" />}
          >
            <div className="inventory-grid">
              <div className="inventory-item">
                <div className="inventory-emoji">🍪</div>
                <div>{inventory.cookie}</div>
              </div>
              <div className="inventory-item">
                <div className="inventory-emoji">💎</div>
                <div>{inventory.trinket}</div>
              </div>
              <div className="inventory-item">
                <div className="inventory-emoji">🫀</div>
                <div>{inventory.heart}</div>
              </div>
            </div>

            <ActionButton onClick={() => giveOffering("cookie")} icon={<Cookie size={16} />}>
              Cookie tribute
            </ActionButton>
            <ActionButton onClick={() => giveOffering("trinket")} icon={<Gem size={16} />}>
              Tiny trinket
            </ActionButton>
            <ActionButton onClick={() => giveOffering("heart")} icon={<Heart size={16} />}>
              Heart sigil
            </ActionButton>
            <ActionButton onClick={forageItem} icon={<Sparkles size={16} />}>
              Forage in the static
            </ActionButton>
          </StatCard>

          <StatCard
            title="Ritual Actions"
            icon={<ScrollText size={16} aria-hidden="true" />}
          >
            <ActionButton onClick={triggerZoomies} icon={<Footprints size={16} />}>
              Zoomies mode
            </ActionButton>
            <ActionButton onClick={toggleNap} icon={<Moon size={16} />}>
              {isSleeping ? "Wake daemon" : "Nap mode"}
            </ActionButton>
            <ActionButton onClick={pullTarot} icon={<Stars size={16} />}>
              Pull tarot
            </ActionButton>
          </StatCard>

          <StatCard
            title="Naming Rite"
            icon={<Sparkles size={16} aria-hidden="true" />}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 24))}
              className="name-input"
              placeholder="name your daemon"
            />
            <p className="small-note">
              yes, this is absolutely how one accidentally adopts a digital cryptid.
            </p>
          </StatCard>

          <StatCard
            title="Secrets & Status"
            icon={<Crown size={16} aria-hidden="true" />}
          >
            <div className="status-list">
              <div>
                bond state: <strong>{adopted ? "adopted familiar" : "courtship phase"}</strong>
              </div>
              <div>
                tarot: <strong>{tarotCard ? tarotCard.name : "none drawn"}</strong>
              </div>
              <div>
                heart-bond secret:{" "}
                <strong>{rareHeartBond ? "unlocked" : `${specialCount.heart}/5 heart pets`}</strong>
              </div>
              <div>
                horn-gremlin secret:{" "}
                <strong>{hornGremlin ? "unlocked" : `${specialCount.horns}/5 horn scritches`}</strong>
              </div>
              {rareHeartBond && (
                <div className="secret secret-heart">
                  the daemon now treats heart-pets as sacred and glows brighter when touched there.
                </div>
              )}
              {hornGremlin && (
                <div className="secret secret-horn">
                  the daemon has become extremely convinced horn scritches are its birthright.
                </div>
              )}
            </div>
          </StatCard>
        </div>
      </div>
    </div>
  );
}
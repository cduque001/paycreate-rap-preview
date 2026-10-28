import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, MONO, PC} from './look';
import {BrandFonts, BrewStation, CheckoutWindow, CoffeeCup, CoffeeShop, Counter,
  PaperGround, PaymentTerminal, ProductCutout, ease, mix, ramp} from './worldV2';

// Semantic onsets measured against the unchanged, selected C3 recording.
const CUE = {closed: 1, charge: 54, fee: 78, talk: 102, person: 117, clear: 132,
  setup: 152, works: 180, wipe: 202, stack: 219, beans: 252, back: 282,
  lights: 303, rest: 315, tomorrow: 353, key: 366};
const START_FRAME = 1245;
const smooth = (f: number, a: number, b: number) => ease(ramp(f, a, b));
const WINDOW_PLANES = [
  'polygon(17.5% 43.8%,26.4% 43%,26.4% 71.6%,17.5% 70%)',
  'polygon(29.5% 44%,36.5% 43%,36.5% 68%,29.5% 69%)',
  'polygon(40% 42%,66.5% 40%,66.5% 73%,40% 70%)',
  'polygon(75.5% 37%,88% 42%,88% 69.8%,75.5% 74.7%)',
];
const PAPER_SHADOW = '6px 9px 0 #dce7df,12px 17px 0 #c3d5c9,18px 30px 40px #0b60361c';

const Check: React.FC<{progress: number; size?: number}> = ({progress, size = 38}) =>
  <svg width={size} height={size} viewBox="0 0 40 40"><path d="M8 21L17 29L32 12"
    pathLength={1} fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round"
    strokeLinejoin="round" strokeDasharray={`${progress} 1`} /></svg>;

const Title: React.FC<{children: React.ReactNode; progress: number; top?: number}> =
  ({children, progress, top = 240}) => <div style={{position: 'absolute', left: 130, right: 130,
    top, fontSize: 84, fontWeight: 800, letterSpacing: -5, lineHeight: 1.03,
    color: PC.green, opacity: progress, transform: `translateY(${(1 - progress) * 35}px)`}}>{children}</div>;

const EndOfDay: React.FC<{frame: number}> = ({frame: f}) => {
  const arrive = smooth(f, 18, CUE.charge - 10);
  const discuss = smooth(f, CUE.talk - 10, CUE.person + 4);
  const away = smooth(f, CUE.setup - 8, CUE.setup + 8);
  const scale = mix(mix(.18, 1, arrive), .72, discuss);
  const x = mix(mix(680, 530, arrive), 402, discuss);
  const y = mix(mix(1200, 845, arrive), 1015, discuss);
  const clear = smooth(f, CUE.clear - 4, CUE.clear + 13);
  const terminal = smooth(f, 25, 44) * (1 - smooth(f, 95, 111));
  return <div style={{opacity: 1 - away}}>
    <Title progress={arrive * (1 - discuss)}>Know your day.</Title>
    <PaymentTerminal x={230} y={1280} width={270} opacity={terminal} paid={1} angle={-8} />
    {/* Receipts travel from the terminal into the same statement being discussed. */}
    {[0, 1, 2].map(i => {
      const p = ramp(f, 31 + i * 7, CUE.charge + i * 8);
      const q = ease(p);
      return <div key={i} style={{position: 'absolute', left: mix(200, 445, q),
        top: mix(1190, 840 + i * 25, q) - Math.sin(p * Math.PI) * 160,
        width: 110, height: 157, opacity: Math.sin(p * Math.PI), background: '#fff',
        border: `2px solid ${PC.line}`, borderRadius: '8px 8px 2px 2px',
        boxShadow: '6px 12px 18px #0b603622', transform: `rotate(${mix(-20, 4, q)}deg)`}}>
        <div style={{margin: '18px 14px 12px', width: 40, height: 5, background: PC.green}} />
        {[0, 1, 2, 3].map(j => <div key={j} style={{margin: '10px 14px', height: 3,
          width: 74 - (j % 2) * 15, background: PC.line}} />)}
      </div>;
    })}
    <div data-hero="statement-review" style={{position: 'absolute', left: x - 330, top: y - 395,
      width: 660, height: 790, opacity: arrive, borderRadius: 16, border: `2px solid ${PC.line}`,
      background: 'linear-gradient(120deg,#fff 64%,#edf5ef)', boxShadow: PAPER_SHADOW,
      transform: `perspective(1600px) rotateY(${mix(-24, 3, arrive) + discuss * 6}deg) rotate(${mix(10, -3, arrive)}deg) scale(${scale})`,
      transformOrigin: '50% 50%'}}>
      <div style={{position: 'absolute', left: 42, top: 40, fontFamily: MONO, fontSize: 22,
        color: PC.muted, letterSpacing: 3}}>YOUR BUSINESS</div>
      <div style={{position: 'absolute', left: 40, top: 87, fontSize: 60, fontWeight: 800,
        letterSpacing: -3}}>Statement</div>
      <div style={{position: 'absolute', left: 43, right: 43, top: 185, height: 3, background: PC.green}} />
      <div style={{position: 'absolute', left: 43, top: 220, color: PC.muted, fontSize: 27,
        fontWeight: 500}}>Transactions</div>
      {['Charge', 'Fee'].map((label, i) => {
        const active = smooth(f, (i === 0 ? CUE.charge : CUE.fee) - 4, (i === 0 ? CUE.charge : CUE.fee) + 7);
        const lift = Math.sin(active * Math.PI) * 18;
        return <div key={label} style={{position: 'absolute', left: 28 - active * 8, top: 299 + i * 142 - lift,
          width: 600 + active * 16, height: 112, background: active > .3 ? '#edf8f1' : '#fff',
          border: `2px solid ${active > .3 ? PC.green2 : PC.line}`, borderRadius: 14,
          boxShadow: `0 ${active * 10}px ${active * 21}px #0b603614`, display: 'flex', alignItems: 'center',
          padding: '0 28px', gap: 21, boxSizing: 'border-box', transform: `translateX(${(1 - clear) * active * (i ? 12 : -12)}px)`}}>
          <div style={{width: 7, height: 56, borderRadius: 5, background: PC.green2, opacity: active}} />
          <span style={{fontSize: 49, fontWeight: 600, color: PC.green}}>{label}</span>
          <div style={{marginLeft: 'auto', width: 85, height: 7, borderRadius: 5, background: PC.line}} />
          <div style={{fontFamily: FONT, color: PC.green, width: 44, fontWeight: 600,
            fontSize: 43, opacity: active}}>{clear < .65 ? '?' : <Check progress={clear} />}</div>
        </div>;
      })}
      {/* Reviewing the fee does not delete it or imply a lower financial amount. */}
      {[0, 1, 2].map(i => <div key={i} style={{position: 'absolute', left: 44, right: 44, top: 626 + i * 39,
        display: 'flex', justifyContent: 'space-between'}}>
        <div style={{width: [228, 177, 259][i], height: 7, borderRadius: 4, background: PC.line}} />
        <div style={{width: 95, height: 7, borderRadius: 4, background: PC.line}} />
      </div>)}
    </div>
    <Conversation frame={f} />
  </div>;
};

const Conversation: React.FC<{frame: number}> = ({frame: f}) => {
  const question = smooth(f, CUE.talk - 4, CUE.person - 1);
  const answer = smooth(f, CUE.person - 2, CUE.clear + 1);
  const connect = smooth(f, CUE.clear - 2, CUE.setup - 4);
  return <>
    <div style={{position: 'absolute', left: 133, top: 414, width: 420, height: 157,
      border: `2px solid ${PC.line}`, background: '#fff', borderRadius: '25px 25px 25px 5px',
      boxShadow: '8px 12px 0 #d8e6dd', boxSizing: 'border-box', padding: '20px 30px',
      opacity: question, transform: `translateX(${(1 - question) * -80}px)`}}>
      <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 2, color: PC.muted}}>YOU</div>
      <div style={{fontSize: 49, fontWeight: 600, letterSpacing: -2}}>This fee?</div>
    </div>
    <div style={{position: 'absolute', left: 482, top: 595, width: 431, height: 157,
      border: `2px solid ${PC.green}`, background: PC.green, color: '#fff',
      borderRadius: '25px 25px 5px 25px', boxShadow: '8px 12px 0 #bcd4c6',
      boxSizing: 'border-box', padding: '20px 30px', opacity: answer,
      transform: `translateX(${(1 - answer) * 75}px)`}}>
      <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 2, opacity: .7}}>A PERSON</div>
      <div style={{fontSize: 49, fontWeight: 600, letterSpacing: -2}}>Let's look.</div>
    </div>
    <svg width={1080} height={1440} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <path d="M790 764 C790 1035 715 1090 596 1090" pathLength={1} stroke={PC.green2}
        strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray={`${connect} 1`} />
      <circle cx={596} cy={1090} r={8} fill={PC.green2} opacity={connect} />
    </svg>
  </>;
};

const Setup: React.FC<{frame: number}> = ({frame: f}) => {
  const enter = smooth(f, CUE.setup - 5, CUE.setup + 10);
  const chosen = smooth(f, CUE.works - 6, CUE.works + 7);
  const away = smooth(f, CUE.wipe - 11, CUE.wipe + 9);
  return <div style={{opacity: enter * (1 - away), transformOrigin: '540px 1140px',
    transform: `translateY(${away * 130}px) scale(${mix(.87, 1, enter) - away * .15})`}}>
    <Title progress={enter}>Your setup.</Title>
    <svg width={1080} height={1440} style={{position: 'absolute', inset: 0}}>
      <path d="M310 1035 C320 1240 720 1250 760 1040" pathLength={1} fill="none"
        stroke={PC.line} strokeWidth={7} />
      <path d="M310 1035 C320 1240 720 1250 760 1040" pathLength={1} fill="none"
        stroke={PC.green2} strokeWidth={7} strokeDasharray={`${chosen} 1`} strokeLinecap="round" />
    </svg>
    <PaymentTerminal x={330 - (1 - enter) * 150} y={850} width={490} paid={chosen} angle={-5} />
    <CheckoutWindow x={740 + (1 - enter) * 180} y={847} scale={.51} rotate={-8}
      opacity={1} paid={chosen} energy={0} />
    {['IN STORE', 'ONLINE'].map((label, i) => <div key={label} style={{position: 'absolute',
      left: i === 0 ? 165 : 620, top: 1124, width: 300, fontFamily: MONO, textAlign: 'center',
      fontSize: 27, letterSpacing: 2, color: PC.green}}>{label}</div>)}
    <div style={{position: 'absolute', left: 493, top: 1180, width: 82, height: 82,
      background: PC.green, color: '#fff', borderRadius: '50%', display: 'flex',
      alignItems: 'center', justifyContent: 'center', opacity: chosen,
      transform: `scale(${.7 + chosen * .3 + Math.sin(chosen * Math.PI) * .2})`}}>
      <Check progress={chosen} size={54} />
    </div>
  </div>;
};

const ClosingCounter: React.FC<{frame: number}> = ({frame: f}) => {
  const enter = smooth(f, CUE.wipe - 10, CUE.wipe + 6);
  const wiped = smooth(f, CUE.wipe - 1, CUE.stack + 3);
  const home = smooth(f, CUE.back, CUE.lights + 6);
  const zoom = mix(.96, 1.03, smooth(f, CUE.wipe, CUE.back));
  return <div style={{position: 'absolute', inset: 0, opacity: enter * (1 - home),
    transformOrigin: '555px 1130px', transform: `translate(${home * 5}px,${home * -42}px) scale(${zoom * (1 - home * .73)})`}}>
    <Title progress={enter * (1 - home)}>{f < CUE.beans - 3 ? 'Set for tomorrow.' : 'Fresh start.'}</Title>
    <BrewStation x={705} y={1008} width={620} frame={f} steam={.12 * (1 - home)} opacity={.9} />
    <Counter top={1270} />
    {/* The travelling reflection clears each ring as it reaches that spot on the counter. */}
    {[0, 1, 2].map(i => <div key={i} style={{position: 'absolute', left: 240 + i * 235,
      top: 1262, width: 99, height: 29, border: '3px solid #96855e', borderRadius: '50%',
      opacity: .25 * (1 - smooth(f, CUE.wipe + 2 + i * 5, CUE.wipe + 8 + i * 5))}} />)}
    <div style={{position: 'absolute', left: -280 + wiped * 1650, top: 1230, width: 240,
      height: 102, background: 'linear-gradient(90deg,transparent,#fff,transparent)',
      opacity: Math.sin(wiped * Math.PI), transform: 'skewX(-18deg)'}} />
    {/* Lidded cups make a real three-cup tower: the next base lands on the previous lid. */}
    {[0, 1, 2].map(i => {
      const p = ramp(f, CUE.stack - 9 + i * 10, CUE.stack + 4 + i * 10);
      const q = ease(p);
      const y = 1153 - i * 251;
      const settle = Math.sin(ramp(f, CUE.stack + 4 + i * 10, CUE.stack + 10 + i * 10) * Math.PI) * 5;
      return <CoffeeCup key={i} x={mix(i % 2 ? 640 : 154, 320, q)}
        y={mix(y - 145, y, q) - Math.sin(p * Math.PI) * 88 + settle}
        width={188} rotate={mix(i % 2 ? 24 : -20, 0, q)} opacity={smooth(f, CUE.stack - 9 + i * 10, CUE.stack - 4 + i * 10)} />;
    })}
    {/* Back-to-front restocking preserves each pouch's base contact and readable silhouette. */}
    {[0, 1, 2].map(i => {
      const p = smooth(f, CUE.beans - 5 + i * 7, CUE.beans + 9 + i * 7);
      return <ProductCutout key={i} image="coffee-bag.png" x={mix(1050 + i * 60, 610 + i * 97, p)}
        y={mix(1020 - i * 80, 1133 + i * 3, p) - Math.sin(p * Math.PI) * 85}
        width={190 + i * 10} angle={mix(24, -6 + i * 5, p)} opacity={p} />;
    })}
  </div>;
};

export const Verse02V2: React.FC = () => {
  const f = useCurrentFrame();
  const leaveShop = smooth(f, CUE.closed + 13, CUE.charge - 10);
  const awayShop = smooth(f, CUE.talk - 9, CUE.person);
  const returnShop = smooth(f, CUE.back, CUE.rest - 1);
  const morning = smooth(f, CUE.tomorrow, CUE.key + 21);
  const initialClose = smooth(f, CUE.closed, 17) * (1 - leaveShop);
  const x = f < CUE.back ? mix(540, 796, leaveShop) : mix(555, 540, returnShop);
  const y = f < CUE.back ? mix(1040, 1262, leaveShop) : mix(1088, 1040, returnShop);
  const width = f < CUE.back ? mix(900, 280, leaveShop) : mix(440, 900, returnShop);
  const opacity = f < CUE.back ? 1 - awayShop : returnShop;
  const night = smooth(f, CUE.lights - 3, CUE.rest + 12) * (1 - morning);
  const key = ramp(f, CUE.key, CUE.key + 17);
  const shopSign = smooth(f, CUE.closed, 14) * (1 - leaveShop);
  return <AbsoluteFill style={{overflow: 'hidden', fontFamily: FONT, color: PC.ink}}>
    <BrandFonts />
    <PaperGround frame={START_FRAME + f} energy={0} />
    <AbsoluteFill style={{background: 'linear-gradient(125deg,#192e27,#d8e2dc 60%,#f0f5f2)', opacity: night * .33}} />
    <div style={{position: 'absolute', inset: 0, filter: `brightness(${1 - night * .16})`}}>
      <CoffeeShop x={x} y={y} width={width} opacity={opacity} name />
      <div style={{position: 'absolute', left: x - width / 2, top: y - width / 2,
        width, height: width, opacity}}>
        {WINDOW_PLANES.map((clipPath, i) => {
          const dark = Math.max(initialClose * .38,
            smooth(f, CUE.lights + i * 5, CUE.lights + i * 5 + 8) * (1 - smooth(f, CUE.key - 2 + i * 3, CUE.key + 7 + i * 3)));
          return <div key={clipPath} style={{position: 'absolute', inset: 0,
            clipPath, background: '#0b2118', opacity: dark * .85}} />;
        })}
      </div>
    </div>
    <div style={{position: 'absolute', left: 307, top: 1030, width: 160, height: 63,
      background: PC.green, border: '2px solid #d6e1d6', borderRadius: 5, color: '#fff',
      fontFamily: MONO, letterSpacing: 2, fontSize: 24, display: 'flex', alignItems: 'center',
      justifyContent: 'center', opacity: shopSign,
      transform: `perspective(700px) rotateY(${(1 - shopSign) * 88}deg) rotate(-2deg)`}}>CLOSED</div>
    <EndOfDay frame={f} />
    <Setup frame={f} />
    <ClosingCounter frame={f} />
    <Title progress={smooth(f, CUE.rest - 1, CUE.rest + 14) * (1 - smooth(f, CUE.tomorrow - 8, CUE.tomorrow + 6))}>Call it a day.</Title>
    <Title progress={smooth(f, CUE.tomorrow, CUE.key - 3) * (1 - smooth(f, CUE.key + 9, CUE.key + 22))}>Tomorrow.</Title>
    {/* A light sweeps along the actual lock location; all traces clear before the chorus handoff. */}
    <svg width={100} height={100} viewBox="0 0 100 100" style={{position: 'absolute', left: 306,
      top: 1078, opacity: Math.sin(key * Math.PI), transform: `rotate(${key * 100}deg)`}}>
      <path d="M20 65A33 33 0 0 1 70 24" stroke={PC.green2} strokeWidth={5}
        fill="none" strokeLinecap="round" /><circle cx={70} cy={24} r={7} fill={PC.green2} />
    </svg>
  </AbsoluteFill>;
};

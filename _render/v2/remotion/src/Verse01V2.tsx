import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import {FONT, MONO, PC} from './look';
import {
  BrandFonts, BrewStation, CheckoutWindow, CoffeeShop, Counter, Heading,
  PaperGround, PaymentTerminal, PaymentTrail, ProductCutout, ease, mix, ramp, useAsset,
} from './worldV2';

// Semantic onsets in the approved C3 recording. The audio and subtitles stay intact.
const CUE = {
  key: 0, daylight: 24, brew: 47, regulars: 94, strong: 148, ice: 179,
  order: 198, bag: 231, tag: 279, counter: 303, online: 324, brand: 347, setup: 372,
} as const;
const GLOBAL_START = 434;
const BAG_RATIO = 1312 / 1199;

// Orders hang from a real rail. A ticket leaves when its drink leaves the counter.
const OrderRail: React.FC<{frame: number; opacity: number}> = ({frame, opacity}) => {
  const labels = ['HOT', 'STRONG', 'ICED'];
  const arrivals = [CUE.regulars, CUE.strong - 16, CUE.ice - 17];
  const departures = [CUE.strong - 8, CUE.order, CUE.order + 7];
  return <div style={{position: 'absolute', left: 170, top: 560, width: 740,
    height: 250, opacity}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 18,
      background: 'linear-gradient(#5d7166,#e4ebe6 40%,#64766b 65%,#b0bcb3)',
      boxShadow: '0 6px 10px #0c1f1620', borderRadius: 4}}/>
    {labels.map((label, i) => {
      const enter = ease(ramp(frame, arrivals[i] - 9, arrivals[i] + 6));
      const leave = ease(ramp(frame, departures[i], departures[i] + 14));
      return <div key={label} style={{position: 'absolute', left: 36 + i * 242,
        top: 13 + (1 - enter) * -85 + leave * 165, width: 178, height: 190,
        opacity: enter * (1 - leave), background: '#fffdf7',
        transform: `rotate(${(1 - enter) * -10 + leave * 13}deg)`,
        transformOrigin: '50% 0', boxShadow: '3px 9px 9px #0c1f1620',
        clipPath: 'polygon(0 0,100% 0,100% 96%,94% 100%,88% 96%,82% 100%,76% 96%,70% 100%,64% 96%,58% 100%,52% 96%,46% 100%,40% 96%,34% 100%,28% 96%,22% 100%,16% 96%,10% 100%,0 96%)'}}>
        <div style={{height: 13, background: '#0b603618'}}/>
        <div style={{paddingTop: 25, textAlign: 'center', fontFamily: MONO,
          fontSize: 23, color: PC.muted}}>0{i + 1}</div>
        <div style={{marginTop: 12, textAlign: 'center', fontWeight: 800,
          fontSize: label === 'STRONG' ? 27 : 34, color: PC.green}}>{label}</div>
        <div style={{margin: '17px 24px 0', borderTop: `2px dashed ${PC.line}`}}/>
      </div>;
    })}
  </div>;
};

// The pouch fits inside the opening. A second copy restores the front wall and
// front handle over the moving pouch, so it visibly enters a bag rather than fades.
const PackedOrder: React.FC<{
  x: number; y: number; width: number; drop: number; tag: number; opacity: number;
}> = ({x, y, width, drop, tag, opacity}) => {
  const asset = useAsset();
  const h = width * BAG_RATIO;
  const bagStyle: React.CSSProperties = {position: 'absolute', left: 0, top: 0,
    width: '100%', height: '100%', objectFit: 'contain'};
  return <div data-action="pack-coffee-order" style={{position: 'absolute',
    left: x - width / 2, top: y - h / 2, width, height: h, opacity,
    filter: 'drop-shadow(12px 22px 16px #0b603623)'}}>
    <Img src={asset('carry-bag.png')} style={bagStyle}/>
    <Img data-product="pouch-entering-bag" src={asset('coffee-bag.png')} style={{
      position: 'absolute', left: '31.5%', top: `${mix(-32, 34, drop)}%`,
      width: '40%', height: `${40 / BAG_RATIO * 1.5}%`, objectFit: 'contain',
      transform: `rotate(${mix(-8, 0, drop)}deg)`, transformOrigin: '50% 100%',
    }}/>
    <Img src={asset('carry-bag.png')} style={{...bagStyle,
      clipPath: 'polygon(14.3% 26.6%,76.6% 37.1%,73.5% 32.8%,87.7% 28.3%,95% 100%,8% 100%)'}}/>
    <Img src={asset('carry-bag.png')} style={{...bagStyle,
      clipPath: 'polygon(25% 0,58% 0,58% 29.2%,25% 29.2%)'}}/>
    <div style={{position: 'absolute', left: '66%', top: '26%', width: '28%',
      height: '42%', opacity: tag,
      transformOrigin: '0 0', transform: `rotate(${mix(-35, -7, tag)}deg) scale(${mix(.85, 1, tag)})`}}>
      <svg viewBox="0 0 180 270" style={{position: 'absolute', inset: 0,
        width: '100%', height: '100%', overflow: 'visible'}}>
        <path d="M0 0 Q-13 34 58 74" fill="none" stroke="#ac9267" strokeWidth={3}/>
        <path d="M22 80 L56 52 L91 80 L126 80 L126 238 L-10 238 L-10 80 Z"
          fill="#fffdf5" stroke="#d7c9b1" strokeWidth={2}/>
        <circle cx={56} cy={76} r={7} fill="#c1ae8a"/>
        <path d="M29 133 L49 154 L85 110" fill="none" stroke={PC.green}
          strokeWidth={8} strokeLinecap="round" strokeLinejoin="round"/>
        <text x={57} y={199} textAnchor="middle" fill={PC.green}
          fontFamily={FONT} fontSize={27} fontWeight={800}>READY</text>
      </svg>
    </div>
  </div>;
};

export const Verse01V2: React.FC = () => {
  const f = useCurrentFrame();
  const move = (a: number, b: number) => ease(ramp(f, a, b));
  const daylight = move(CUE.key, CUE.daylight);
  const pushInside = move(CUE.daylight, CUE.brew);
  const machineIn = move(CUE.daylight + 8, CUE.brew);
  const serving = move(CUE.regulars, CUE.regulars + 27);
  const machineOut = move(CUE.strong - 26, CUE.strong - 8);
  const firstPickup = move(CUE.regulars + 26, CUE.strong - 2);
  const strong = move(CUE.strong - 14, CUE.strong + 5);
  const iced = move(CUE.ice - 19, CUE.ice + 2);
  const clearDrinks = move(CUE.order, CUE.bag - 9);
  const packIn = move(CUE.order, CUE.bag - 5);
  const drop = move(CUE.bag, CUE.tag - 13);
  const tag = move(CUE.tag, CUE.tag + 11);
  const toCounter = move(CUE.counter - 5, CUE.online);
  const online = move(CUE.online - 3, CUE.brand);
  const finish = move(CUE.brand, CUE.setup);

  const shopWidth = mix(1020, 1530, pushInside);
  const shopY = mix(970, 1045, pushInside);
  const shopOpacity = 1 - move(CUE.daylight + 8, CUE.brew);
  const machineWidth = mix(1000, 630, serving);
  const machineX = mix(540, 175, serving) - machineOut * 360;
  const machineY = mix(880, 1042, serving);
  const machineOpacity = machineIn * (1 - machineOut);
  const bagWidth = mix(mix(640, 470, toCounter), 320, online);
  const bagX = mix(mix(540, 315, toCounter), 245, online) - finish * 520;
  const bagY = mix(mix(970, 1063, toCounter), 805, online);
  const bagOpacity = packIn * (1 - finish);
  const groundCounterOpacity = machineIn * (1 - finish);
  const currentTitleOut = 1 - move(CUE.order - 8, CUE.order + 3);

  return <AbsoluteFill style={{overflow: 'hidden', fontFamily: FONT, color: PC.ink}}>
    <BrandFonts/>
    <PaperGround frame={GLOBAL_START + f} energy={0}/>

    {/* Follow the shop's window into the working counter as morning arrives. */}
    <div style={{position: 'absolute', left: 80, top: 640, width: 1000, height: 750,
      borderRadius: '50%', background: 'radial-gradient(ellipse,#ffe9b3,transparent 67%)',
      opacity: daylight * shopOpacity * .7,
      transform: `translate(${mix(-300, 50, daylight)}px,${mix(100, -60, daylight)}px)`}}/>
    <CoffeeShop x={540} y={shopY} width={shopWidth} opacity={shopOpacity} name/>
    <div style={{position: 'absolute', left: 217, top: 1030,
      background: '#fffdf4', border: `3px solid ${PC.green}`, color: PC.green,
      padding: '11px 20px', borderRadius: 4, fontSize: 34, fontWeight: 800,
      opacity: daylight * shopOpacity,
      transform: `rotate(${mix(-25, -3, daylight)}deg)`, transformOrigin: '50% 0',
      boxShadow: '3px 9px 8px #0c1f1625'}}>OPEN</div>

    <Heading first="MORNING." top={245} size={120} progress={1}
      opacity={1 - move(CUE.brew, CUE.regulars - 10)}/>
    <Heading first="THE USUAL." top={245} size={119}
      progress={move(CUE.regulars - 12, CUE.regulars + 4)}
      opacity={move(CUE.regulars - 12, CUE.regulars + 4) * currentTitleOut}/>

    <Counter top={1320} opacity={groundCounterOpacity}/>
    <BrewStation x={machineX} y={machineY} width={machineWidth} frame={f}
      opacity={machineOpacity}
      pour={move(CUE.brew, CUE.brew + 5) * (1 - move(CUE.regulars - 8, CUE.regulars))}
      steam={move(CUE.brew + 9, CUE.brew + 20) * (1 - machineOut)}/>
    <OrderRail frame={f} opacity={move(CUE.regulars - 8, CUE.regulars + 7) *
      (1 - move(CUE.order + 11, CUE.bag - 4))}/>

    {/* A finished cup slides to pickup; the next order is already waiting. */}
    <ProductCutout image="coffee-cup.png"
      x={mix(mix(664, 755, serving), 1230, firstPickup)}
      y={mix(989, 1100, serving)} width={mix(166, 275, serving)}
      angle={mix(-2, 8, firstPickup)}
      opacity={move(CUE.regulars + 1, CUE.regulars + 9) * (1 - firstPickup)}/>
    <ProductCutout image="coffee-cup.png"
      x={mix(mix(980, 540, strong), 310, iced) - clearDrinks * 660}
      y={mix(1095, 1080, strong)} width={mix(315, 345, strong) - iced * 30}
      angle={mix(10, -5, strong) - clearDrinks * 11}
      opacity={strong * (1 - clearDrinks)}/>
    <ProductCutout image="iced-coffee.png"
      x={mix(1150, 760, iced) + clearDrinks * 600}
      y={mix(950, 1080, iced)} width={335}
      angle={mix(12, 3, iced) + clearDrinks * 9}
      opacity={iced * (1 - clearDrinks)}/>

    {/* A real pouch goes down through the opening, behind the front paper wall. */}
    <Heading first="PACKED." second="TO GO." top={245} size={126}
      progress={packIn} opacity={packIn * (1 - move(CUE.counter - 12, CUE.counter + 5))}/>
    <PackedOrder x={bagX} y={bagY + (1 - packIn) * 210} width={bagWidth}
      drop={drop} tag={tag} opacity={bagOpacity}/>

    <PaymentTerminal x={mix(1030, 735, toCounter) - online * 455 - finish * 390}
      y={mix(1120, 1160, online)} width={mix(440, 385, online)}
      opacity={toCounter * (1 - finish)} angle={-5} paid={0}/>
    <Heading first={f < CUE.online ? 'COUNTER.' : 'ONLINE.'} top={245} size={123}
      progress={move(CUE.counter - 4, CUE.counter + 9)}
      opacity={move(CUE.counter - 4, CUE.counter + 9) * (1 - finish)}/>
    <PaymentTrail frame={GLOBAL_START + f} progress={online}
      opacity={.65 * online * (1 - finish)}
      d="M305 1120 C455 1355 745 1365 782 1120"/>
    <CheckoutWindow x={mix(775, 535, finish)} y={mix(1010, 995, finish)}
      scale={mix(.59, 1.04, finish)} rotate={mix(-12, -4, finish)}
      opacity={online} paid={0} energy={0}/>
  </AbsoluteFill>;
};

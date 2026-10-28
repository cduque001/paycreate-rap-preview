import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import {FONT, PC} from './look';
import {
  BrandFonts, BrandLock, BrewStation, CheckoutWindow, CoffeeCup, CoffeeShop,
  Counter, GreenSweep, Heading, PaperGround, PaymentCard, PaymentTerminal,
  PaymentTrail, ProductCutout, TapRipple, ease, mix, ramp, useAsset,
} from './worldV2';

// Semantic onsets measured against the selected, unchanged C3 music master.
// Each chorus has its own performance; neither is a speed-adjusted opening.
const C2 = {make: 0, sell: 34, brand: 62, name: 85, door: 112, way: 150,
  shop: 172, block: 202, checkout: 234, makeAgain: 287, sellAgain: 309, brandAgain: 335};
const C3 = {make: 0, sell: 12, brand: 38, name: 62, door: 100, way: 143,
  shop: 174, block: 194, checkout: 229, makeAgain: 287, sellAgain: 315, brandAgain: 341};
const move = (f: number, a: number, b: number) => ease(ramp(f, a, b));
const visible = (f: number, a: number, b: number, fade = 8) =>
  ramp(f, a, a + fade) * (1 - ramp(f, b - fade, b));

/** The only card target is the real terminal's upper contactless pad. */
const CounterTap: React.FC<{
  frame: number; at: number; x?: number; y?: number; width?: number;
  cup?: boolean; bag?: boolean;
}> = ({frame, at, x = 620, y = 1100, width = 760, cup = true, bag = false}) => {
  // Source pad center is (552,126) in the 1312 by 1199 terminal image.
  const padX = x + width * (552 / 1312 - .5);
  const padY = y + width * (126 / 1312 - 1199 / 1312 / 2);
  const approach = move(frame, at - 22, at);
  const leave = move(frame, at + 9, at + 30);
  const cardX = mix(-180, padX, approach) + 600 * leave;
  const cardY = mix(padY - 150, padY - 12, approach) - 225 * leave;
  return <>
    <Counter top={1350}/>
    {cup && <CoffeeCup x={245} y={1180} width={265} rotate={-8}/>} 
    {bag && <ProductCutout image="carry-bag.png" x={240} y={1190} width={330}/>} 
    <PaymentTerminal x={x} y={y} width={width} paid={ramp(frame, at + 2, at + 5)}/>
    {/* The card flattens into the pad's plane, touches, then visibly withdraws. */}
    <div style={{position: 'absolute', left: cardX, top: cardY,
      transform: `perspective(900px) rotateX(${mix(20, 59, approach)}deg) rotateZ(-3deg)`,
      transformOrigin: '0 0'}}>
      <PaymentCard x={0} y={0} angle={mix(-15, 2, approach)} scale={.79}
        opacity={ramp(frame, at - 22, at - 17) * (1 - leave)}/>
    </div>
    <div style={{position: 'absolute', left: 0, top: 0,
      transform: `translateY(${padY * .55}px) scaleY(.45)`, transformOrigin: '0 0'}}>
      <TapRipple frame={frame} at={at} x={padX} y={padY}/>
    </div>
  </>;
};

/** Front-wall occlusion makes an actual packing action, rather than a floating bag. */
const PackOrder: React.FC<{
  frame: number; start: number; x?: number; y?: number; width?: number; pickupAt?: number;
}> = ({frame, start, x = 540, y = 1110, width = 640, pickupAt = start + 52}) => {
  const asset = useAsset();
  const drop = move(frame, start + 5, start + 33);
  const pickup = move(frame, pickupAt, pickupAt + 30);
  const scale = width / 640;
  const slideX = pickup * 970;
  const bagY = y - 65 * Math.sin(pickup * Math.PI);
  const height = width * 1312 / 1199;
  const pose: React.CSSProperties = {position: 'absolute', left: x - width / 2 + slideX,
    top: bagY - height / 2, width, height, objectFit: 'contain'};
  return <>
    <Counter top={1380}/>
    <Img src={asset('carry-bag.png')} style={{...pose,
      filter: 'drop-shadow(15px 22px 16px #0b603625)'}}/>
    {/* The coffee pack clears the handles and sinks behind the bag's front face. */}
    <ProductCutout image="coffee-bag.png" x={x - 20 * scale + slideX}
      y={mix(y - 505 * scale, y + 65 * scale, drop)} width={215 * scale}
      angle={mix(-14, 0, drop)} opacity={1 - ramp(frame, start + 29, start + 37)}/>
    <Img src={asset('carry-bag.png')} style={{...pose,
      clipPath: 'polygon(14% 27%, 75% 36%, 90% 33%, 92% 100%, 12% 89%)'}}/>
  </>;
};

const ClickCursor: React.FC<{frame: number; at: number; x?: number; y?: number}> =
  ({frame, at, x = 715, y = 1258}) => {
    const p = move(frame, at - 18, at - 2);
    const click = Math.sin(Math.PI * ramp(frame, at - 2, at + 6));
    return <>
      <svg width={74} height={88} viewBox="0 0 74 88" style={{position: 'absolute',
        left: mix(1010, x, p), top: mix(1370, y, p),
        opacity: visible(frame, at - 20, at + 18, 5),
        transform: `scale(${1 - click * .17})`, transformOrigin: '10px 5px',
        filter: 'drop-shadow(3px 4px 2px #ffffff)'}}>
        <path d="M8 5 L12 65 L29 51 L43 79 L58 71 L43 44 L65 42 Z"
          fill={PC.ink} stroke="white" strokeWidth={4} strokeLinejoin="round"/>
      </svg>
      <TapRipple frame={frame} at={at} x={x + 8} y={y + 5}/>
    </>;
  };

/** Named merchant and authentic brand share the final chorus/instrumental boundary. */
const MerchantBrand: React.FC<{brand?: number; shopX?: number; shopY?: number; shopWidth?: number}> =
  ({brand = 1, shopX = 540, shopY = 1040, shopWidth = 900}) => {
    const asset = useAsset();
    return <>
      <CoffeeShop x={shopX} y={shopY} width={shopWidth} name/>
      <div style={{position: 'absolute', left: 110, right: 110, top: 222,
        opacity: brand, textAlign: 'center', transform: `translateY(${(1 - brand) * -55}px)`}}>
        <Img src={asset('paycreate-mark.png')} style={{width: 145, height: 171, objectFit: 'contain'}}/>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 102, letterSpacing: -5,
          color: PC.green, lineHeight: 1.1, marginTop: 18}}>PayCreate.</div>
      </div>
    </>;
  };

export const Chorus02V2: React.FC = () => {
  const f = useCurrentFrame();
  const pop = move(f, 2, C2.sell);
  const storeZoom = move(f, C2.door - 8, C2.door + 21) * (1 - move(f, C2.way, C2.shop));
  const connect = move(f, C2.shop, C2.block + 8);
  const webClose = move(f, C2.checkout, C2.checkout + 21);
  const returnStore = move(f, 365, 398);
  return <AbsoluteFill style={{overflow: 'hidden', color: PC.ink, fontFamily: FONT}}>
    <BrandFonts/><PaperGround frame={831 + f} energy={.55}/>

    {f < 36 && <>
      {/* Exact inherited checkout at frame zero; its own product is pulled into the sale. */}
      <CheckoutWindow x={mix(535, 1025, pop)} y={mix(995, 1070, pop)}
        scale={mix(1.04, .72, pop)} rotate={mix(-4, -24, pop)}
        opacity={1 - pop} paid={0} energy={0}/>
      <CoffeeCup x={mix(548, 540, pop)} y={mix(956, 1110, pop)}
        width={mix(229, 465, pop)} rotate={mix(-6, -13, pop)} opacity={ramp(f, 1, 8)}/>
      <Heading first="MAKE" second="IT." size={178} progress={ramp(f, 1, 9)}/>
    </>}

    {f >= 36 && f < 82 && <>
      <Heading first={f < C2.brand ? 'SELL IT.' : 'TAP.'} top={245} size={168}
        progress={ramp(f, f < C2.brand ? 36 : C2.brand, f < C2.brand ? 44 : C2.brand + 8)}/>
      <CounterTap frame={f} at={C2.brand}/>
    </>}

    {f >= 82 && f < C2.shop && <>
      <Heading first="YOUR WAY." top={245} size={138} progress={ramp(f, 84, 96)}/>
      <CoffeeShop x={mix(540, 450, storeZoom)} y={mix(1040, 1100, storeZoom)}
        width={mix(960, 1240, storeZoom)} name={f >= C2.name}/>
      <CoffeeCup x={mix(550, 245, move(f, C2.way - 8, C2.shop))}
        y={mix(1180, 1240, move(f, C2.way - 8, C2.shop))} width={220}
        rotate={mix(0, -11, move(f, C2.way - 8, C2.shop))}
        opacity={ramp(f, C2.way - 8, C2.way + 2)}/>
      <ProductCutout image="iced-coffee.png" x={mix(560, 780, move(f, C2.way, C2.shop))}
        y={1240} width={210} angle={7} opacity={ramp(f, C2.way, C2.way + 8)}/>
    </>}

    {f >= C2.shop && f < C2.makeAgain && <>
      <Heading first="SHOP." second="ONLINE." top={235} size={143}
        progress={ramp(f, C2.shop, C2.shop + 12)} opacity={1 - ramp(f, 273, C2.makeAgain)}/>
      <CoffeeShop x={mix(mix(540, 285, connect), -350, webClose)}
        y={mix(1040, 1080, connect)} width={mix(960, 580, connect)} name/>
      <PaymentTrail frame={831 + f} progress={ramp(f, C2.block, C2.checkout)}
        opacity={connect * (1 - webClose)} d="M330 1135 C450 1320 590 1320 750 1120"/>
      <CheckoutWindow x={mix(mix(1330, 750, connect), 535, webClose)}
        y={mix(1065, 995, webClose)} scale={mix(.71, 1.04, webClose)}
        rotate={mix(-19, -4, webClose)} opacity={1}
        paid={ramp(f, 271, 276)} energy={0}/>
      <CoffeeCup x={mix(245, 750, connect)} y={mix(1240, 1010, connect)}
        width={mix(220, 160, connect)} rotate={mix(-11, -6, connect)}
        opacity={1 - connect}/>
      <ProductCutout image="iced-coffee.png" x={mix(780, 1080, connect)}
        y={1240} width={210} angle={7} opacity={1 - connect}/>
      <ClickCursor frame={f} at={271}/>
    </>}

    {f >= C2.makeAgain && f < 365 && <>
      <Heading first={f < C2.sellAgain ? 'MAKE IT.' : 'READY.'} top={235} size={160}
        progress={ramp(f, f < C2.sellAgain ? C2.makeAgain : C2.sellAgain,
          f < C2.sellAgain ? C2.makeAgain + 8 : C2.sellAgain + 8)}
        opacity={1 - ramp(f, 349, 363)}/>
      <PackOrder frame={f} start={C2.makeAgain - 10} pickupAt={C2.brandAgain}/>
    </>}

    {f >= 365 && <CoffeeShop x={mix(900, 540, returnStore)}
      y={mix(1170, 1040, returnStore)} width={mix(320, 900, returnStore)} name/>}
    <GreenSweep frame={f} at={26} duration={20}/>
    <GreenSweep frame={f} at={72} duration={20} reverse/>
    <GreenSweep frame={f} at={277} duration={20}/>
    <GreenSweep frame={f} at={355} duration={20} reverse/>
  </AbsoluteFill>;
};

export const Chorus03V2: React.FC = () => {
  const f = useCurrentFrame();
  const lineup = move(f, 1, C3.name);
  const shopClose = move(f, C3.name, C3.door + 13);
  const toWeb = move(f, C3.way, C3.block + 6);
  const webClose = move(f, C3.checkout, C3.checkout + 20);
  const brandIn = move(f, C3.brandAgain + 6, 368);
  return <AbsoluteFill style={{overflow: 'hidden', color: PC.ink, fontFamily: FONT}}>
    <BrandFonts/><PaperGround frame={1638 + f} energy={.7}/>

    {f < C3.way && <>
      <CoffeeShop x={mix(540, 450, shopClose)}
        y={mix(mix(1040, 875, lineup), 1080, shopClose)}
        width={mix(mix(900, 715, lineup), 1160, shopClose)} name/>
      <Heading first={f < C3.name ? 'MAKE IT.' : 'MAKE IT'}
        second={f < C3.name ? undefined : 'YOURS.'} size={158} top={232}
        progress={ramp(f, f < C3.name ? 1 : C3.name, f < C3.name ? 9 : C3.name + 10)}/>
      {/* Three recognisable orders leave one shop; each lands on a different sung hit. */}
      <CoffeeCup x={mix(540, 245, move(f, 1, 24))}
        y={mix(1080, 1220, move(f, 1, 24)) + 180 * shopClose}
        width={mix(100, 260, move(f, 1, 24))} rotate={-9}
        opacity={ramp(f, 1, 9) * (1 - shopClose)}/>
      <ProductCutout image="iced-coffee.png" x={540}
        y={mix(1030, 1205, move(f, C3.sell, C3.sell + 25)) + 180 * shopClose}
        width={mix(100, 240, move(f, C3.sell, C3.sell + 25))} angle={1}
        opacity={ramp(f, C3.sell, C3.sell + 7) * (1 - shopClose)}/>
      <ProductCutout image="coffee-bag.png" x={mix(550, 785, move(f, C3.brand, C3.brand + 22))}
        y={mix(1080, 1200, move(f, C3.brand, C3.brand + 22)) + 180 * shopClose}
        width={mix(100, 225, move(f, C3.brand, C3.brand + 22))} angle={8}
        opacity={ramp(f, C3.brand, C3.brand + 7) * (1 - shopClose)}/>
    </>}

    {f >= C3.way && f < C3.makeAgain && <>
      <Heading first="IN STORE." second="ONLINE." top={235} size={129}
        progress={ramp(f, C3.way, C3.way + 12)} opacity={1 - ramp(f, 273, C3.makeAgain)}/>
      {/* The outgoing shop physically turns into the left half of the two-channel view. */}
      <CoffeeShop x={mix(mix(450, 265, toWeb), -350, webClose)}
        y={mix(1080, 1020, toWeb)} width={mix(1160, 560, toWeb)} name/>
      <PaymentTrail frame={1638 + f} progress={ramp(f, C3.shop, C3.checkout)}
        opacity={toWeb * (1 - webClose)} d="M320 1080 C390 1220 575 1315 755 1110"/>
      <CheckoutWindow x={mix(mix(1380, 750, toWeb), 535, webClose)}
        y={mix(1065, 995, webClose)} scale={mix(.71, 1.04, webClose)}
        rotate={mix(-22, -4, webClose)} opacity={1}
        paid={ramp(f, 263, 268)} energy={0}/>
      <ClickCursor frame={f} at={263}/>
    </>}

    {f >= C3.makeAgain && f < C3.brandAgain + 10 && <>
      <Heading first={f < C3.sellAgain ? 'MAKE IT.' : f < C3.brandAgain - 4 ? 'SELL IT.' : 'TAP.'}
        top={235} size={166} progress={ramp(f, f < C3.sellAgain ? C3.makeAgain :
          f < C3.brandAgain - 4 ? C3.sellAgain : C3.brandAgain - 4,
        f < C3.sellAgain ? C3.makeAgain + 8 : f < C3.brandAgain - 4 ? C3.sellAgain + 8 : C3.brandAgain + 4)}/>
      <CounterTap frame={f} at={C3.brandAgain - 4} x={620} y={1080} width={840}
        cup={false} bag/>
    </>}

    {f >= C3.brandAgain + 10 && <MerchantBrand brand={brandIn}
      shopX={mix(720, 540, brandIn)} shopY={mix(1160, 1040, brandIn)}
      shopWidth={mix(600, 900, brandIn)}/>} 
    <GreenSweep frame={f} at={C3.makeAgain - 10} duration={20} reverse/>
    <GreenSweep frame={f} at={C3.brandAgain} duration={20}/>
  </AbsoluteFill>;
};

// The native instrumental tail is 445 frames, followed by the requested 15-frame hold.
// These cuts follow its musical phrases; no additional audio or lyric text is introduced.
const OUT = {brew: 52, pack: 110, tap: 170, online: 230, pickup: 286, brand: 348, settle: 399};

export const FinaleV2: React.FC = () => {
  const f = useCurrentFrame();
  const openingPush = move(f, 9, OUT.brew - 10);
  const closeBrand = move(f, OUT.brand, OUT.settle);
  return <AbsoluteFill style={{overflow: 'hidden', color: PC.ink, fontFamily: FONT}}>
    <BrandFonts/><PaperGround frame={2019 + f} energy={.6 * (1 - closeBrand)}/>

    {f < OUT.brew && <MerchantBrand brand={1 - move(f, 9, 32)}
      shopX={mix(540, 330, openingPush)} shopY={mix(1040, 1085, openingPush)}
      shopWidth={mix(900, 1570, openingPush)}/>} 

    {f >= OUT.brew && f < OUT.pack && <>
      <Heading first="MAKE." top={235} size={190} progress={ramp(f, OUT.brew, OUT.brew + 8)}/>
      <Counter top={1360}/>
      {/* The push moves toward the working spouts, keeping the physical cup beneath them. */}
      <BrewStation x={mix(525, 470, move(f, OUT.brew, OUT.pack))}
        y={mix(1030, 1085, move(f, OUT.brew, OUT.pack))}
        width={mix(980, 1110, move(f, OUT.brew, OUT.pack))} frame={f}
        pour={visible(f, OUT.brew + 3, OUT.pack - 8, 5)} steam={.8}/>
    </>}

    {f >= OUT.pack && f < OUT.tap && <>
      <Heading first="PACK." top={235} size={190} progress={ramp(f, OUT.pack, OUT.pack + 8)}/>
      <PackOrder frame={f} start={OUT.pack - 2} pickupAt={OUT.tap - 13}/>
    </>}

    {f >= OUT.tap && f < OUT.online && <>
      <Heading first="TAP." top={235} size={190} progress={ramp(f, OUT.tap, OUT.tap + 8)}/>
      <CounterTap frame={f} at={OUT.tap + 25} x={600} y={1090} width={900}/>
    </>}

    {f >= OUT.online && f < OUT.pickup && <>
      <Heading first="ONLINE." top={235} size={154} progress={ramp(f, OUT.online, OUT.online + 8)}/>
      <CheckoutWindow x={mix(610, 535, move(f, OUT.online, OUT.online + 20))}
        y={995} scale={mix(.93, 1.04, move(f, OUT.online, OUT.online + 20))}
        rotate={mix(15, -4, move(f, OUT.online, OUT.online + 20))} opacity={1}
        paid={ramp(f, OUT.online + 33, OUT.online + 37)} energy={0}/>
      <ClickCursor frame={f} at={OUT.online + 33}/>
    </>}

    {f >= OUT.pickup && f < OUT.brand && <>
      <Heading first="LET'S GO." top={235} size={152} progress={ramp(f, OUT.pickup, OUT.pickup + 8)}/>
      <CoffeeShop x={mix(600, 510, move(f, OUT.pickup, OUT.brand))}
        y={960} width={mix(980, 900, move(f, OUT.pickup, OUT.brand))} name/>
      <ProductCutout image="carry-bag.png"
        x={mix(mix(570, 480, move(f, OUT.pickup, OUT.pickup + 23)), 1170,
          move(f, OUT.pickup + 31, OUT.brand))}
        y={mix(1050, 1250, move(f, OUT.pickup, OUT.pickup + 23))}
        width={mix(150, 440, move(f, OUT.pickup, OUT.pickup + 23))}
        angle={Math.sin(ramp(f, OUT.pickup + 31, OUT.brand) * Math.PI) * 9}/>
    </>}

    {f >= OUT.brand && <>
      {/* One clean brand landing follows the work; the native music resolves underneath. */}
      <div style={{position: 'absolute', left: -60, top: 530, width: 1200, height: 650,
        borderTop: `2px solid ${PC.line}`, borderBottom: `2px solid ${PC.line}`,
        transform: `rotate(${mix(-12, 0, closeBrand)}deg) scaleX(${closeBrand})`,
        opacity: .5}}/>
      <BrandLock progress={move(f, OUT.brand + 5, OUT.brand + 27)} energy={0}/>
      <CoffeeCup x={mix(350, 240, closeBrand)} y={mix(1200, 1330, closeBrand)}
        width={mix(280, 180, closeBrand)} rotate={mix(-14, -8, closeBrand)}
        opacity={1 - move(f, OUT.brand + 24, OUT.settle)}/>
      <ProductCutout image="carry-bag.png" x={mix(735, 850, closeBrand)}
        y={mix(1200, 1330, closeBrand)} width={mix(330, 190, closeBrand)}
        opacity={1 - move(f, OUT.brand + 24, OUT.settle)}/>
      <div style={{position: 'absolute', left: 540 - 160 * closeBrand, top: 1217,
        width: 320 * closeBrand, height: 5, borderRadius: 3, background: PC.green2,
        opacity: ramp(f, OUT.brand + 28, OUT.settle)}}/>
    </>}

    {[OUT.brew, OUT.pack, OUT.tap, OUT.online, OUT.pickup, OUT.brand].map((at, i) =>
      <GreenSweep key={at} frame={f} at={at - 10} duration={20} reverse={i % 2 === 1}/>)}
  </AbsoluteFill>;
};

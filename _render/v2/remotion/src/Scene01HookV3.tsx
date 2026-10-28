import React from 'react';
import {AbsoluteFill,Img,useCurrentFrame} from 'remotion';
import {FONT,PC} from './look';
import {BrandLock,CheckoutWindow,CoffeeCup,CoffeeShop,Counter,Heading,PaperGround,PaymentCard,PaymentTerminal,PaymentTrail,ProductCutout,TapRipple,ease,mix,ramp,useAsset} from './worldV2';

const smooth=(f:number,a:number,b:number)=>ease(ramp(f,a,b));
export const Scene01HookV3:React.FC=()=>{
 const f=useCurrentFrame(),asset=useAsset();
 const store=smooth(f,79,101),online=smooth(f,202,250),close=smooth(f,244,280),finish=smooth(f,387,412);
 const title=f<39?'MAKE':f<61?'SELL':'TAP.';
 const hit=f<39?2:f<61?39:61;
 return <AbsoluteFill style={{overflow:'hidden',fontFamily:FONT,color:PC.ink}}>
  <PaperGround frame={f} energy={.4}/>
  <div style={{position:'absolute',left:130,top:160,display:'flex',alignItems:'center',gap:18,opacity:1-finish}}><Img src={asset('paycreate-mark.png')} style={{width:38,height:45,objectFit:'contain'}}/><span style={{fontSize:27,fontWeight:600,letterSpacing:4,color:PC.green}}>PAYCREATE</span></div>
  {f<84&&<>
   <div style={{position:'absolute',left:-160,top:700,width:1400,height:490,background:PC.wash,transform:`rotate(${-18+smooth(f,0,83)*24}deg) translateX(${mix(-40,20,smooth(f,0,83))}px)`}}/>
   <Heading first={title} second={title==='TAP.'?undefined:'IT.'} size={198} progress={ramp(f,hit-6,hit+5)}/>
   {f<61?<>
    <Counter top={1330}/>
    <CoffeeCup x={mix(555,625,smooth(f,31,57))} y={mix(1030,990,smooth(f,31,57))} width={mix(570,520,smooth(f,31,57))} rotate={mix(-16,8,smooth(f,0,57))}/>
    <ProductCutout image="coffee-bag.png" x={mix(-170,260,smooth(f,34,54))} y={1150} width={270} angle={-10}/>
   </>:<>
    <Counter top={1325}/><PaymentTerminal x={560} y={1075} width={790} paid={ramp(f,73,77)}/>
    <PaymentCard x={mix(230,500,smooth(f,61,73))} y={mix(970,780,smooth(f,61,73))} angle={mix(-24,9,smooth(f,61,73))} scale={.74} opacity={1}/>
    <TapRipple frame={f} at={73} x={480} y={780}/>
   </>}
  </>}
  {f>=84&&f<292&&<>
   <Heading top={265} first={f<172?'YOUR NAME.':'YOUR THING.'} second={f<172?'YOUR DOOR.':'YOUR WAY.'} size={112} progress={ramp(f,84,95)} opacity={1-online}/>
   <div style={{position:'absolute',inset:0,transformOrigin:'535px 980px',transform:`scale(${mix(1.09,1,smooth(f,100,190))})`}}>
    <CoffeeShop x={mix(540,260,online)} y={mix(1040,1085,online)} width={mix(980,540,online)} rotate={mix(-2,0,store)} name opacity={store*(1-close)}/>
   </div>
   <CoffeeCup x={mix(-100,235,smooth(f,170,193))} y={1270} width={235} rotate={-12} opacity={1-online}/>
   <ProductCutout image="iced-coffee.png" x={mix(1150,810,smooth(f,178,201))} y={1260} width={210} angle={10} opacity={1-online}/>
   <PaymentTrail frame={f} progress={ramp(f,206,251)} opacity={online*(1-close)} d="M260 1085 C240 1320 700 1350 750 1040"/>
   <Heading top={265} first="YOUR SHOP." second="ONLINE." size={132} progress={ramp(f,206,219)} opacity={online}/>
   <CheckoutWindow x={mix(755,535,close)} y={mix(1080,995,close)} scale={mix(.66,1.04,close)} rotate={mix(-18,-4,close)} opacity={online} paid={0} energy={0}/>
  </>}
  {f>=292&&<AbsoluteFill style={{opacity:1-finish}}>
   <Heading first={f<343?'MAKE':f<371?'SELL':'TAP.'} second={f<371?'IT.':undefined} size={178} progress={ramp(f,f<343?292:f<371?343:371,(f<343?292:f<371?343:371)+7)}/>
   <Counter top={1330}/>
   <PaymentTerminal x={mix(740,560,smooth(f,340,370))} y={1090} width={mix(510,780,smooth(f,340,370))} paid={ramp(f,373,379)}/>
   <CoffeeCup x={mix(380,170,smooth(f,340,370))} y={1100} width={mix(410,225,smooth(f,340,370))} rotate={-12} opacity={1-smooth(f,355,374)}/>
   <PaymentCard x={mix(110,480,smooth(f,343,372))} y={mix(1010,790,smooth(f,343,372))} angle={mix(-25,8,smooth(f,343,372))} scale={.76} opacity={ramp(f,340,350)}/>
   <TapRipple frame={f} at={373} x={480} y={790}/>
  </AbsoluteFill>}
  <BrandLock progress={finish} energy={0}/>
  <CoffeeCup x={260} y={1310} width={190} rotate={-10} opacity={finish}/>
  <CoffeeShop x={745} y={1290} width={300} opacity={finish} name/>
 </AbsoluteFill>;
};

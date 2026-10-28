import React,{createContext,useContext} from 'react';
import {AbsoluteFill,Img,interpolate,staticFile} from 'remotion';
import {CLAMP,FONT,MONO,PC,VIDEO_SLUG} from './look';
export const AssetBase=createContext(staticFile(`v/${VIDEO_SLUG}/assets`));
export const useAsset=()=>{const base=useContext(AssetBase);return (name:string)=>`${base}/${name}`;};
export const ramp=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],CLAMP);
export const ease=(x:number)=>x*x*(3-2*x);
export const mix=(a:number,b:number,p:number)=>a+(b-a)*p;

export const BrandFonts:React.FC=()=>{const asset=useAsset();return <style>{[500,600,800].map(w=>`@font-face{font-family:'PayCreate Poppins';font-weight:${w};font-style:normal;src:url('${asset(`Poppins-${w}.woff2`)}');font-display:block;}`).join('')+`@font-face{font-family:'PayCreate Mono';src:url('${asset('JetBrainsMono-Variable.ttf')}');font-display:block;}`}</style>;};

export const PaperGround:React.FC<{frame:number;energy:number}>=({frame,energy})=><AbsoluteFill style={{backgroundColor:PC.bg}}>
 <AbsoluteFill style={{backgroundImage:'linear-gradient(rgba(11,96,54,0.11) 1px,transparent 1px),linear-gradient(90deg,rgba(11,96,54,0.11) 1px,transparent 1px)',backgroundSize:'72px 72px',opacity:.55}}/>
 <AbsoluteFill style={{background:'radial-gradient(120% 55% at 50% -8%,rgba(11,96,54,0.10),transparent 62%)'}}/>
 <div style={{position:'absolute',left:60,top:580,width:960,height:960,borderRadius:'50%',background:`radial-gradient(ellipse,rgba(15,138,77,${.075+energy*.035}),transparent 66%)`,transform:`translateY(${Math.sin(frame/50)*20}px)`}}/>
 <div style={{position:'absolute',left:110,right:110,bottom:175,height:1,background:PC.line}}/>
 {Array.from({length:35},(_,i)=><div key={i} style={{position:'absolute',left:125+i*24,top:1772,width:3,height:6+18*energy*(.5+.5*Math.sin(i*.77+frame*.09)),background:PC.green,opacity:.14}}/>)}
</AbsoluteFill>;

export const CoffeeCup:React.FC<{x:number;y:number;width:number;rotate?:number;opacity?:number;lift?:number}>=({x,y,width,rotate=0,opacity=1,lift=0})=>{const asset=useAsset();return <div data-hero="coffee-cup" style={{position:'absolute',left:x-width/2,top:y-width*.75,width,height:width*1.5,opacity,transform:`translateY(${-lift}px) rotate(${rotate}deg)`,filter:'drop-shadow(10px 26px 21px rgba(6,46,25,.19))'}}><Img src={asset('coffee-cup.png')} style={{width:'100%',height:'100%',objectFit:'contain'}}/></div>;};

export const CoffeeShop:React.FC<{x:number;y:number;width:number;rotate?:number;opacity?:number;name?:boolean}>=({x,y,width,rotate=0,opacity=1,name=false})=>{const asset=useAsset();return <div data-hero="coffee-shop" style={{position:'absolute',left:x-width/2,top:y-width/2,width,height:width,opacity,transform:`rotate(${rotate}deg)`,filter:'drop-shadow(0 30px 18px rgba(6,46,25,.13))'}}>
 <Img src={asset('coffee-shop.png')} style={{width:'100%',height:'100%'}}/>
 {name&&<div style={{position:'absolute',left:'21%',top:'20%',width:'45%',fontFamily:FONT,fontWeight:600,fontSize:width*.046,letterSpacing:width*.003,color:'#fff',textAlign:'center',transform:'rotate(-6deg)'}}>YOUR NAME</div>}
</div>;};

export const Heading:React.FC<{top?:number;first:string;second?:string;progress:number;opacity?:number;size?:number;align?:'left'|'center'}>=({top=235,first,second,progress,opacity=1,size=170,align='left'})=><div style={{position:'absolute',left:130,right:110,top,fontFamily:FONT,fontWeight:800,fontSize:size,lineHeight:.98,letterSpacing:-size*.055,color:PC.ink,textAlign:align,opacity,transform:`translateY(${(1-ease(progress))*65}px)`,clipPath:`inset(0 0 ${Math.max(0,(1-progress)*100)}% 0)`}}><div>{first}</div>{second&&<div style={{color:PC.green2}}>{second}</div>}</div>;

export const PaymentTrail:React.FC<{frame:number;progress:number;opacity?:number;d?:string}>=({frame,progress,opacity=1,d='M230 1440 C100 1190 350 1140 540 1180 S950 1040 790 850'})=><svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position:'absolute',inset:0,overflow:'visible',opacity}}>
 <path d={d} pathLength={1} fill="none" stroke={PC.green} strokeWidth={2} opacity={.12}/>
 <path d={d} pathLength={1} fill="none" stroke={PC.green2} strokeWidth={13} opacity={.08} strokeDasharray={`${progress} 1`} strokeLinecap="round"/>
 <path d={d} pathLength={1} fill="none" stroke={PC.green2} strokeWidth={4} strokeDasharray={`${progress} 1`} strokeLinecap="round"/>
 {[0,.33,.66].map((shift,i)=><path key={i} d={d} pathLength={1} fill="none" stroke={PC.green2} strokeWidth={9} strokeLinecap="round" strokeDasharray=".012 .988" strokeDashoffset={-(frame/110+shift)%1} opacity={progress>.95?.7:0}/>)}
</svg>;

export const CheckoutWindow:React.FC<{x:number;y:number;scale:number;rotate:number;opacity:number;paid:number;energy:number}>=({x,y,scale,rotate,opacity,paid,energy})=>{const asset=useAsset();return <div data-hero="checkout" style={{position:'absolute',left:x-300,top:y-400,width:600,height:800,opacity,transform:`perspective(1800px) rotateY(${rotate}deg) rotateX(5deg) scale(${scale})`,transformOrigin:'50% 50%',borderRadius:32,background:'#fff',border:`3px solid ${PC.line}`,boxShadow:'12px 12px 0 #d6e5dc,18px 18px 0 #bcd1c4,24px 50px 70px rgba(6,46,25,.17)',overflow:'hidden'}}>
 <div style={{height:68,borderBottom:`2px solid ${PC.line}`,background:'#f4f8f5',display:'flex',alignItems:'center',gap:10,paddingLeft:28}}>{[0,1,2].map(i=><div key={i} style={{width:12,height:12,borderRadius:'50%',background:i===0?PC.green2:PC.line}}/>)}<div style={{width:260,height:28,borderRadius:8,marginLeft:44,background:'#e4eee8'}}/></div>
 <div style={{padding:'34px 38px',fontFamily:FONT}}>
  <div style={{fontSize:45,fontWeight:800,letterSpacing:-1.5,color:PC.ink}}>Your checkout.</div>
  <div style={{marginTop:24,height:350,borderRadius:22,background:'radial-gradient(ellipse at 48% 42%,#d9ecdf,#f3f7f4 75%)',position:'relative',overflow:'hidden'}}>
   <div style={{position:'absolute',left:90,bottom:12,width:280,height:32,borderRadius:'50%',background:'#a7c7b3',filter:'blur(20px)',opacity:.4}}/>
   <Img src={asset('coffee-cup.png')} style={{position:'absolute',width:220,height:330,objectFit:'contain',left:140,top:6,transform:`rotate(-6deg) translateY(${-3*energy}px)`,filter:'drop-shadow(8px 15px 9px #0b603625)'}}/>
  </div>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:25,color:PC.ink}}><span style={{fontSize:36,fontWeight:600}}>Coffee, your way.</span><span style={{fontFamily:MONO,fontSize:30,color:PC.green}}>×1</span></div>
  <div style={{height:88,marginTop:32,borderRadius:17,background:paid>.5?PC.green2:PC.green,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',gap:16,fontWeight:600,fontSize:35,boxShadow:`0 0 ${paid*25}px #0f8a4d35`}}>{paid>.5?<><svg width={38} height={38} viewBox="0 0 40 40"><path d="M7 21L17 30L34 10" fill="none" stroke="white" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"/></svg>Payment complete</>:<>Tap to pay <span style={{fontSize:42}}>↗</span></>}</div>
 </div>
</div>;};

export const PaymentCard:React.FC<{x:number;y:number;angle:number;scale:number;opacity:number}>=({x,y,angle,scale,opacity})=><div data-hero="payment-card" style={{position:'absolute',left:x-175,top:y-110,width:350,height:220,borderRadius:23,background:'linear-gradient(125deg,#f9fff9 4%,#dcebe1 45%,#ffffff 63%,#e0ece4 100%)',border:'2px solid #a9c5b3',boxShadow:'0 8px 0 #90b09e,8px 24px 25px #0b603635',transform:`perspective(900px) rotateY(-12deg) rotate(${angle}deg) scale(${scale})`,opacity,overflow:'hidden'}}>
 <div style={{position:'absolute',width:180,height:350,left:225,top:-70,background:PC.green,transform:'rotate(30deg)'}}/>
 <div style={{position:'absolute',left:32,top:48,width:56,height:43,borderRadius:8,border:'1px solid #b5a87c',background:'linear-gradient(120deg,#d4c89e,#f0e6c6,#bfb188)',overflow:'hidden'}}><div style={{position:'absolute',left:18,top:0,width:18,height:43,borderLeft:'1px solid #a69970',borderRight:'1px solid #a69970'}}/><div style={{position:'absolute',left:0,top:20,width:56,height:1,background:'#a69970'}}/></div>
 <svg width={45} height={50} viewBox="0 0 45 50" style={{position:'absolute',left:110,top:42}}>{[0,1,2].map(i=><path key={i} d={`M${12+i*8} ${16-i*5}Q${22+i*8} 25 ${12+i*8} ${34+i*5}`} fill="none" stroke={PC.green} strokeWidth={3} strokeLinecap="round"/>)}</svg>
 <div style={{position:'absolute',left:32,bottom:34,display:'flex',gap:8}}>{[0,1,2,3].map(i=><div key={i} style={{width:42,height:6,borderRadius:3,background:'#779984'}}/>)}</div>
</div>;

export const TapRipple:React.FC<{frame:number;at:number;x:number;y:number}>=({frame,at,x,y})=><>{[0,7,14].map((delay,i)=>{const p=ramp(frame,at+delay,at+delay+27);return <div key={i} style={{position:'absolute',left:x-95,top:y-95,width:190,height:190,borderRadius:'50%',border:`${3-i*.5}px solid ${PC.green2}`,transform:`scale(${.15+p*1.7})`,opacity:frame<at+delay?0:(1-p)*.7}}/>;})}</>;

export const BrandLock:React.FC<{progress:number;energy:number}>=({progress,energy})=>{const asset=useAsset();return <div style={{position:'absolute',left:110,right:110,top:510,opacity:progress,transform:`translateY(${(1-ease(progress))*65}px)`,textAlign:'center'}}>
 <div style={{position:'absolute',left:150,top:-40,width:560,height:560,borderRadius:'50%',border:`1px solid ${PC.line}`,transform:`scale(${.9+progress*.1+energy*.003})`}}/>
 <Img src={asset('paycreate-mark.png')} style={{display:'block',width:225,height:265,objectFit:'contain',margin:'55px auto 0'}}/>
 <div style={{fontFamily:FONT,fontWeight:800,fontSize:112,lineHeight:1.05,letterSpacing:-6,color:PC.green,marginTop:60}}>PayCreate.</div>
 <div style={{fontFamily:FONT,fontWeight:600,fontSize:42,letterSpacing:-1,color:PC.ink,marginTop:26}}>Make it. Sell it. Tap.</div>
</div>;};

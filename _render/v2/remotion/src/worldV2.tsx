import React from 'react';
import {AbsoluteFill,Img} from 'remotion';
import {FONT,PC} from './look';
import {useAsset,ramp,ease} from './world';
export * from './world';

type Point=readonly [number,number];
/** Maps a real plane's four corners, including perspective, rather than rotating a flat label. */
export const planeMatrix=(width:number,height:number,q:readonly [Point,Point,Point,Point])=>{
 const [[x0,y0],[x1,y1],[x2,y2],[x3,y3]]=q;
 const dx1=x1-x2,dx2=x3-x2,dx3=x0-x1+x2-x3;
 const dy1=y1-y2,dy2=y3-y2,dy3=y0-y1+y2-y3;
 const den=dx1*dy2-dx2*dy1;
 const g=(dx3*dy2-dx2*dy3)/den,h=(dx1*dy3-dx3*dy1)/den;
 const a=x1-x0+g*x1,b=x3-x0+h*x3,d=y1-y0+g*y1,e=y3-y0+h*y3;
 return `matrix3d(${a/width},${d/width},0,${g/width},${b/height},${e/height},0,${h/height},0,0,1,0,${x0},${y0},0,1)`;
};

export const CoffeeShop:React.FC<{x:number;y:number;width:number;rotate?:number;opacity?:number;name?:boolean}>=({x,y,width,rotate=0,opacity=1,name=false})=>{
 const asset=useAsset(); const s=width/1254;
 const quad=([[235,327],[820,253],[820,326],[235,386]] as const).map(([a,b])=>[a*s,b*s] as Point) as unknown as [Point,Point,Point,Point];
 return <div data-hero="coffee-shop-corrected" style={{position:'absolute',left:x-width/2,top:y-width/2,width,height:width,opacity,transform:`rotate(${rotate}deg)`,filter:'drop-shadow(0 30px 18px rgba(6,46,25,.13))'}}>
  <Img src={asset('coffee-shop.png')} style={{width:'100%',height:'100%'}}/>
  {name&&<div data-sign="fascia-plane" style={{position:'absolute',left:0,top:0,width:600,height:80,transformOrigin:'0 0',transform:planeMatrix(600,80,quad),display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',fontFamily:FONT,fontWeight:600,fontSize:58,lineHeight:1,letterSpacing:3,color:'#f6f5e9',textShadow:'0 1px 1px #041d10'}}>YOUR NAME</div>}
 </div>;
};

const ratios:Record<string,number>={'brew-station.png':1179/1334,'payment-terminal.png':1199/1312,'carry-bag.png':1312/1199,'coffee-bag.png':1.5,'coffee-cup.png':1.5,'iced-coffee.png':1.5};
export const ProductCutout:React.FC<{image:string;x:number;y:number;width:number;angle?:number;opacity?:number;style?:React.CSSProperties}>=({image,x,y,width,angle=0,opacity=1,style})=>{
 const asset=useAsset(); const height=width*(ratios[image]??1);
 return <Img data-product={image} src={asset(image)} style={{position:'absolute',left:x-width/2,top:y-height/2,width,height,objectFit:'contain',opacity,transform:`rotate(${angle}deg)`,filter:'drop-shadow(10px 20px 15px #0b603622)',...style}}/>;
};

export const BrewStation:React.FC<{x:number;y:number;width:number;frame:number;pour?:number;steam?:number;opacity?:number}>=({x,y,width,frame,pour=0,steam=0,opacity=1})=>{
 const asset=useAsset(); const h=width*1179/1334;
 return <div data-hero="espresso-action" style={{position:'absolute',left:x-width/2,top:y-h/2,width,height:h,opacity,filter:'drop-shadow(10px 20px 18px #0b603629)'}}>
  <Img src={asset('brew-station.png')} style={{width:'100%',height:'100%'}}/>
  <svg viewBox="0 0 1334 1179" style={{position:'absolute',inset:0,width:'100%',height:'100%',overflow:'visible'}}>
   {[784,864].map((sx,i)=><g key={sx} opacity={pour}><path d={`M${sx} 568 Q${sx+Math.sin(frame*.7+i)*2} 590 ${sx-4} 612`} stroke="#513017" strokeWidth={7} fill="none"/><path d={`M${sx-2} 570 L${sx-5} 608`} stroke="#d9a562" strokeWidth={2} strokeDasharray="8 7" strokeDashoffset={-frame*3} fill="none"/></g>)}
   {[0,1,2].map(i=><path key={i} d={`M${765+i*40} 604 C${735+i*40+Math.sin(frame/13+i)*20} 550 ${830+i*20} 530 ${780+i*20} 470 S${790+i*30} 410 ${780+i*25} 380`} fill="none" stroke="#fafafa" strokeWidth={8} strokeLinecap="round" opacity={steam*(.3+i*.1)} strokeDasharray="95 65" strokeDashoffset={-frame*2}/>) }
  </svg>
 </div>;
};

export const PaymentTerminal:React.FC<{x:number;y:number;width:number;paid?:number;opacity?:number;angle?:number}>=({x,y,width,paid=0,opacity=1,angle=0})=>{
 const asset=useAsset(); const h=width*1199/1312,s=width/1312;
 const q=([[425,237],[805,226],[990,618],[574,652]] as const).map(([a,b])=>[a*s,b*s] as Point) as unknown as [Point,Point,Point,Point];
 return <div data-hero="physical-terminal" style={{position:'absolute',left:x-width/2,top:y-h/2,width,height:h,opacity,transform:`rotate(${angle}deg)`,filter:'drop-shadow(12px 25px 18px #0b603629)'}}>
 <Img src={asset('payment-terminal.png')} style={{width:'100%',height:'100%'}}/>
 <div style={{position:'absolute',left:0,top:0,width:400,height:400,transformOrigin:'0 0',transform:planeMatrix(400,400,q),display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:24,color:PC.green,fontFamily:FONT,fontWeight:600,fontSize:43}}>
  <svg width={105} height={105} viewBox="0 0 100 100">{paid>.5?<><circle cx={50} cy={50} r={45} fill={PC.green}/><path d="M27 51L44 67L75 32" fill="none" stroke="white" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round"/></>:<>{[0,1,2].map(i=><path key={i} d={`M${30+i*14} ${35-i*9}Q${45+i*14} 50 ${30+i*14} ${65+i*9}`} stroke={PC.green} strokeWidth={5} fill="none" strokeLinecap="round"/>)}</>}</svg>
  <span>{paid>.5?'Paid.':'Tap here.'}</span>
 </div></div>;
};

/** A directional edit motivated by a merchant action, kept behind the global captions. */
export const GreenSweep:React.FC<{frame:number;at:number;duration?:number;reverse?:boolean}>=({frame,at,duration=22,reverse=false})=>{
 const p=ramp(frame,at,at+duration); if(p===0||p===1)return null;
 return <AbsoluteFill style={{pointerEvents:'none',transform:`translateX(${(reverse?-1:1)*(-150+300*ease(p))}%) skewX(-12deg)`,background:PC.green,width:'130%',left:'-15%',boxShadow:'30px 0 0 #0f8a4d,55px 0 0 #c9dcd2'}}/>;
};

export const Counter:React.FC<{top?:number;opacity?:number}>=({top=1300,opacity=1})=><div style={{position:'absolute',left:-80,right:-80,top,height:110,opacity,background:'linear-gradient(#faf6ed,#e9dfcd 14%,#d0bea1 17%,#f1e7d6 22%,#dfd3bc)',borderRadius:'50% 50% 0 0 / 15% 15% 0 0',boxShadow:'0 18px 35px #0b603612',transform:'rotate(-2deg)'}}/>;

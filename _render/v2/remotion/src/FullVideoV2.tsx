import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,cancelRender,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import {Scene01HookV3} from './Scene01HookV3';
import {Verse01V2} from './Verse01V2';
import {Verse02V2} from './Verse02V2';
import {Chorus02V2,Chorus03V2,FinaleV2} from './RefrainsV2';
import {AssetBase,BrandFonts,GreenSweep} from './worldV2';
import {PayCreateSubtitles} from './PayCreateSubtitles';

export const FULL_DURATION=2479;
const LocationEdits:React.FC=()=>{const frame=useCurrentFrame();return <>{[423,1234,1627].map(at=><GreenSweep key={at} frame={frame} at={at}/>)}</>;};
export const FinalHookAndOutroV2:React.FC=()=> <><Sequence durationInFrames={381}><Chorus03V2/></Sequence><Sequence from={381} durationInFrames={460}><FinaleV2/></Sequence></>;
export type FullVideoProps={assetBase?:string;audioFile?:string;subtitles?:boolean};
const FontReady:React.FC=()=>{
 const [handle]=useState(()=>delayRender('Loading PayCreate typography'));
 useEffect(()=>{Promise.all([document.fonts.load('500 57px "PayCreate Poppins"'),document.fonts.load('600 57px "PayCreate Poppins"'),document.fonts.load('800 112px "PayCreate Poppins"'),document.fonts.load('400 30px "PayCreate Mono"')]).then(()=>continueRender(handle)).catch(e=>cancelRender(e));},[handle]);
 return null;
};
export const FullVideoV2:React.FC<FullVideoProps>=({assetBase=staticFile('assets'),audioFile='full-c3.wav',subtitles=true})=><AssetBase.Provider value={assetBase}>
 <AbsoluteFill style={{background:'#fafafa',overflow:'hidden'}}>
  <BrandFonts/><FontReady/>
  <Sequence durationInFrames={434}><Scene01HookV3/></Sequence>
  <Sequence from={434} durationInFrames={397}><Verse01V2/></Sequence>
  <Sequence from={831} durationInFrames={414}><Chorus02V2/></Sequence>
  <Sequence from={1245} durationInFrames={393}><Verse02V2/></Sequence>
  <Sequence from={1638} durationInFrames={841}><FinalHookAndOutroV2/></Sequence>
  <LocationEdits/>{subtitles?<PayCreateSubtitles/>:null}
  <Audio src={`${assetBase}/${audioFile}`}/>
 </AbsoluteFill>
</AssetBase.Provider>;

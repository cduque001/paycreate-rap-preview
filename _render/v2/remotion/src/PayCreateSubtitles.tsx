import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import type {Caption} from '@remotion/captions';
import captionData from './fullCaptions.json';
import {FONT,PC} from './look';
import {ease,ramp} from './world';

const captions:Caption[]=captionData;
const accents=/^(paycreate|name|door|way|shop|block|checkout|make|sell|key|daylight|brewing|regulars|strong|ice|online|bag|coffee|tag|counter|site|statement|charge|fee|clearer|setup|stacked|beans|back|tomorrow)/i;
export const PayCreateSubtitles:React.FC=()=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const now=frame/fps*1000;
 const cue=captions.find(c=>c.startMs<=now&&now<c.endMs);if(!cue)return null;
 const words=cue.text.split(/\s+/);const hasAccent=words.some(w=>accents.test(w));
 const enter=ease(ramp(frame,cue.startMs/1000*fps-1,cue.startMs/1000*fps+3));
 return <div data-testid="paycreate-subtitles" style={{position:'absolute',left:105,right:180,top:1470,display:'flex',justifyContent:'center',pointerEvents:'none',opacity:.65+.35*enter,transform:`translateY(${(1-enter)*8}px)`}}>
  <div style={{fontFamily:FONT,fontWeight:600,fontSize:cue.text.length>29?50:57,lineHeight:1.16,letterSpacing:-1.4,textAlign:'center',color:'#fafafa',background:PC.ink,border:'2px solid #215b3c',borderRadius:22,padding:'14px 24px',boxShadow:'0 10px 30px #082c1c20',maxWidth:'100%'}}>
   {words.map((word,i)=><React.Fragment key={i}>{i>0?' ':null}<span style={{color:accents.test(word)||(!hasAccent&&i===words.length-1)?PC.green2:'#fafafa'}}>{word}</span></React.Fragment>)}
  </div>
 </div>;
};

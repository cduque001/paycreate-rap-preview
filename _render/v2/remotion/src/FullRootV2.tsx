import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {FULL_DURATION,FullVideoV2} from './FullVideoV2';
const Root:React.FC=()=> <Composition id="PayCreateFullV2" component={FullVideoV2} durationInFrames={FULL_DURATION} fps={30} width={1080} height={1920}/>;
registerRoot(Root);

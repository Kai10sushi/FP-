import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile} from 'remotion';
import scenes from './storyboard.json';

export const storyboardDuration = scenes.reduce((sum, scene) => sum + scene.seconds * 30, 0);

// Approved still designs can later be split into timed layers.
// Keep separate from IntroPreview while visual direction is being reviewed.
export const VisualStoryboard: React.FC = () => (
  <AbsoluteFill style={{background: '#f5f3ec'}}>
    {scenes.map((scene, index) => (
      <Sequence key={scene.file} from={scenes.slice(0, index).reduce((sum, s) => sum + s.seconds * 30, 0)} durationInFrames={scene.seconds * 30}>
        <Img src={staticFile('storyboard/' + scene.file)} style={{width: '100%', height: '100%'}} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

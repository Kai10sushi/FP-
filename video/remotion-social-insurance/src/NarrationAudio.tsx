import React from 'react';
import {staticFile} from 'remotion';
import recordings from './narration-recordings.json';

export type NarrationKey = keyof typeof recordings;
export const NarrationAudioContext = React.createContext(true);
export const NarrationAudioProvider = NarrationAudioContext.Provider;
export function useNarrationAudio(key:NarrationKey) {
  const enhanced=React.useContext(NarrationAudioContext);
  return staticFile(enhanced?recordings[key].processed:recordings[key].source);
}


import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export type SocialInsuranceProps = {
  title: string;
  subtitle: string;
};

const fields = [
  {name: '医療保険', description: '病気やけがの医療を支える', color: '#2563eb'},
  {name: '年金保険', description: '老後・障害・遺族を支える', color: '#7c3aed'},
  {name: '介護保険', description: '介護サービスの利用を支える', color: '#059669'},
  {name: '雇用保険', description: '失業・再就職などを支える', color: '#d97706'},
  {name: '労災保険', description: '仕事・通勤中の傷病を支える', color: '#dc2626'},
];

export const SocialInsuranceOverview: React.FC<SocialInsuranceProps> = ({title, subtitle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const titleProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const closingProgress = interpolate(frame, [255, 300], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
        color: '#0f172a',
        fontFamily: 'Yu Gothic, Meiryo, sans-serif',
        padding: 96,
      }}
    >
      <div style={{opacity: titleProgress, transform: `translateY(${interpolate(titleProgress, [0, 1], [24, 0])}px)`}}>
        <div style={{color: '#4f46e5', fontSize: 30, fontWeight: 700, letterSpacing: 4}}>
          制度の翻訳室
        </div>
        <div style={{fontSize: 84, fontWeight: 800, marginTop: 24}}>{title}</div>
        <div style={{fontSize: 38, color: '#475569', marginTop: 18}}>{subtitle}</div>
      </div>

      <div style={{display: 'flex', gap: 24, marginTop: 100, alignItems: 'stretch'}}>
        {fields.map((field, index) => {
          const progress = spring({
            frame,
            fps,
            delay: 42 + index * 12,
            config: {damping: 200},
          });
          return (
            <div
              key={field.name}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 24,
                boxShadow: '0 18px 50px rgba(30, 41, 59, 0.10)',
                flex: 1,
                minHeight: 260,
                opacity: progress,
                padding: 32,
                transform: `translateY(${interpolate(progress, [0, 1], [48, 0])}px)`,
                borderTop: `10px solid ${field.color}`,
              }}
            >
              <div style={{fontSize: 36, fontWeight: 800, color: field.color}}>{field.name}</div>
              <div style={{fontSize: 26, lineHeight: 1.5, marginTop: 32, color: '#334155'}}>
                {field.description}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          fontSize: 30,
          fontWeight: 700,
          justifyContent: 'center',
          marginTop: 74,
          opacity: closingProgress,
        }}
      >
        困りごとに応じて、確認する制度と窓口が変わります
      </div>
    </AbsoluteFill>
  );
};

import React from 'react';
import {OverviewPayroll,overviewPayrollDuration} from './OverviewPayroll';
import {ApprovedIntroStoryboard,approvedIntroDuration} from './ApprovedIntroStoryboard';
import {Composition} from 'remotion';
import {PremiumSupplement,premiumDuration} from './PremiumSupplement';
import {NarratedRisk,NarratedCoverage,NarratedFiveChapters,riskDuration,coverageDuration,fiveChaptersDuration} from './NarratedBenefits';
import {NarratedFields, NarratedThreeChapters, fieldsDuration, threeChaptersDuration} from './NarratedFields';
import {NarratedIntro, narratedIntroDuration} from './NarratedIntro';
import {NarratedPurpose, NarratedChapters, purposeDuration, chaptersDuration} from './NarratedPurpose';
import {IntroPreview, introDuration} from './IntroPreview';
import {VisualStoryboard, storyboardDuration} from './VisualStoryboard';
import {SocialInsuranceOverview, type SocialInsuranceProps} from './SocialInsuranceOverview';

const defaultProps: SocialInsuranceProps = {
  title: '社会保険とは？',
  subtitle: '暮らしのリスクを支える5つの分野',
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Composition id="OverviewPayroll" component={OverviewPayroll} durationInFrames={overviewPayrollDuration} fps={30} width={1600} height={900}/>
    <Composition id="ApprovedIntroStoryboard" component={ApprovedIntroStoryboard} durationInFrames={approvedIntroDuration} fps={30} width={1600} height={900}/>
    <Composition id="PremiumSupplement" component={PremiumSupplement} durationInFrames={premiumDuration} fps={30} width={1600} height={900}/>
    <Composition id="PremiumSupplementDraft" component={PremiumSupplement} durationInFrames={premiumDuration/3} fps={10} width={1600} height={900}/>
    <Composition id="NarratedRisk" component={NarratedRisk} durationInFrames={riskDuration} fps={30} width={1600} height={900}/>
    <Composition id="NarratedCoverage" component={NarratedCoverage} durationInFrames={coverageDuration} fps={30} width={1600} height={900}/>
    <Composition id="NarratedFiveChapters" component={NarratedFiveChapters} durationInFrames={fiveChaptersDuration} fps={30} width={1600} height={900}/>
    <Composition id="NarratedFields" component={NarratedFields} durationInFrames={fieldsDuration} fps={30} width={1600} height={900}/>
    <Composition id="NarratedThreeChapters" component={NarratedThreeChapters} durationInFrames={threeChaptersDuration} fps={30} width={1600} height={900}/>
    <Composition id="NarratedPurpose" component={NarratedPurpose} durationInFrames={purposeDuration} fps={30} width={1600} height={900}/>
    <Composition id="NarratedChapters" component={NarratedChapters} durationInFrames={chaptersDuration} fps={30} width={1600} height={900}/>
    <Composition id="NarratedIntro" component={NarratedIntro} durationInFrames={narratedIntroDuration} fps={30} width={1600} height={900}/>
    <Composition id="VisualStoryboard" component={VisualStoryboard} durationInFrames={storyboardDuration} fps={30} width={1600} height={900}/>
    <Composition id="IntroPreview" component={IntroPreview} durationInFrames={introDuration} fps={30} width={1920} height={1080}/>
    <Composition
      id="SocialInsuranceOverview"
      component={SocialInsuranceOverview}
      durationInFrames={360}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={defaultProps}
    />
    </>
  );
};

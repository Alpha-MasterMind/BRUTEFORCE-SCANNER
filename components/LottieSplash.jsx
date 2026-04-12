// components/LottieSplash.jsx
import { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';

const SPLASH_SEGMENTS = [
  [0, 120],    // Scene 1: DecryptingAccess
  [121, 260],  // Scene 2: BootUp
  [261, 360],  // Scene 3: LockBreach
  [360, 600],  // Scene 4: AccessGranted
];

export default function LottieSplash({ onComplete }) {
  const lottieRef = useRef();
  const segmentIndex = useRef(0);

  useEffect(() => {
    const advanceSegment = () => {
      segmentIndex.current++;
      if (segmentIndex.current < SPLASH_SEGMENTS.length) {
        lottieRef.current.playSegments(SPLASH_SEGMENTS[segmentIndex.current], true);
      } else {
        setTimeout(onComplete, 500);
      }
    };

    const timer = setInterval(advanceSegment, 2000); // 2 seconds per segment

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <Lottie
        lottieRef={lottieRef}
        animationData="/animations/bruteforce_master.json"
        loop={false}
        autoplay={true}
        initialSegment={SPLASH_SEGMENTS[0]}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div className="absolute bottom-8 text-cyan-400 text-xs tracking-widest">
        BruteforceScannerR
      </div>
    </div>
  );
} 

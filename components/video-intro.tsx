"use client"

import { useEffect, useRef, useState } from "react"

interface VideoIntroProps {
  onComplete: () => void
  onSkip: () => void
}

export default function VideoIntro({ onComplete, onSkip }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loopCount, setLoopCount] = useState(0);
  const maxLoops = 3;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Simple autoplay attempt - let the browser handle it
    const playVideo = () => {
      video.play().catch(() => {
        // Autoplay blocked - browser will handle it
      });
    };

    // Try when video can play
    if (video.readyState >= 3) {
      playVideo();
    } else {
      video.addEventListener('canplay', playVideo, { once: true });
    }
  }, []);

  const handleVideoEnd = () => {
    if (loopCount < maxLoops - 1) {
      // Loop the video
      setLoopCount(prev => prev + 1);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    } else {
      // Complete after 3 loops
      onComplete();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black flex items-center justify-center z-[9999]"
      onClick={onSkip}
    >
      <div className="w-full h-full flex items-center justify-center bg-black">
        <video 
          ref={videoRef}
          className="h-auto max-h-full w-auto max-w-full object-contain"
          playsInline={true}
          muted={true}
          autoPlay={true}
          onEnded={handleVideoEnd}
          preload="auto"
          disablePictureInPicture
          loop={false}
        >
        <source src="/engagement-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

"use client";
import React, { useRef, useState, useEffect } from "react";

type Video360ViewerProps = {
  src: string;
  frameCount: number;
  duration: number;
};

const Video360Viewer: React.FC<Video360ViewerProps> = ({ src, frameCount, duration }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const deltaXRef = useRef(0);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    deltaXRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleDrag(e.clientX);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleDrag(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    deltaXRef.current = 0;
  };

  const handleDrag = (clientX: number) => {
    const deltaX = clientX - startX;
    deltaXRef.current += deltaX;
    setStartX(clientX);

    const threshold = 10;

    if (Math.abs(deltaXRef.current) >= threshold) {
      const direction = deltaXRef.current > 0 ? 1 : -1;
      let newFrame = (currentFrame + direction) % frameCount;
      if (newFrame < 0) newFrame += frameCount;

      setCurrentFrame(newFrame);

      const video = videoRef.current;
      if (video) {
        const timePerFrame = duration / frameCount;
        video.currentTime = newFrame * timePerFrame;
      }

      deltaXRef.current = 0;
    }
  };

  const handleDoubleClick = () => {
    setZoomed((prev) => !prev);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = currentFrame * (duration / frameCount);
    }
  }, [currentFrame, duration, frameCount]);

  return (
    <div
      className={`w-full overflow-hidden touch-none ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        className={`w-full select-none pointer-events-none transition-transform duration-300 ease-in-out ${zoomed ? "scale-150" : "scale-100"}`}
      />
    </div>
  );
};

export default Video360Viewer;

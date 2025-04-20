"use client";
import React, { useRef, useState, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

type Video360ViewerProps = {
  src: string;
  frameCount: number;
  duration: number;
};

const Video360Viewer: React.FC<Video360ViewerProps> = ({ src, frameCount, duration }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const deltaXRef = useRef(0);
  const lastUpdateTimeRef = useRef(0);
  const frameUpdateInterval = 100;

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
    const now = Date.now();
    if (now - lastUpdateTimeRef.current < frameUpdateInterval) return;

    const deltaX = clientX - startX;
    deltaXRef.current += deltaX;
    setStartX(clientX);

    const threshold = 10;
    if (Math.abs(deltaXRef.current) >= threshold) {
      const direction = deltaXRef.current > 0 ? -1 : 1;
      let newFrame = (currentFrame + direction) % frameCount;
      if (newFrame < 0) newFrame += frameCount;

      setCurrentFrame(newFrame);

      const video = videoRef.current;
      if (video) {
        const timePerFrame = duration / frameCount;
        video.currentTime = newFrame * timePerFrame;
      }

      deltaXRef.current = 0;
      lastUpdateTimeRef.current = now;
    }
  };

  const handleDoubleClick = () => {
    setZoomed((prev) => !prev);
  };

  const toggleFullscreen = () => {
    const elem = containerRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = currentFrame * (duration / frameCount);
    }
  }, [currentFrame, duration, frameCount]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className="bg-white flex justify-center items-center p-4">
      <div
        ref={containerRef}
        className={`relative touch-none max-w-full w-full h-auto aspect-video ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
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
          className={`w-full h-full object-contain select-none pointer-events-none transition-transform duration-300 ease-in-out ${zoomed ? "scale-150" : "scale-100"}`}
        />

        <button onClick={toggleFullscreen} className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-80 transition">
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Video360Viewer;

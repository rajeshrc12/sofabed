import React from "react";
import Video360Viewer from "./Video360Viewer";

type VideoItem = {
  name: string;
  label?: string;
  duration: number;
};

type Video360GalleryProps = {
  videos: VideoItem[];
  frameCount: number;
};

const Video360Gallery: React.FC<Video360GalleryProps> = ({ videos, frameCount }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 max-w-5xl mx-auto">
      {videos.map((video, index) => (
        <div key={index} className="rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="bg-gray-100 p-2 text-center font-medium text-sm text-gray-700">{video.label || video.name.replace(".mp4", "").replace(/[-_]/g, " ").toUpperCase()}</div>
          <Video360Viewer src={`/${video.name}`} frameCount={frameCount} duration={video.duration} />
        </div>
      ))}
    </div>
  );
};

export default Video360Gallery;

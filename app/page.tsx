import Video360Gallery from "@/components/Video360Gallery";

export default function Home() {
  const videoFiles = [
    { name: "goggle.mp4", label: "Goggles", duration: 7 },
    { name: "watch.mp4", label: "Watch", duration: 20 },
  ];
  return (
    <div className="min-h-screen bg-white py-10">
      <h1 className="text-2xl font-bold text-center mb-8">360° Product Viewer Gallery</h1>

      <Video360Gallery videos={videoFiles} frameCount={72} />
    </div>
  );
}

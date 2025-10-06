
import AutoSlideshow from '@/components/AutoSlideshow';
import MileStone from '@/components/MileStone';
import HomeContent from '@/components/HomeContent';

export default function Home() {
  return (
    <main className="py-6">
      <AutoSlideshow
        maxWidth={1000}
        interval={5000}
        slides={[
          { src: '/banner-1.jpg', caption: 'Caption Text', alt: 'Nature wide' },
          { src: '/banner-2.jpg', caption: 'Caption Two', alt: 'Snow wide' },
          { src: '/banner-3.jpg', caption: 'Caption Three', alt: 'Mountains wide' },
        ]}
      />
      <HomeContent />
      <MileStone />
    </main>
  );
}
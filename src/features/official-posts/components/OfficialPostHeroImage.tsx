type OfficialPostHeroImageProps = {
  imageUrl: string;
  title: string;
};

export function OfficialPostHeroImage({ imageUrl, title }: OfficialPostHeroImageProps) {
  return (
    <section className="relative h-[386px] overflow-hidden bg-[#F3F5FA]" aria-label="공지 이미지">
      <img
        src={imageUrl}
        alt={title}
        className="h-full w-full object-cover"
        draggable="false"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[128px] bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-[linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)]" />
    </section>
  );
}

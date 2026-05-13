type OfficialPostHeroImageProps = {
  imageUrl: string;
  title: string;
};

export function OfficialPostHeroImage({ imageUrl, title }: OfficialPostHeroImageProps) {
  return (
    <section className="relative h-[386px] overflow-hidden bg-[#EBEDF0]" aria-label="공지 이미지">
      <img
        src={imageUrl}
        alt={title}
        className="h-full w-full object-cover"
        draggable="false"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/10" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_58.667%)]" />
    </section>
  );
}

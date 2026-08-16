import Image from "next/image";

const ImageSection = () => {
  return (
    <div className="group relative mx-auto w-full max-w-sm cursor-default">
      <div className="absolute -inset-3 z-0 rounded-xl border border-border transition-[transform,border-color] group-hover:scale-[1.015] group-hover:border-primary/40" />
      <div className="absolute -inset-3 z-0 rotate-2 rounded-xl border border-white/5 opacity-50 transition-[transform,opacity,border-color] group-hover:rotate-3 group-hover:border-primary/20 group-hover:opacity-100" />

      <div className="relative z-10 aspect-square w-full overflow-hidden rounded-lg bg-card ring-1 ring-border">
        <Image
          src="https://res.cloudinary.com/dfwgprzxo/image/upload/v1767790586/sandeep_bgqjpb.png"
          alt="Portrait of Sandeep Kumar"
          fill
          sizes="(max-width: 640px) 90vw, 384px"
          className="portrait-filter object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-40" />
      </div>
    </div>
  );
};

export default ImageSection;

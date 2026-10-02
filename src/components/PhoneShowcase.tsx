import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import mobileVideo from "../assets/product/mobile-showcase.mp4.asset.json";
import mobilePoster from "../assets/product/mobile-showcase-poster.jpg.asset.json";

type PhoneSlide = {
  type: "image" | "video";
  src: string;
  poster?: string;
  caption: string;
};

// Replace a slot's type and src when its portrait media is ready.
const phoneSlides: PhoneSlide[] = [
  { type: "video", src: mobileVideo.url, poster: mobilePoster.url, caption: "Tell it what you're avoiding. Get one tiny next step." },
  { type: "image", src: "", caption: "Lock in with a focus timer." },
  { type: "image", src: "", caption: "Panic mode: exam in 3 days? Here's your plan." },
];

type PhoneMockupProps = PhoneSlide & { index: number };

export function PhoneMockup({ type, src, poster, caption, index }: PhoneMockupProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen || !src || type !== "video") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) setNear(true);
    }, { rootMargin: "250px" });
    observer.observe(screen);
    return () => observer.disconnect();
  }, [src, type]);

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen || !src || type !== "video") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), { threshold: 0.55 });
    observer.observe(screen);
    return () => observer.disconnect();
  }, [src, type]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (visible && near && !reduced) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [visible, near]);

  return (
    <figure className="phone-figure">
      <div className="phone-shell" aria-label={src ? caption : `Preview slot ${index + 1}`}>
        <span className="phone-side-button phone-side-button-left" aria-hidden="true" />
        <span className="phone-side-button phone-side-button-right" aria-hidden="true" />
        <div ref={screenRef} className="phone-screen">
          {src ? type === "video" ? (
            <video ref={videoRef} src={near ? src : undefined} poster={poster} autoPlay muted loop playsInline preload="metadata" className="phone-media" aria-label={caption} />
          ) : (
            <img src={src} alt={caption} loading="lazy" className="phone-media" />
          ) : (
            <div className="phone-empty" aria-hidden="true">
              <span className="phone-empty-mark">Z</span>
              <span className="phone-empty-number">0{index + 1}</span>
              <span className="phone-empty-rule" />
            </div>
          )}
          <span className="phone-island" aria-hidden="true" />
          <span className="phone-home-indicator" aria-hidden="true" />
        </div>
      </div>
      {caption && <figcaption className="phone-caption">{caption}</figcaption>}
    </figure>
  );
}

export function PhoneShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const updateActive = () => {
    const track = trackRef.current;
    if (!track) return;
    const midpoint = track.getBoundingClientRect().left + track.clientWidth / 2;
    const slides = Array.from(track.querySelectorAll<HTMLElement>(".phone-slide"));
    const nearest = slides.reduce((best, slide, index) => {
      const rect = slide.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - midpoint);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Infinity });
    setActive(nearest.index);
  };

  return (
    <div className="phone-showcase" aria-label="ZeroHours mobile showcase">
      <div ref={trackRef} onScroll={updateActive} className="phone-track">
        {phoneSlides.map((slide, index) => (
          <div className="phone-slide" data-active={active === index} key={index}>
            <PhoneMockup {...slide} index={index} />
          </div>
        ))}
      </div>
      <div className="phone-dots" aria-label="Choose a phone preview">
        {phoneSlides.map((_, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Show phone preview ${index + 1}`}
            aria-current={active === index ? "true" : undefined}
            className="phone-dot-button"
            onClick={() => trackRef.current?.querySelectorAll<HTMLElement>(".phone-slide")[index]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })}
          >
            <span className={`phone-dot ${active === index ? "phone-dot-active" : ""}`} />
          </Button>
        ))}
      </div>
    </div>
  );
}
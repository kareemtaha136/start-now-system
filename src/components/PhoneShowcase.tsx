import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "./ui/button";
import mobileVideo from "../assets/product/phone-walkthrough-clear.webm.asset.json";
import mobileVideoFallback from "../assets/product/phone-walkthrough-clear.mp4.asset.json";
import mobilePoster from "../assets/product/phone-walkthrough-poster.jpg.asset.json";
import phoneHome from "../assets/product/phone-9292.png.asset.json";
import phoneTasks from "../assets/product/phone-9293.png.asset.json";
import phoneStudy from "../assets/product/phone-9294.png.asset.json";
import phoneRescue from "../assets/product/phone-9296.png.asset.json";
import phoneCourses from "../assets/product/phone-9297.png.asset.json";

type PhoneSlide = {
  type: "image" | "video";
  src: string;
  poster?: string;
  fallbackSrc?: string;
  caption: string;
};

// All portrait media lives here. The mobile page places each image only once.
export const phoneMedia = {
  home: { type: "image", src: phoneHome.url, caption: "See your next move and start a lock-in session." },
  video: { type: "video", src: mobileVideo.url, fallbackSrc: mobileVideoFallback.url, poster: mobilePoster.url, caption: "Watch ZeroHours in action on your phone." },
  tasks: { type: "image", src: phoneTasks.url, caption: "Keep your tasks in view." },
  study: { type: "image", src: phoneStudy.url, caption: "Plan a study session that fits your work." },
  rescue: { type: "image", src: phoneRescue.url, caption: "Find a way forward when you're stuck." },
  courses: { type: "image", src: phoneCourses.url, caption: "Keep your courses together." },
} satisfies Record<string, PhoneSlide>;

const desktopSlides: PhoneSlide[] = Object.values(phoneMedia);
const mobileSlides: PhoneSlide[] = [phoneMedia.video, phoneMedia.tasks, phoneMedia.study, phoneMedia.rescue, phoneMedia.courses];

type PhoneMockupProps = PhoneSlide & { index: number };

export function PhoneMockup({ type, src, fallbackSrc, poster, caption, index }: PhoneMockupProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [videoSource, setVideoSource] = useState("");
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!near || type !== "video" || !src) return;
    const probe = document.createElement("video");
    setVideoSource(fallbackSrc && !probe.canPlayType("video/webm; codecs=vp9") ? fallbackSrc : src);
  }, [near, type, src, fallbackSrc]);

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
    if (!visible) videoRef.current?.pause();
  }, [visible]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) { video.pause(); return; }
    if (!videoSource) setVideoSource(src);
    void video.play().catch(() => setFailed(true));
  };

  const handleVideoError = () => {
    if (fallbackSrc && videoSource !== fallbackSrc) {
      setVideoSource(fallbackSrc);
    } else {
      setFailed(true);
    }
  };

  return (
    <figure className="phone-figure">
      <div className="phone-shell" aria-label={src ? caption : `Preview slot ${index + 1}`}>
        <span className="phone-side-button phone-action-button" aria-hidden="true" />
        <span className="phone-side-button phone-volume-up" aria-hidden="true" />
        <span className="phone-side-button phone-volume-down" aria-hidden="true" />
        <span className="phone-side-button phone-power-button" aria-hidden="true" />
        <span className="phone-side-button phone-camera-button" aria-hidden="true" />
        <div ref={screenRef} className="phone-screen">
          {src ? type === "video" ? (
            <>
              <video ref={videoRef} src={videoSource || undefined} poster={poster} onPlay={() => { setPlaying(true); setFailed(false); }} onPause={() => setPlaying(false)} onError={handleVideoError} muted loop playsInline preload="metadata" className="phone-media" aria-label={caption} />
              {!failed ? (
                <Button type="button" variant="ghost" size="icon" onClick={togglePlayback} aria-label={playing ? "Pause phone walkthrough" : "Play phone walkthrough"} className={`phone-video-button ${playing ? "phone-video-button-playing" : ""}`}>
                  {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" fill="currentColor" />}
                </Button>
              ) : <span className="phone-video-error" role="status">Video unavailable</span>}
            </>
          ) : (
            <img src={src} alt={caption} loading="lazy" className="phone-media" />
          ) : (
            <div className="phone-empty" aria-hidden="true">
              <span className="phone-empty-mark">Z</span>
              <span className="phone-empty-number">0{index + 1}</span>
              <span className="phone-empty-rule" />
            </div>
          )}
          <span className="phone-island" aria-hidden="true"><span className="phone-camera-lens" /></span>
          <span className="phone-home-indicator" aria-hidden="true" />
        </div>
      </div>
      {caption && <figcaption className="phone-caption">{caption}</figcaption>}
    </figure>
  );
}

export function PhoneShowcase({ mobileGallery = false }: { mobileGallery?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const phoneSlides = mobileGallery ? mobileSlides : desktopSlides;

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

  const goToSlide = (index: number) => {
    const track = trackRef.current;
    const slide = track?.querySelectorAll<HTMLElement>(".phone-slide")[index];
    if (!track || !slide) return;
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft - (track.clientWidth - slide.clientWidth) / 2, behavior: "instant" });
    setActive(index);
  };

  return (
    <div className="phone-showcase" aria-label="ZeroHours mobile screens and walkthrough">
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
            onClick={() => goToSlide(index)}
          >
            <span className={`phone-dot ${active === index ? "phone-dot-active" : ""}`} />
          </Button>
        ))}
      </div>
    </div>
  );
}
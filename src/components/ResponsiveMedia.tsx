import type { CSSProperties, ReactNode } from "react";

type Tone = "light" | "dark";

type FrameStyle = CSSProperties & {
  "--media-ratio-mobile"?: string;
  "--media-ratio-desktop"?: string;
};

const toneClass: Record<Tone, string> = {
  light: "border-border bg-card shadow-soft",
  dark: "border-ink-border bg-ink-soft shadow-strong",
};

const captionClass: Record<Tone, string> = {
  light: "text-muted-foreground",
  dark: "text-ink-muted",
};

function frameStyle(mobileRatio: string, desktopRatio: string): FrameStyle {
  return {
    "--media-ratio-mobile": mobileRatio,
    "--media-ratio-desktop": desktopRatio,
  };
}

type Shared = {
  /** Shown at >= 640px and used on mobile when no mobile asset exists. */
  desktopSrc: string;
  /** Optional purpose-built mobile asset. Empty string = fall back to desktop. */
  mobileSrc?: string;
  /** CSS aspect-ratio string, e.g. "16 / 9". */
  desktopRatio?: string;
  /** Mobile aspect-ratio. Defaults to the desktop ratio so nothing is cropped. */
  mobileRatio?: string;
  objectPosition?: string;
  /** Short mobile-only caption under the media. */
  caption?: ReactNode;
  tone?: Tone;
  className?: string;
  /** Rounding of the media itself (showcase cards inherit the card radius). */
  mediaClassName?: string;
};

type ImageProps = Shared & {
  alt: string;
  loading?: "lazy" | "eager";
};

/**
 * One media block for the whole page.
 * Desktop presentation is untouched; every mobile-specific treatment lives in
 * mobile-width styling. When no dedicated mobile asset is supplied the full
 * screenshot is preserved at its natural ratio inside a padded card.
 */
export function ResponsiveMedia({
  desktopSrc,
  mobileSrc,
  alt,
  desktopRatio = "16 / 9",
  mobileRatio,
  objectPosition,
  caption,
  tone = "light",
  className = "",
  mediaClassName = "rounded-md",
  loading = "lazy",
}: ImageProps) {
  const hasMobile = Boolean(mobileSrc);
  const resolvedMobileRatio = hasMobile ? (mobileRatio ?? "4 / 5") : desktopRatio;

  return (
    <figure className={`media-card ${toneClass[tone]} ${className}`}>
      <div className="media-frame" style={frameStyle(resolvedMobileRatio, desktopRatio)}>
        <picture>
          {hasMobile && <source media="(max-width: 639px)" srcSet={mobileSrc} />}
          <img
            src={desktopSrc}
            alt={alt}
            loading={loading}
            className={`media-el ${hasMobile ? "object-cover sm:object-contain" : "object-contain"} ${mediaClassName}`}
            style={objectPosition ? { objectPosition } : undefined}
          />
        </picture>
      </div>
      {caption && (
        <figcaption className={`media-caption ${captionClass[tone]}`}>{caption}</figcaption>
      )}
    </figure>
  );
}

type VideoProps = Shared & {
  poster?: string;
  ariaLabel: string;
  children?: ReactNode;
  videoRef?: React.Ref<HTMLVideoElement>;
  frameRef?: React.Ref<HTMLDivElement>;
};

export function ResponsiveVideo({
  desktopSrc,
  mobileSrc,
  desktopRatio = "16 / 9",
  mobileRatio,
  poster,
  ariaLabel,
  caption,
  tone = "light",
  className = "",
  mediaClassName = "rounded-lg",
  children,
  videoRef,
  frameRef,
}: VideoProps) {
  const hasMobile = Boolean(mobileSrc);
  const resolvedMobileRatio = hasMobile ? (mobileRatio ?? "9 / 16") : desktopRatio;

  return (
    <figure className={`media-card ${toneClass[tone]} ${className}`}>
      <div
        ref={frameRef}
        className="media-frame"
        style={frameStyle(resolvedMobileRatio, desktopRatio)}
      >
        <video
          ref={videoRef}
          key={hasMobile ? "responsive" : "single"}
          className={`media-el bg-ink object-contain ${mediaClassName}`}
          controls
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={ariaLabel}
        >
          {hasMobile && <source src={mobileSrc} media="(max-width: 639px)" type="video/mp4" />}
          <source src={desktopSrc} type="video/mp4" />
          Your browser does not support this video.
        </video>
        {children}
      </div>
      {caption && (
        <figcaption className={`media-caption ${captionClass[tone]}`}>{caption}</figcaption>
      )}
    </figure>
  );
}

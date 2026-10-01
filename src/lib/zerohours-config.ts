import guideAsset from "../assets/zerohours-guide.pdf.asset.json";
import includedGuideAsset from "../assets/zerohours-included-guide.pdf.asset.json";
import coursesAsset from "../assets/product/courses.png.asset.json";
import dashboardAsset from "../assets/product/dashboard.png.asset.json";
import demoAsset from "../assets/product/demo.mp4.asset.json";
import lockInAsset from "../assets/product/lock-in.png.asset.json";
import rescueAsset from "../assets/product/rescue.png.asset.json";
import studySessionAsset from "../assets/product/study-session.png.asset.json";
import tasksAsset from "../assets/product/tasks.png.asset.json";
import studentHeroDesktop from "../assets/zerohours-student-hero-desktop-v3.jpg";
import studentHeroMobile from "../assets/zerohours-student-hero-mobile-v3.jpg";

export const productConfig = {
  name: "ZeroHours",
  price: "$29.99",
  checkoutPriceId: "zerohours_one_time",
  /** Free lead-magnet PDF (ZeroHours — Just Start). */
  freeGuideUrl: guideAsset.url,
  /** Browser access details delivered to buyers after purchase. */
  appAccessUrl: "https://app.zerohours.store",
  appAccessCode: "LOCKEDIN2026",
  /** The full ZeroHours guide PDF included with every purchase. */
  includedGuideUrl: includedGuideAsset.url,
  /** Wide (16:9) demo video used on tablet and desktop. */
  demoVideoUrl: demoAsset.url,
  /**
   * Optional vertical (9:16) demo cut used on phones.
   * Leave empty to fall back to the desktop video.
   */
  demoVideoMobileUrl: "",
  demoPosterUrl: dashboardAsset.url,
  studyPackUrl: "",
  examRescueUrl: "",
  offers: {
    studyPack: false,
    examRescue: false,
    completeBundle: false,
  },
} as const;

/**
 * Marketing visuals.
 * `mobileSrc` is an optional purpose-built portrait version. While it is empty
 * the full desktop screenshot is shown at its natural ratio on phones so no
 * part of the app UI is cropped.
 */
export const marketingAssets = {
  hero: {
    src: studentHeroDesktop,
    mobileSrc: studentHeroMobile,
    desktopRatio: "8 / 5",
    mobileRatio: "4 / 5",
    alt: "Student using ZeroHours on a laptop at a clean study desk",
    caption: "ZeroHours open and ready for the next move.",
  },
  problem: {
    src: tasksAsset.url,
    mobileSrc: "",
    mobileRatio: "4 / 5",
    alt: "ZeroHours task list showing schoolwork ordered by urgency and priority",
    caption: "Every assignment in one ordered list.",
  },
  transformation: {
    src: lockInAsset.url,
    mobileSrc: "",
    mobileRatio: "4 / 5",
    alt: "ZeroHours Lock-In Mode turning a difficult assignment into one focused next action",
    caption: "Lock-In Mode turns the assignment into one move.",
  },
  features: {
    src: rescueAsset.url,
    mobileSrc: "",
    mobileRatio: "4 / 5",
    alt: "ZeroHours Rescue screen offering practical ways to restart when work feels stuck",
    caption: "Rescue gets you moving again when you stall.",
  },
} as const;

/**
 * Product showcase screenshots.
 * `src` stays empty until the real screenshot is uploaded; the page shows a
 * labeled placeholder in the meantime. Swap in the asset import and update
 * `alt`, `title`, and `description` when the real files and copy arrive.
 */
export type ShowcaseShot = {
  /** Empty string = placeholder shown. */
  src: string;
  /** Optional portrait version used on phones. Empty = use `src` uncropped. */
  mobileSrc?: string;
  /** Mobile aspect ratio, only applied when `mobileSrc` is provided. */
  mobileRatio?: string;
  alt: string;
  title: string;
  description: string;
};

export const showcaseShots: ShowcaseShot[] = [
  { src: dashboardAsset.url, alt: "ZeroHours home dashboard showing the recommended next move and upcoming work", title: "Know what to do next", description: "See the work that matters now, the smallest next action, and what is coming up." },
  { src: tasksAsset.url, alt: "ZeroHours task list ranked by urgency and priority", title: "Put every task in order", description: "Keep active schoolwork together and quickly start the task that needs attention first." },
  { src: studySessionAsset.url, alt: "ZeroHours Study Session Builder with selected tasks and energy level", title: "Build a realistic study session", description: "Choose your available time, energy level, and the work you want to move forward." },
  { src: lockInAsset.url, alt: "ZeroHours Lock-In Mode focused on one physics problem set", title: "Lock in on one next action", description: "Give one task your attention with a clear action and a focused timer." },
  { src: rescueAsset.url, alt: "ZeroHours Rescue screen with procrastination and catch-up options", title: "Recover when you are stuck", description: "Use Rescue or Catch-Up Mode to stop avoiding the work and restart with a concrete move." },
  { src: coursesAsset.url, alt: "ZeroHours courses overview with class progress, tasks, and exams", title: "Keep schoolwork connected", description: "Organize courses, tasks, exams, notes, and grades in the same academic workspace." },
];

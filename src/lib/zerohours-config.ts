import guideAsset from "../assets/zerohours-guide.pdf.asset.json";
import appAsset from "../assets/zerohours-app.html.asset.json";

export const productConfig = {
  name: "ZeroHours",
  price: "$29.99",
  checkoutPriceId: "zerohours_one_time",
  /** Free lead-magnet PDF (ZeroHours — Just Start). */
  freeGuideUrl: guideAsset.url,
  /** The ZeroHours app file delivered to buyers after purchase. */
  appDownloadUrl: appAsset.url,
  studyPackUrl: "",
  examRescueUrl: "",
  offers: {
    studyPack: false,
    examRescue: false,
    completeBundle: false,
  },
} as const;

export const marketingAssets = {
  logo: "ZeroHours logo",
  hero: "ZeroHours product overview",
  problem: "The procrastination cycle",
  transformation: "From avoidance to momentum",
  features: "ZeroHours feature showcase",
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
  alt: string;
  title: string;
  description: string;
};

export const showcaseShots: ShowcaseShot[] = [
  { src: "", alt: "ZeroHours home dashboard", title: "Home dashboard", description: "See your day, your next action, and what needs attention first." },
  { src: "", alt: "ZeroHours tasks and next action", title: "Tasks & Next Action", description: "Turn vague schoolwork into one clear next move." },
  { src: "", alt: "ZeroHours Lock-In Mode", title: "Lock-In Mode", description: "Once you start, stay focused and keep the thread." },
  { src: "", alt: "ZeroHours Study Session Builder", title: "Study Session Builder", description: "Build a focused session around the work in front of you." },
  { src: "", alt: "ZeroHours Exam Rescue", title: "Exam Rescue", description: "When an exam is close, get a clear plan for what to do next." },
  { src: "", alt: "ZeroHours academic workspace", title: "Academic workspace", description: "Courses, assignments, exams, notes, and grades in one place." },
];

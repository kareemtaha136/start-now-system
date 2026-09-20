import guideAsset from "../assets/zerohours-guide.pdf.asset.json";
import includedGuideAsset from "../assets/zerohours-included-guide.pdf.asset.json";
import appAsset from "../assets/zerohours-app.html.asset.json";
import coursesAsset from "../assets/product/courses.png.asset.json";
import dashboardAsset from "../assets/product/dashboard.png.asset.json";
import demoAsset from "../assets/product/demo.mp4.asset.json";
import lockInAsset from "../assets/product/lock-in.png.asset.json";
import rescueAsset from "../assets/product/rescue.png.asset.json";
import studySessionAsset from "../assets/product/study-session.png.asset.json";
import tasksAsset from "../assets/product/tasks.png.asset.json";

export const productConfig = {
  name: "ZeroHours",
  price: "$29.99",
  checkoutPriceId: "zerohours_one_time",
  /** Free lead-magnet PDF (ZeroHours — Just Start). */
  freeGuideUrl: guideAsset.url,
  /** The ZeroHours app file delivered to buyers after purchase. */
  appDownloadUrl: appAsset.url,
  /** The full ZeroHours guide PDF included with every purchase. */
  includedGuideUrl: includedGuideAsset.url,
  demoVideoUrl: demoAsset.url,
  demoPosterUrl: dashboardAsset.url,
  studyPackUrl: "",
  examRescueUrl: "",
  offers: {
    studyPack: false,
    examRescue: false,
    completeBundle: false,
  },
} as const;

export const marketingAssets = {
  problem: {
    src: tasksAsset.url,
    alt: "ZeroHours task list showing schoolwork ordered by urgency and priority",
  },
  transformation: {
    src: lockInAsset.url,
    alt: "ZeroHours Lock-In Mode turning a difficult assignment into one focused next action",
  },
  features: {
    src: rescueAsset.url,
    alt: "ZeroHours Rescue screen offering practical ways to restart when work feels stuck",
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

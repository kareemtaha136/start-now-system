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

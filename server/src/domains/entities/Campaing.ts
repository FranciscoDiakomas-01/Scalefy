import Trackers from "./Tracker";

export default class Campains {
  id!: string;
  userId!: string;
  title!: string;
  funilUrl!: string;
  factured!: number;
  isActive!: boolean;
  totalEarned!: number;
  totalClicks!: number;
  totalPurchases!: number;
  totalPageViews!: number;
  totalLeaeds!: number;
  trackers!: Trackers[];
}

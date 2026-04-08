import Campains from "./Campaing";

export default class Trackers {
  id!: string;
  campainsId!: string;
  key!: string;
  title!: string;
  url!: string;
  totalEarned!: number;
  totalClicks!: number;
  totalPurchases!: number;
  totalPageViews!: number;
  totalLeaeds!: number;
  createdAt!: Date;
  updatedAt!: Date;
  isActive!: boolean;
  campain!: Campains;
}

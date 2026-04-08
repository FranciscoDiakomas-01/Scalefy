import Events from "./Event";
import Trackers from "./Tracker";

export default class Clicks {
  id!: string;
  trackerId!: string;
  clientData!: any;
  trackerData!: any;
  createdAt!: Date;
  tracker!: Trackers;
  Events!: Events[];
}

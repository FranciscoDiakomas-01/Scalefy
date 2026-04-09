import Events from "./Event";

export default class CardItems {
  id!: string;
  eventId!: string;
  title!: string;
  description!: string;
  price!: number;
  createdAt!: Date;
  event!: Events;
}

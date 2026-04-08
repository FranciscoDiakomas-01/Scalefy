import Events from "src/domains/entities/Event";
import EventDTO from "../dto/create";

export default interface IEventRepositorie {
  getByClickId(clickId: string): Promise<Events[]>;
  register(data: EventDTO): Promise<Events>;
  countEvents(clickId: string): Promise<number>;
}

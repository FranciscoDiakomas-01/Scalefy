import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type IEventRepositorie from "../repositories/absctration";
import type IclickRepository from "src/app/clicks/repositories/absctration";
import NoPermitionError from "src/core/error";

@Injectable()
export default class GetEventsServices {
  constructor(
    @Inject("IEventRepositorie")
    private readonly IEventRepositorie: IEventRepositorie,
    @Inject("IclickRepository")
    private readonly IclickRepository: IclickRepository,
  ) {}

  public async get(userId: string, clickId: string) {
    const click = await this.IclickRepository.getById(clickId);

    if (!click) {
      throw new NotFoundException({
        message: "click não encontrado",
      });
    }

    const { tracker } = click;
    const { campain } = tracker;
    if (campain.userId != userId) {
      throw new NoPermitionError();
    }

    const events = await this.IEventRepositorie.getByClickId(clickId);
    return {
      data: events,
    };
  }
}

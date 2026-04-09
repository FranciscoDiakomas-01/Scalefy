import { Inject, Injectable } from "@nestjs/common";
import { InterService } from "src/core/types";
import CampainsDTO from "../dto/create";
import Campains from "src/domains/entities/Campaing";
import type ICampainRepositorie from "../repositories/absctration";
import { CampainNotFoundError } from "../error";
import NoPermitionError from "src/core/error";

@Injectable()
export default class ToogleCampainService implements InterService<
  { userId: string; campainId: string },
  any
> {
  constructor(
    @Inject("ICampainRepositorie")
    private readonly ICampainRepositorie: ICampainRepositorie,
  ) {}

  public async handle(props: {
    userId: string;
    campainId: string;
  }): Promise<any> {
    const { userId, campainId } = props;
    const existCampain = await this.ICampainRepositorie.getById(campainId);
    if (!existCampain) {
      throw new CampainNotFoundError();
    }
    const canEdit = existCampain.userId === userId;
    if (!canEdit) {
      throw new NoPermitionError();
    }
    const campain = await this.ICampainRepositorie.toogle(
      existCampain.isActive,
      campainId,
    );
    return {
      message: "Actualizado com sucesso",
    };
  }
}

import { HttpException, HttpStatus } from "@nestjs/common";

export class CampainNotFoundError extends HttpException {
  constructor() {
    super("Campanha não enconrada", HttpStatus.NOT_FOUND);
  }
}

import { HttpException } from "@nestjs/common";

export default class NoPermitionError extends HttpException {
  constructor() {
    super("Não posssuis permisão para acessar esta informação", 403);
  }
}

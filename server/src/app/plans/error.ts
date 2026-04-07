import { HttpException } from "@nestjs/common";

export default class PlanNotFoundError extends HttpException {
  constructor() {
    super("Plano não encontrado", 404);
  }
}

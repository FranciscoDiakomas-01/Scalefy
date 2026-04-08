import { HttpException } from "@nestjs/common";

export default class PlanNotFoundError extends HttpException {
  constructor() {
    super("Plano não encontrado", 404);
  }
}

export class NotPlanAssociatedError extends HttpException {
  constructor() {
    super(
      "Seu perfil precisa estar associado a um plano e activo , ou atingiste o seu limite de uso",
      403,
    );
  }
}

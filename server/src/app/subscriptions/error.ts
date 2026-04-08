import { HttpException } from "@nestjs/common";

export default class PlanNotFoundError extends HttpException {
  constructor() {
    super("Plano não encontrado", 404);
  }
}
export class SubscriptionNotFoundError extends HttpException {
  constructor() {
    super("Subscrição não encontrado", 404);
  }
}

export class UserAlreadySubscribed extends HttpException {
  constructor() {
    super("Usuário já possui uma assinatura ativa", 403);
  }
}

export class UserAlreayUsedUnPaidSubscriptionError extends HttpException {
  constructor() {
    super("Usuário já possui uma subscrição não paga", 403);
  }
}

export class UserNotSubscribed extends HttpException {
  constructor() {
    super("Usuário não possui uma assinatura ativa", 403);
  }
}

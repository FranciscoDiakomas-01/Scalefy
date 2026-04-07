import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidCredentialsError extends HttpException {
  constructor() {
    super("Email ou senha incorreto", HttpStatus.FORBIDDEN);
  }
}

export class TokenExpiredError extends HttpException {
  constructor() {
    super("Token expirado , ou inválido", HttpStatus.FORBIDDEN);
  }
}

export class RecoveryNotFoundError extends HttpException {
  constructor() {
    super("Pedido de redefinição não encontrado", HttpStatus.FORBIDDEN);
  }
}

export class RecoveryAlreadyUsesError extends HttpException {
  constructor() {
    super("Token de redefinição já foi usado", HttpStatus.FORBIDDEN);
  }
}

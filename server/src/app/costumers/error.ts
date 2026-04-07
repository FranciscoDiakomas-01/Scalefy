import { HttpException, HttpStatus } from "@nestjs/common";
import { UserRole } from "src/domains/entities/User";

export class CostumerInactiveError extends HttpException {
  constructor() {
    super("Perfil inativo", HttpStatus.FORBIDDEN);
  }
}

export class CostumerAlreadyExistsError extends HttpException {
  constructor() {
    super("Perfil já existe", HttpStatus.CONFLICT);
  }
}

export default class CostumerNotFoundError extends HttpException {
  constructor() {
    super("Perfil não encontrado", HttpStatus.NOT_FOUND);
  }
}

export class CostumerHasNotPermitionError extends HttpException {
  constructor(role: UserRole) {
    super(`Precisar ser ${role} para ser poder avançar`, HttpStatus.NOT_FOUND);
  }
}

import { Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";

@Injectable()
export default class EncriptService {
  private genSalt(): string {
    return bcrypt.genSaltSync();
  }

  public encript(data: string): string {
    return bcrypt.hashSync(data, this.genSalt());
  }

  public compare(data: { plainText: string; hash: string }): boolean {
    const { hash, plainText } = data;
    return bcrypt.compareSync(plainText, hash);
  }
}

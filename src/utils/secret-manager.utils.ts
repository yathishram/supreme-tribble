import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CommonConstants } from "../types/common.constants";

export class SecretManagerUtils {
  generateHashForString(inputString: string) {
    const hash = bcrypt.hashSync(inputString, CommonConstants.HASH_SALT_ROUNDS);
    return hash;
  }

  compareSecrets(str: string, hash: string) {
    const match = bcrypt.compareSync(str, hash);
    return match;
  }
}

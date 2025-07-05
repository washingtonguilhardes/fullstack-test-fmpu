export interface ValidateTokenService {
  execute(token: string): Promise<void>;
}
export const ValidateTokenServiceRef = Symbol('ValidateTokenServiceRef');

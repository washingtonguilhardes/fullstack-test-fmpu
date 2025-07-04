import { Token } from '../domains';

export interface IDecodeTokenService {
  execute(token: string): Promise<Token>;
}

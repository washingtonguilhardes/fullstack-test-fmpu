export interface TokenPayload {
  getSubject(): string;
  getUsername(): string;
  getIssuedAt(): number;
  getType(): string;
  toJSON(): object;
}

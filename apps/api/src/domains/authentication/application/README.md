# Authentication Domain - Application Layer

## IssueTokenService Implementation

The `IssueTokenServiceImpl` class provides JWT (JSON Web Token) generation functionality for user authentication.

## TokenPayload Domain

The `TokenPayloadImpl` class represents the domain model for JWT token payloads, providing validation and structure for token data.

### Features

- **JWT Token Generation**: Creates secure JWT tokens with user information
- **Configuration Management**: Uses NestJS ConfigService for environment-based configuration
- **Token Verification**: Includes utility methods for token verification and decoding
- **Security**: Implements proper JWT standards with issuer, audience, and expiration

### Configuration

The service requires the following environment variables:

```bash
# Required for production
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Optional (defaults to '24h')
JWT_EXPIRES_IN=24h

# Optional (defaults to 'test')
NODE_ENV=production
```

### Usage

```typescript
import { IssueTokenServiceImpl } from './issue-token.service.impl';
import { ConfigService } from '@nestjs/config';

// In your NestJS module
const configService = new ConfigService();
const tokenService = new IssueTokenServiceImpl(configService);

// Generate a token for a user
const token = await tokenService.execute(user);

// Verify a token
const payload = tokenService.verifyToken(token);

// Decode a token (without verification)
const decoded = tokenService.decodeToken(token);
```

### JWT Payload Structure

The generated JWT tokens contain the following payload, which is managed by the `TokenPayloadImpl` domain:

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "username": "user@example.com",
  "iat": 1234567890,
  "type": "access_token",
  "iss": "driveapp-api",
  "aud": "driveapp-users",
  "exp": 1234567890
}
```

### TokenPayload Domain Usage

```typescript
import { TokenPayloadImpl } from '../domain';

// Create a token payload
const tokenPayload = new TokenPayloadImpl(
  'user-123',
  'user@example.com',
  'John',
  'Doe',
  'user@example.com',
);

// Get the JSON representation for JWT signing
const payload = tokenPayload.toJSON();

// Access individual fields
console.log(tokenPayload.getSubject()); // 'user-123'
console.log(tokenPayload.getFullName()); // 'John Doe'
console.log(tokenPayload.getType()); // 'access_token'
```

### Security Considerations

1. **JWT Secret**: Always use a strong, unique secret in production
2. **Token Expiration**: Configure appropriate expiration times
3. **Environment Variables**: Never commit secrets to version control
4. **Token Validation**: Always verify tokens before processing requests

### Error Handling

The service includes comprehensive error handling for:
- Invalid user input
- JWT generation failures
- Token verification errors
- Expired tokens
- Configuration issues

### Integration with NestJS

The service is decorated with `@Injectable()` and can be easily integrated into NestJS modules:

```typescript
@Module({
  providers: [
    {
      provide: IIssueTokenService,
      useClass: IssueTokenServiceImpl,
    },
  ],
})
export class AuthenticationModule {}
```

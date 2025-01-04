import { TokenType } from '@prisma/client'; 
export interface AuthTokens {
  access: {
    token: string;
    expires: Date;
  };
  refresh: {
    token: string;
    expires: Date;
  };
}

// Export TokenType enum as TokenTypes
export { TokenType as TokenTypes };

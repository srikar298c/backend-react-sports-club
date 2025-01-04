export interface Payload {
  sub: number; // User ID or identifier
  type: string; // Type of token (e.g., 'access')
  iat?: number; // Optional: Issued at timestamp
  exp?: number; // Optional: Expiry timestamp
}

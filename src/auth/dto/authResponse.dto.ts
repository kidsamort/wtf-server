export class AuthResponse {
  readonly user: { name: string; email: string };
  readonly accessToken: string;
}

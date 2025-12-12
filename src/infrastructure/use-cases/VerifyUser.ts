import { CognitoAuthService } from '../services/CognitoAuthService';

export class VerifyUser {
  constructor(
    private authService: CognitoAuthService,
  ) {}
  async execute(data: { email: string, code: string }): Promise<any> {
    const { email, code } = data;
  if (!email || !code) throw new Error("Email and code are required");
  return await this.authService.confirmSignUp(email, code);
};
    
}
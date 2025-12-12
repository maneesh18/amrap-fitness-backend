import { CognitoAuthService } from '../services/CognitoAuthService';
import { GlobalSignOutCommandOutput } from "@aws-sdk/client-cognito-identity-provider";

export class SignOutUser {
  constructor(
    private authService: CognitoAuthService,
  ) {}
  async execute(accessToken: string): Promise<GlobalSignOutCommandOutput> {
    if (!accessToken) {
    throw new Error("Cannot sign out without Signing In");
  }
  return await this.authService.signOut(accessToken);
};
    
}


import { CognitoAuthService } from '../services/CognitoAuthService';
import { SignInDTO } from '../../application/dtos/SignInDTO';

export class SignInUser {
  constructor(
    private authService: CognitoAuthService,
  ) {}
  async execute(data: SignInDTO): Promise<any> {
    const { username, password } = data;

  const tokens = await this.authService.signIn(username, password);

  return {
    accessToken: tokens?.AccessToken,
    refreshToken: tokens?.RefreshToken,
    idToken: tokens?.IdToken
  };
};
    
}
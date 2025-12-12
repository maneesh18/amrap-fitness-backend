import { 
  CognitoIdentityProviderClient, 
  SignUpCommand, 
  InitiateAuthCommand, 
  ConfirmSignUpCommand,
  GlobalSignOutCommand 
} from "@aws-sdk/client-cognito-identity-provider";
import crypto from 'crypto';

export class CognitoAuthService {
  private client: CognitoIdentityProviderClient;
  private clientId: string;
  private clientSecret: string | undefined;

  constructor() {
    if (!process.env.AWS_REGION) {
      throw new Error('AWS_REGION environment variable is not set');
    }
    this.client = new CognitoIdentityProviderClient({ 
      region: process.env.AWS_REGION 
    });
    this.clientId = process.env.COGNITO_CLIENT_ID || "";
    this.clientSecret = process.env.COGNITO_CLIENT_SECRET;
  }

  // Helper for Secret Hash (Required if your Cognito App Client has a secret)
  private calculateSecretHash(username: string): string | undefined {
    if (!this.clientSecret) return undefined;
    return crypto.createHmac('SHA256', this.clientSecret)
      .update(username + this.clientId).digest('base64');
  }

  async signUp(username: string, password: string, email: string) {
    const command = new SignUpCommand({
      ClientId: this.clientId,
      Username: email,
      Password: password,
      SecretHash: this.calculateSecretHash(username),
      UserAttributes: [{ Name: "email", Value: email }, { Name: "name", Value: username }],
    });
    return await this.client.send(command);
  }
  
  async confirmSignUp(email: string, code: string) {
    const command = new ConfirmSignUpCommand({
      ClientId: this.clientId,
      Username: email,
      ConfirmationCode: code,
    });
    return await this.client.send(command);
  }

  async signIn(email: string, password: string) {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.calculateSecretHash(email),
      },
    });
    const response = await this.client.send(command);
    return response.AuthenticationResult; 
  }

  async signOut(accessToken: string) {
    return await this.client.send(new GlobalSignOutCommand({ AccessToken: accessToken }));
  }
}


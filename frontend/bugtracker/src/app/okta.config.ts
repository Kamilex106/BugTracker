import { OktaAuthOptions } from '@okta/okta-auth-js';

export const oktaConfig: OktaAuthOptions = {
  issuer: 'https://dev-41258588.okta.com/oauth2/default',
  clientId: '0oaoaz7hxlOIoYnmk5d7',
  redirectUri: `${window.location.origin}/login/callback`,
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  tokenManager: {
    storage: 'sessionStorage' // lub 'localStorage' dla dłuższych sesji
  }
};

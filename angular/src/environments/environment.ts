 import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

const oAuthConfig = {
  issuer: 'https://localhost:44377/',
  redirectUri: baseUrl,
  clientId: 'TeduEcommerce_App',
  responseType: 'code',
  scope: 'offline_access TeduEcommerce',
  requireHttps: true,
};

export const environment = {
  production: false,
  application: {
    baseUrl,
    name: 'TeduEcommerce',
  },
  oAuthConfig,
  apis: {
    default: {
      url: 'https://localhost:44377',
      rootNamespace: 'TeduEcommerce',
    },
    AbpAccountPublic: {
      url: oAuthConfig.issuer,
      rootNamespace: 'AbpAccountPublic',
    },
  },
} as Environment;

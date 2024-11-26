const KEYCLOAK_URL = 'https://sso-gint-core-keycloak.apps.giss.int.portal.ss';
const REDIRECT_URL = 'https://onbo-ms-frontendcm.sm.giss.int.portal.ss/';
const REALM = 'pgisrealm';

export const environment = {
  production: false,
  urlBack: `https://onbo-ms-commandercm.sm.giss.int.portal.ss`,
  urlBackSeg: ``,
  urlBackSegErr: ``,
  basePath: '/',

  defaultTranslate:'es',

  mock_server: false,
  API_URL: `https://sso-gint-core-keycloak.apps.giss.int.portal.ss`,
  API_URL_SEG: ``,
  API_URL_SEG_ERR: ``,

  auth_config: {
    skipIssuerCheck: true,
    issuer: `${KEYCLOAK_URL}/auth/realms/${REALM}`,
    tokenEndpoint: `${KEYCLOAK_URL}/auth/realms/${REALM}/protocol/openid-connect/token`,
    // URLS redireccion tras login o logout
    redirectUri: `${REDIRECT_URL}`,
    postLogoutRedirectUri: `${REDIRECT_URL}`,
    // A solicitar a seguridad
    clientId: 'ot-onbo-app-client',
    responseType: 'code',
    showDebugInformation: true,
    customQueryParams: {
      nivel: '2',
      idioma: 'es',
      tipo_identificacion: '0',
    },

    kc_idp_hint_internet: 'pgis-internet',
    kc_idp_hint_intranet: 'pgis-intranet',
  },
};

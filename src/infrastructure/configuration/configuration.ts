export default () => ({
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  services: {
    products: {
      url: process.env.PRODUCTS_SERVICE_URL,
      timeout: parseInt(process.env.PRODUCTS_SERVICE_TIMEOUT, 10) || 5000,
    },
  },
  isDevelopment: process.env.NODE_ENV === 'development',
  isStaging: process.env.NODE_ENV === 'staging',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
});

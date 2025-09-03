import { createRequire } from 'module';
const require = createRequire(import.meta.url);
export const termsPath = require.resolve('./terms.mdx');
export const returnsPath = require.resolve('./returns.mdx');
export const deliveryPath = require.resolve('./delivery.mdx');
export const privacyPath = require.resolve('./privacy.mdx');

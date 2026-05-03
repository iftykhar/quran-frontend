import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['bn', 'en'],
  defaultLocale: 'bn',
  localeDetection: true,
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
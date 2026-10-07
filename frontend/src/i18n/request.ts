import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // Always use Hindi as the default locale
  const locale = "hi";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

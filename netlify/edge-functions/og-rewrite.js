export default async (request, context) => {
  const url = new URL(request.url);
  const host = url.hostname;
  const parts = host.split('.');

  // Only modify if there's a city subdomain
  if (parts.length < 3 || parts[0] === 'www') {
    return;
  }

  const city = parts[0].toLowerCase();
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const cityImgUrl = url.origin + '/immagini/' + city + '.png';
  const pageUrl = url.origin;

  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('text/html')) {
    return response;
  }

  let html = await response.text();

  // Replace OG meta tags
  html = html.replace(
    /(<meta property="og:title" content=")[^"]*(")/,
    '$1Referendum 2026 Assistant \u2013 Comune di ' + cityName + '$2'
  );
  html = html.replace(
    /(<meta property="og:image" content=")[^"]*(")/,
    '$1' + cityImgUrl + '$2'
  );
  html = html.replace(
    /(<meta property="og:url" content=")[^"]*(")/,
    '$1' + pageUrl + '$2'
  );

  // Replace favicon
  html = html.replace(
    /(<link rel="icon" href=")[^"]*(")/,
    '$1' + cityImgUrl + '$2'
  );

  // Replace apple-touch-icon
  html = html.replace(
    /(<link rel="apple-touch-icon"\s+href=")[^"]*(")/,
    '$1' + cityImgUrl + '$2'
  );

  // Replace page title
  html = html.replace(
    /(<title>)[^<]*(<\/title>)/,
    '$1Referendum 2026 Assistant \u2013 Comune di ' + cityName + '$2'
  );

  return new Response(html, {
    status: response.status,
    headers: response.headers
  });
};

export const config = {
  path: "/*"
};

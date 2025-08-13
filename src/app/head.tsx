export default function Head() {
  const baseUrl = "https://iq-test-v2.vercel.app";
  const ogImage = `${baseUrl}/og`;
  const homeUrl = `${baseUrl}/`;
  const title = "IQ Test";
  const description = "Test your IQ";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={homeUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Farcaster Frame vNext minimal link action */}
      <meta name="fc:frame" content="vNext" />
      <meta name="fc:frame:image" content={ogImage} />
      <meta name="fc:frame:button:1" content="Start IQ Test" />
      <meta name="fc:frame:button:1:action" content="link" />
      <meta name="fc:frame:button:1:target" content={homeUrl} />
    </>
  );
}



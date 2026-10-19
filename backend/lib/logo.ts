/**
 * Derives a logo URL from a website, so investors and companies don't need
 * hand-pasted image links (which break or bloat the DB as base64).
 *
 * Uses Google's favicon service, which returns the site's own icon at up to 128px.
 */
export function logoUrlFromWebsite(websiteUrl?: string | null): string | null {
  if (!websiteUrl) return null;

  try {
    const url = new URL(
      websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`,
    );
    const domain = url.hostname.replace(/^www\./, "");

    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return null;
  }
}

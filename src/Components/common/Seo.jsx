import Head from "next/head";

const DOMAIN = "https://parfumgallery.uz";
const DEFAULT_OG_IMAGE = "/favicon.ico";

export default function Seo({
  title = "The Agency — маркетинговое агентство",
  description = "The Agency — маркетинговое агентство",
  siteName = "The Agency",
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  thumbnailUrl = DEFAULT_OG_IMAGE,
  brand = "",
  price = "",
  id = "",
}) {
  const titleFinal = title ? `${title} – ${siteName}` : siteName;
  return (
    <Head>
      <title key="title">{titleFinal}</title>
      <meta name="ROBOTS" content="INDEX, FOLLOW" />
      <meta name="description" content={description} />
      <meta name="keywords" content="The Agency" />
      <meta key="og_type" property="og:type" content={ogType} />
      <meta key="og_title" property="og:title" content={titleFinal} />
      <meta key="og_description" property="og:description" content={description} />
      <meta key="og_site_name" property="og:site_name" content={siteName} />
      <meta key="og_site_name" property="og:site_name" content={siteName} />
      <meta key="og_image" property="og:image" content={ogImage ?? DEFAULT_OG_IMAGE} />
      <meta key="og_image:alt" property="og:image:alt" content={titleFinal} />
      <link itemprop="thumbnailUrl" href={thumbnailUrl ?? DEFAULT_OG_IMAGE} />

      <meta property="product:brand" content={brand} />
      <meta property="product:availability" content="in stock" />
      <meta property="product:condition" content="new" />
      <meta property="product:price:amount" content={price} />
      <meta property="product:retailer_item_id" content={id} />
      <meta property="product:price:currency" content="UZS" />
    </Head>
  );
}

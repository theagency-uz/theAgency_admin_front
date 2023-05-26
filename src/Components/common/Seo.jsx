import Head from "next/head";

const DOMAIN = "https://parfumgallery.uz";
const DEFAULT_OG_IMAGE = "/favicon.ico";

export default function Seo({
  title = "Parfum gallery — оригинал парфюм и косметика от официального дистрибьютора.",
  description = "Parfum gallery — эксклюзивная сеть официальных магазинов парфюмерии и косметики от мировых брендов в Узбекистане. 100% гарантия оригинала. Широкий ассортимент. 8 магазинов в Ташкенте.",
  siteName = "Parfum gallery",
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
      <meta
        name="keywords"
        content="Parfum gallery, парфюм в Ташкенте, парфюм галлери, парфюм в ташкенте цены, оригинальные духи в ташкенте, парфюмерия ташкент, купить духи в ташкенте"
      />
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

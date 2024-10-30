import Head from "next/head";
import { metadata } from "@/app/layout";
interface SEOProps {
  title: string;
  description: string;
  favicon: string;
  coverImage?: string;
}

export default function SEO({
  title,
  description,
  favicon,
  coverImage,
}: Readonly<SEOProps>) {
  return (
    <Head>
      <title>
        {title ? `${title}` : `${metadata.title}`}
      </title>
      <meta name="description" content={description ?? metadata.description} />
      <link
        rel="icon"
        href={coverImage ?? favicon}
        // type="image/png"
      />
      {/* Open Graph (social sharing) image */}
      {/* <meta
        property="og:image"
        content={coverImage ?? metadata.icons?.icon}
      /> */}

      {/* Additional meta tags for SEO */}
      <meta property="og:title" content={title ?? metadata.title} />
      <meta
        property="og:description"
        content={description ?? metadata.description}
      />
      <meta property="og:type" content="article" />
    </Head>
  );
}

import { Metadata } from 'next'
import { siteConfig } from './config'

interface PageMetadataProps {
  title: string
  description: string
  path?: string
  keywords?: string[]
  image?: string
}

export function generateMetadata({
  title,
  description,
  path = '',
  keywords = [],
  image,
}: PageMetadataProps): Metadata {
  const url = `${siteConfig.url}${path}`
  const ogImage = image ? `${siteConfig.url}${image}` : `${siteConfig.url}/images/homelab.webp`

  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${siteConfig.author} Home lab`,
      description,
      url,
      siteName: siteConfig.name,
      type: 'article',
      locale: 'en_US',
      images: [
        {
          url: ogImage,
          width: siteConfig.ogImage.width,
          height: siteConfig.ogImage.height,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.author} Home lab`,
      description,
      creator: siteConfig.twitter.handle,
      images: [ogImage],
    },
  }
}

export function generateArticleStructuredData(
  title: string,
  description: string,
  additionalProps?: Record<string, any>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
    },
    datePublished: new Date().toISOString(),
    publisher: {
      '@type': 'Person',
      name: siteConfig.author,
    },
    ...additionalProps,
  }
}

export function generateHowToStructuredData(
  name: string,
  description: string,
  steps: Array<{ name: string; text: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

import { Metadata } from 'next'

interface PageMetadataProps {
  title: string
  description: string
  path?: string
  keywords?: string[]
}

export function generateMetadata({
  title,
  description,
  path = '',
  keywords = [],
}: PageMetadataProps): Metadata {
  const baseUrl = 'https://homelab.eurusik.com'
  const url = `${baseUrl}${path}`

  const defaultKeywords = [
    'kubernetes',
    'k3s',
    'raspberry pi',
    'homelab',
    'cluster',
    'docker',
    'devops',
    'self-hosted',
  ]

  return {
    title,
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | Eugene Rusakov Home lab`,
      description,
      url,
      siteName: 'K3s Homelab',
      type: 'article',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Eugene Rusakov Home lab`,
      description,
      creator: '@eurusik',
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
      name: 'Eugene Rusakov',
    },
    datePublished: new Date().toISOString(),
    publisher: {
      '@type': 'Person',
      name: 'Eugene Rusakov',
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

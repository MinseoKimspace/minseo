import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
  projectId: 'ktbpa3qs',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-01-01',
})

const builder = createImageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)
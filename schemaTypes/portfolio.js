// schemaTypes/portfolio.js
export default {
  name: 'portfolio',
  title: 'Portfolio Item',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [ { title: 'Project', value: 'project' }, { title: 'Paper', value: 'paper' } ],
        layout: 'radio'
      }
    },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'mainImage', title: 'Main Image', type: 'image', options: { hotspot: true } },
    { name: 'file', title: 'PDF File', type: 'file' },
    { name: 'link', title: 'External Link', type: 'url' }
  ]
}
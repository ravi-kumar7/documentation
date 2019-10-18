module.exports = {
  title: 'FinBox Documentation',
  description: 'Documentation for FinBox SDK',
  base: '/documentation/',
  themeConfig: {
    smoothScroll: true,
    lastUpdated: 'Last Updated',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Device Connect', link: '/device-connect/' },
      { text: 'Bank Connect', link: '/bank-connect/' },
      { text: 'About', link: 'https://finbox.in' },
    ],
    sidebar: {
      '/bank-connect/': [
        {
          title: 'Overview',
          collapsable: false,
          children: [
            {
              title: 'Introduction',
              path: '/bank-connect/'
            },
            {
              title: 'Basics',
              path: '/bank-connect/basics.html'
            }
          ]
        },
        {
          title: 'API Reference',
          collapsable: false,
          children: [
            {
              title: 'REST API',
              path: '/bank-connect/rest-api.html'
            },
            {
              title: 'Python',
              path: '/bank-connect/python.html'
            },
            {
              title: 'Android Client',
              path: '/bank-connect/android-client.html'
            },
            {
              title: 'JavaScript Client',
              path: '/bank-connect/javascript-client.html'
            },
          ]
        },
        {
          title: 'Appendix',
          path: '/bank-connect/appendix.html',
          collapsable: false
        }
      ]
    }
  }
}
module.exports = {
  title: 'FinBox Documentation',
  description: 'Documentation for FinBox SDK',
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
      '/device-connect/': [
        {
          title: 'Overview',
          collapsable: false,
          children: [
            {
              title: 'Introduction',
              path: '/device-connect/'
            }
          ]
        },
        {
          title: 'Sharing Data',
          collapsable: false,
          children: [
            {
              title: 'Android SDK',
              path: '/device-connect/android.html'
            },
            {
              title: 'React Native',
              path: '/device-connect/react-native.html'
            }
          ]
        },
        {
          title: 'Fetching Predictors',
          collapsable: false,
          children: [
            {
              title: 'REST API',
              path: '/device-connect/rest-api.html'
            }
          ]
        }
      ],
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
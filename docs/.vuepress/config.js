module.exports = {
  title: 'FinBox Documentation',
  description: 'Documentation for FinBox SDK',
  plugins: ['code-switcher', ['@vuepress/search', {
    test: ["^((?!device-connect\/transactions).)*$"]
  }]],
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
            },
            {
              title: 'Cordova',
              path: '/device-connect/cordova.html'
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
          title: 'Direct PDF Mode & Fetching',
          collapsable: false,
          children: [
            {
              title: 'REST API',
              path: '/bank-connect/rest-api.html'
            },
            {
              title: 'Python Package',
              path: '/bank-connect/python.html'
            }
          ]
        },
        {
          title: 'Net Banking Mode',
          collapsable: false,
          children: [
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
      ],
      '/middleware/': [
        {
          title: 'Overview',
          collapsable: false,
          children: [
            {
              title: 'Introduction',
              path: '/middleware/'
            }
          ]
        },
        {
          title: 'Sourcing Entity',
          collapsable: false,
          children: [
            {
              title: 'REST API',
              path: '/middleware/sourcing-rest-api.html'
            },
            {
              title: 'Android SDK',
              path: '/middleware/android-sdk.html'
            }
          ]
        },
        {
          title: 'Lenders',
          collapsable: false,
          children: [
            {
              title: 'REST API',
              path: '/middleware/lender-rest-api.html'
            }
          ]
        },
        {
          title: 'Appendix',
          path: '/middleware/appendix.html',
          collapsable: false
        },
      ]
    }
  }
}
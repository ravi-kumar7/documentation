module.exports = {
  title: 'FinBox Documentation',
  description: 'Documentation for FinBox SDK',
  themeConfig: {
       smoothScroll: true,
       lastUpdated: 'Last Updated',
       nav: [
         { text: 'Home', link: '/' },
         { text: 'Bank Connect', link: '/bank-connect/' },
         { text: 'Device Connect', link: '/device-connect/' },
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
             title: 'REST API',
             path: '/rest',
             collapsable: false,
             sidebarDepth: 2,
             children: [
               '/'
             ]
           },
           {
             title: 'Python',
             path: '/bank-connect/python.html',
             collapsable: false,
             sidebarDepth: 2,
             children: [
               '/'
             ]
           },
         ]
       }
   }
}

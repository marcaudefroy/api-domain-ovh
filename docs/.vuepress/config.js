const { description } = require('../../package')

module.exports = ctx => ({
    base: '/api-domain-ovh/',
    locales: {
        '/': {
            lang: 'en-US',
            title: "Domain API",
        },
        '/fr/': {
            lang: 'fr-FR',
            title: "API domain",
        },
    },
    //theme: 'default-prefers-color-scheme',

    /**
     * Ref：https://v1.vuepress.vuejs.org/config/#title
     */
    title: 'OVHcloud Domain API documentation',
    /**
     * Ref：https://v1.vuepress.vuejs.org/config/#description
     */
    description: description,

    /**
     * Extra tags to be injected to the page HTML `<head>`
     *
     * ref：https://v1.vuepress.vuejs.org/config/#head
     */
    head: [
        ['meta', { name: 'theme-color', content: '#0057AE' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
    ],

    /**
     * Theme configuration, here is the default theme configuration for VuePress.
     *
     * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
     */
    themeConfig: {
        //  defaultTheme: 'dark',
        repo: '',
        editLinks: false,
        docsDir: '',
        editLinkText: '',
        lastUpdated: false,
        smoothScroll: true,
        nextLinks: true,
        prevLinks: true,
        displayAllHeaders: true,
        sidebarDepth: 1,
        locales: {
            '/': {
                lang: 'en-US',
                title: "Domain API",
                sidebar: [
                    '/',
                ]
            },
            '/fr/': {
                selectText: 'Languages',
                nav: [{
                    link: '',
                }],
                sidebar: [{
                        title: "Introduction",
                        path: '/fr/',
                    },
                    {
                        title: "Commander un nom de domaine",
                        path: '/fr/order',
                    },
                    {
                        title: "Règles sur un domain",
                        path: '/fr/rules',
                    },
                    {
                        title: "Gestion d'un domain",
                        collapsable: false,
                        path: '/fr/domain',
                    },
                    {
                        title: "Gestion des contacts",
                        collapsable: false,
                        path: '/fr/contacts',
                    },
                    {
                        title: "Whois",
                        collapsable: false,
                        path: '/fr/whois',
                    },
                    {
                        title: "Gestion des opérations",
                        collapsable: false,
                        path: '/fr/operations',
                    },
                    {
                        title: "Changelog",
                        collapsable: false,
                        path: '/fr/changelog',
                    },
                ]
            }
        },
    },

    /**
     * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
     */
    plugins: [
        'vuepress-plugin-element-tabs',
    ]
})
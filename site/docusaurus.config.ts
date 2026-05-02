import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Configuración para mauriciomejiae.github.io
const config: Config = {
  title: 'Mauricio Labs',
  tagline: 'Documentación técnica de infraestructura Linux, Proxmox, Oracle y Backup',
  favicon: 'img/favicon.ico',

  url: 'https://mauriciomejiae.github.io',
  baseUrl: '/',

  organizationName: 'mauriciomejiae',
  projectName: 'mauriciomejiae.github.io',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          editUrl: undefined,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    image: 'img/og-banner.png',
    metadata: [
      {name: 'description', content: 'Mauricio Labs — Documentación técnica especializada en infraestructura crítica, automatización y soluciones de backup corporativo.'},
      {name: 'keywords', content: 'RHEL, Proxmox, Oracle Database, Data Protector, Linux Hardening, iSCSI, LVM, RMAN'},
      {name: 'twitter:card', content: 'summary_large_image'},
    ],
    navbar: {
      title: 'Mauricio Labs',
      logo: {
        alt: 'Mauricio Labs Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'manualsSidebar',
          position: 'left',
          label: 'Documentación',
        },
        {
          label: 'Proxmox',
          to: '/docs/proxmox/post-install-proxmox9',
          position: 'left',
        },
        {
          label: 'Linux',
          to: '/docs/linux/disclaimer-login-linux',
          position: 'left',
        },
        {
          label: 'Oracle',
          to: '/docs/oracle/instalacion-oracle19c',
          position: 'left',
        },
        {
          label: 'Backup',
          to: '/docs/backup/data-protector-244-rhel85',
          position: 'left',
        },
        {
          href: 'https://github.com/mauriciomejiae/mauriciomejiae.github.io',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Manuales',
          items: [
            {label: 'Proxmox VE', to: '/docs/proxmox/post-install-proxmox9'},
            {label: 'Red Hat Enterprise Linux', to: '/docs/linux/disclaimer-login-linux'},
            {label: 'Oracle Database', to: '/docs/oracle/instalacion-oracle19c'},
            {label: 'Data Protector', to: '/docs/backup/data-protector-244-rhel85'},
          ],
        },
        {
          title: 'Comunidad',
          items: [
            {label: 'GitHub', href: 'https://github.com/mauriciomejiae'},
            {label: 'LinkedIn', href: 'https://linkedin.com/in/mauriciomejiae'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Mauricio Labs. Diseñado para la excelencia técnica.`,
    },
    prism: {
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['bash', 'powershell', 'sql', 'ini', 'properties', 'yaml', 'json'],
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

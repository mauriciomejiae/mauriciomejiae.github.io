import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Configuración para mauriciomejiae.github.io
const config: Config = {
  title: 'Mauricio Labs',
  tagline: 'Documentación técnica de infraestructura Linux, Proxmox, Oracle y Backup',
  favicon: 'img/logo.svg',

  url: 'https://mauriciomejiae.github.io',
  baseUrl: '/',

  organizationName: 'mauriciomejiae',
  projectName: 'mauriciomejiae.github.io',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

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
          label: 'Manuales',
        },
        {
          href: 'https://linkedin.com/in/mauriciomejiae',
          position: 'right',
          label: 'LinkedIn',
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
      links: [],
      copyright: `© ${new Date().getFullYear()} Mauricio Labs.`,
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

import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Configuración para mauriciomejiae.github.io
const config: Config = {
  title: 'Manuales Técnicos',
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
      {name: 'description', content: 'Manuales técnicos de infraestructura: Linux, Proxmox, Oracle Database y soluciones de Backup.'},
      {name: 'keywords', content: 'manuales técnicos, RHEL, Proxmox, Oracle, Data Protector, Linux, DevOps'},
    ],
    navbar: {
      title: 'Manuales Técnicos',
      logo: {
        alt: 'Logo Manuales Técnicos',
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
          to: '/docs/category/proxmox',
          position: 'left',
        },
        {
          label: 'Linux',
          to: '/docs/category/linux',
          position: 'left',
        },
        {
          label: 'Oracle',
          to: '/docs/category/oracle',
          position: 'left',
        },
        {
          label: 'Backup',
          to: '/docs/category/backup',
          position: 'left',
        },
        {
          href: 'https://github.com/mauriciomejiae/mauriciomejiae.github.io',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Categorías',
          items: [
            {label: 'Proxmox', to: '/docs/category/proxmox'},
            {label: 'Linux', to: '/docs/category/linux'},
            {label: 'Oracle', to: '/docs/category/oracle'},
            {label: 'Backup', to: '/docs/category/backup'},
          ],
        },
        {
          title: 'Recursos',
          items: [
            {label: 'Red Hat RHEL', href: 'https://access.redhat.com/documentation'},
            {label: 'Proxmox VE', href: 'https://pve.proxmox.com/wiki/Main_Page'},
            {label: 'Oracle Docs', href: 'https://docs.oracle.com/en/database/oracle/oracle-database/'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Manuales Técnicos. Construido con Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'powershell', 'sql', 'ini', 'properties'],
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

import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '34e'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '0ec'),
        routes: [
          {
            path: '/docs/tags',
            component: ComponentCreator('/docs/tags', 'fce'),
            exact: true
          },
          {
            path: '/docs/tags/apt',
            component: ComponentCreator('/docs/tags/apt', '6d4'),
            exact: true
          },
          {
            path: '/docs/tags/backup',
            component: ComponentCreator('/docs/tags/backup', '609'),
            exact: true
          },
          {
            path: '/docs/tags/banner',
            component: ComponentCreator('/docs/tags/banner', '549'),
            exact: true
          },
          {
            path: '/docs/tags/base-de-datos',
            component: ComponentCreator('/docs/tags/base-de-datos', 'ca3'),
            exact: true
          },
          {
            path: '/docs/tags/cell-manager',
            component: ComponentCreator('/docs/tags/cell-manager', 'aac'),
            exact: true
          },
          {
            path: '/docs/tags/data-protector',
            component: ComponentCreator('/docs/tags/data-protector', '014'),
            exact: true
          },
          {
            path: '/docs/tags/dbca',
            component: ComponentCreator('/docs/tags/dbca', 'e14'),
            exact: true
          },
          {
            path: '/docs/tags/debian',
            component: ComponentCreator('/docs/tags/debian', 'dd4'),
            exact: true
          },
          {
            path: '/docs/tags/disco',
            component: ComponentCreator('/docs/tags/disco', 'eb4'),
            exact: true
          },
          {
            path: '/docs/tags/iscsi',
            component: ComponentCreator('/docs/tags/iscsi', '5c4'),
            exact: true
          },
          {
            path: '/docs/tags/linux',
            component: ComponentCreator('/docs/tags/linux', '845'),
            exact: true
          },
          {
            path: '/docs/tags/lvm',
            component: ComponentCreator('/docs/tags/lvm', 'f01'),
            exact: true
          },
          {
            path: '/docs/tags/opentext',
            component: ComponentCreator('/docs/tags/opentext', '330'),
            exact: true
          },
          {
            path: '/docs/tags/oracle',
            component: ComponentCreator('/docs/tags/oracle', 'e72'),
            exact: true
          },
          {
            path: '/docs/tags/oracle-linux',
            component: ComponentCreator('/docs/tags/oracle-linux', '688'),
            exact: true
          },
          {
            path: '/docs/tags/pitr',
            component: ComponentCreator('/docs/tags/pitr', 'c72'),
            exact: true
          },
          {
            path: '/docs/tags/proxmox',
            component: ComponentCreator('/docs/tags/proxmox', '97a'),
            exact: true
          },
          {
            path: '/docs/tags/quadstor',
            component: ComponentCreator('/docs/tags/quadstor', '3e0'),
            exact: true
          },
          {
            path: '/docs/tags/restore',
            component: ComponentCreator('/docs/tags/restore', '1d7'),
            exact: true
          },
          {
            path: '/docs/tags/rhel',
            component: ComponentCreator('/docs/tags/rhel', '2aa'),
            exact: true
          },
          {
            path: '/docs/tags/rman',
            component: ComponentCreator('/docs/tags/rman', 'ce1'),
            exact: true
          },
          {
            path: '/docs/tags/seguridad',
            component: ComponentCreator('/docs/tags/seguridad', '8b8'),
            exact: true
          },
          {
            path: '/docs/tags/ssh',
            component: ComponentCreator('/docs/tags/ssh', 'a78'),
            exact: true
          },
          {
            path: '/docs/tags/standalone',
            component: ComponentCreator('/docs/tags/standalone', '8d8'),
            exact: true
          },
          {
            path: '/docs/tags/vtl',
            component: ComponentCreator('/docs/tags/vtl', 'f7c'),
            exact: true
          },
          {
            path: '/docs',
            component: ComponentCreator('/docs', '13e'),
            routes: [
              {
                path: '/docs/backup/data-protector-244-rhel85',
                component: ComponentCreator('/docs/backup/data-protector-244-rhel85', 'b76'),
                exact: true,
                sidebar: "manualsSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', 'f32'),
                exact: true,
                sidebar: "manualsSidebar"
              },
              {
                path: '/docs/linux/disclaimer-login-linux',
                component: ComponentCreator('/docs/linux/disclaimer-login-linux', 'd8a'),
                exact: true,
                sidebar: "manualsSidebar"
              },
              {
                path: '/docs/linux/quadstor-vtl-rhel9',
                component: ComponentCreator('/docs/linux/quadstor-vtl-rhel9', '6a8'),
                exact: true,
                sidebar: "manualsSidebar"
              },
              {
                path: '/docs/oracle/instalacion-oracle19c',
                component: ComponentCreator('/docs/oracle/instalacion-oracle19c', 'ea5'),
                exact: true,
                sidebar: "manualsSidebar"
              },
              {
                path: '/docs/oracle/restore-oracle19c',
                component: ComponentCreator('/docs/oracle/restore-oracle19c', '045'),
                exact: true,
                sidebar: "manualsSidebar"
              },
              {
                path: '/docs/proxmox/ampliar-disco-rhel-lvm',
                component: ComponentCreator('/docs/proxmox/ampliar-disco-rhel-lvm', 'ea4'),
                exact: true,
                sidebar: "manualsSidebar"
              },
              {
                path: '/docs/proxmox/post-install-proxmox9',
                component: ComponentCreator('/docs/proxmox/post-install-proxmox9', '3b3'),
                exact: true,
                sidebar: "manualsSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];

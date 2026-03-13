import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  manualsSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '🏠 Inicio',
    },
    {
      type: 'category',
      label: 'Proxmox',
      link: {type: 'generated-index'},
      collapsible: true,
      collapsed: false,
      items: [
        'proxmox/post-install-proxmox9',
        'proxmox/ampliar-disco-rhel-lvm',
      ],
    },
    {
      type: 'category',
      label: 'Linux',
      link: {type: 'generated-index'},
      collapsible: true,
      collapsed: false,
      items: [
        'linux/disclaimer-login-linux',
        'linux/quadstor-vtl-rhel9',
      ],
    },
    {
      type: 'category',
      label: 'Oracle',
      link: {type: 'generated-index'},
      collapsible: true,
      collapsed: false,
      items: [
        'oracle/instalacion-oracle19c',
        'oracle/restore-oracle19c',
      ],
    },
    {
      type: 'category',
      label: 'Backup',
      link: {type: 'generated-index'},
      collapsible: true,
      collapsed: false,
      items: [
        'backup/data-protector-244-rhel85',
      ],
    },
  ],
};

export default sidebars;

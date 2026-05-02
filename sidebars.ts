import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  manualsSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '🏠 Inicio',
    },
    {type: 'html', value: '<div style="height: 1px; background: #222; margin: 20px 0;"></div>', defaultStyle: true},
    'backup/data-protector-244-rhel85',
    'proxmox/post-install-proxmox9',
    'linux/configuracion-banner-linux',
    'oracle/instalacion-oracle19c',
    'linux/quadstor-vtl-rhel9',
    'oracle/restore-oracle19c',
    'proxmox/ampliar-disco-rhel-lvm',
  ],
};

export default sidebars;

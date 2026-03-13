import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';


function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-badge">📚 7 Manuales disponibles</div>
        <h1 className="hero-title">
          Manuales<br />
          <span>Técnicos</span>
        </h1>
        <p className="hero-subtitle">
          Documentación técnica de infraestructura Linux, Proxmox, Oracle y Backup.
          Guías paso a paso para instalación, configuración y operación.
        </p>
        <div className="hero-actions">
          <Link className="btn-primary" to="/docs/intro">
            📖 Ver documentación
          </Link>
          <Link className="btn-secondary" to="/docs/proxmox/post-install-proxmox9">
            Explorar manuales →
          </Link>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <div className="container">
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-number">7</div>
          <div className="stat-label">Manuales</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">4</div>
          <div className="stat-label">Categorías</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">2026</div>
          <div className="stat-label">Actualizado</div>
        </div>
      </div>
    </div>
  );
}

function CategoryCards() {
  const categories = [
    {
      id: 'proxmox',
      icon: '🟠',
      title: 'Proxmox',
      desc: 'Virtualización con Proxmox VE 9. Instalación, post-install, gestión de discos y repositorios sin suscripción.',
      count: 2,
      link: '/docs/proxmox/post-install-proxmox9',
    },
    {
      id: 'linux',
      icon: '🔴',
      title: 'Linux',
      desc: 'Configuración y hardening de RHEL 8/9. Banner de login, VTL con QUADStor, conexión iSCSI.',
      count: 2,
      link: '/docs/linux/disclaimer-login-linux',
    },
    {
      id: 'oracle',
      icon: '🔴',
      title: 'Oracle',
      desc: 'Instalación y recuperación de Oracle Database 19c. DBCA, RMAN, ARCHIVELOG y Point In Time Recovery.',
      count: 2,
      link: '/docs/oracle/instalacion-oracle19c',
    },
    {
      id: 'backup',
      icon: '🟢',
      title: 'Backup',
      desc: 'OpenText Data Protector 24.4. Instalación del Cell Manager, configuración de firewall y agentes.',
      count: 1,
      link: '/docs/backup/data-protector-244-rhel85',
    },
  ];

  return (
    <section className="categories-section">
      <h2 className="section-title">Categorías</h2>
      <p className="section-subtitle">Selecciona una categoría para explorar los manuales disponibles</p>
      <div className="cards-grid">
        {categories.map((cat) => (
          <Link key={cat.id} className={`cat-card cat-card-${cat.id}`} to={cat.link}>
            <span className="cat-icon">{cat.icon}</span>
            <div className="cat-title">{cat.title}</div>
            <div className="cat-desc">{cat.desc}</div>
            <span className="cat-count">📄 {cat.count} manual{cat.count !== 1 ? 'es' : ''}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function RecentDocs() {
  const docs = [
    { tag: 'proxmox', label: 'Proxmox', title: 'Post-Install Proxmox 9 – Standalone', link: '/docs/proxmox/post-install-proxmox9' },
    { tag: 'proxmox', label: 'Proxmox', title: 'Ampliar disco en RHEL 8.5 con LVM', link: '/docs/proxmox/ampliar-disco-rhel-lvm' },
    { tag: 'linux',   label: 'Linux',   title: 'Disclaimer / Banner de Login Linux', link: '/docs/linux/disclaimer-login-linux' },
    { tag: 'linux',   label: 'Linux',   title: 'Instalación QUADStor VTL en RHEL 9.0', link: '/docs/linux/quadstor-vtl-rhel9' },
    { tag: 'oracle',  label: 'Oracle',  title: 'Instalación Oracle 19c en Oracle Linux 7', link: '/docs/oracle/instalacion-oracle19c' },
    { tag: 'oracle',  label: 'Oracle',  title: 'Restore Oracle 19c con Data Protector', link: '/docs/oracle/restore-oracle19c' },
    { tag: 'backup',  label: 'Backup',  title: 'Instalación Cell Manager Data Protector 24.4', link: '/docs/backup/data-protector-244-rhel85' },
  ];

  return (
    <section className="recent-section">
      <h2 className="section-title">Todos los manuales</h2>
      <p className="section-subtitle">Accede directamente a cualquier documento</p>
      <div className="docs-list">
        {docs.map((doc, i) => (
          <Link key={i} className="doc-item" to={doc.link}>
            <span className={`doc-item-tag tag-${doc.tag}`}>{doc.label}</span>
            <span className="doc-item-title">{doc.title}</span>
            <span className="doc-item-arrow">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Home(): React.JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}>
      <main>
        <HeroSection />
        <StatsBar />
        <CategoryCards />
        <RecentDocs />
      </main>
    </Layout>
  );
}

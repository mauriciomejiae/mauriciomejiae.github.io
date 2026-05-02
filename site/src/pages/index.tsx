import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Home(): React.JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Technical Documentation Portal">
      
      <main>
        {/* Antigravity Hero */}
        <section className="hero-section">
          <div className="container text--center">
            <h1 className="hero-title">
              Mauricio<span>Labs</span>
            </h1>
            <p className="hero-subtitle">
              Sistemas de misión crítica, infraestructura de respaldo y 
              automatización empresarial de alto rendimiento.
            </p>
            <div className="hero-actions">
              <Link
                className="btn-primary"
                to="/docs/backup/data-protector-244-rhel85">
                Ver Manuales
              </Link>
              <Link
                className="btn-secondary"
                to="https://github.com/mauriciomejiae"
                style={{marginLeft: '1rem'}}>
                GitHub
              </Link>
            </div>
          </div>
        </section>

        {/* Document List (Pure Minimalist) */}
        <section className="recent-section">
          <div className="container">
            <h2 className="section-title">Manuales Técnicos</h2>
            
            <div className="doc-list">
              {[
                { tag: 'backup', label: 'BACKUP', title: 'Data Protector 24.4 en RHEL 8.5', link: '/docs/backup/data-protector-244-rhel85' },
                { tag: 'proxmox', label: 'PROXMOX', title: 'Post-Install Proxmox 9 – Standalone', link: '/docs/proxmox/post-install-proxmox9' },
                { tag: 'linux', label: 'LINUX', title: 'Disclaimer / Banner de Login Linux', link: '/docs/linux/disclaimer-login-linux' },
                { tag: 'oracle', label: 'ORACLE', title: 'Instalación Oracle 19c en OL7', link: '/docs/oracle/instalacion-oracle19c' },
                { tag: 'linux', label: 'LINUX', title: 'Instalación QUADStor VTL en RHEL 9', link: '/docs/linux/quadstor-vtl-rhel9' },
                { tag: 'oracle', label: 'ORACLE', title: 'Restore Oracle 19c con DP', link: '/docs/oracle/restore-oracle19c' },
                { tag: 'proxmox', label: 'PROXMOX', title: 'Ampliar disco RHEL con LVM', link: '/docs/proxmox/ampliar-disco-rhel-lvm' },
              ].map((doc, i) => (
                <Link key={i} to={doc.link} className="doc-item" style={{display: 'block', textDecoration: 'none'}}>
                  <div className="row align-items-center">
                    <div className="col col--8">
                      <h3 className="doc-item-title">{doc.title}</h3>
                    </div>
                    <div className="col col--4 text--right">
                      <span className={`badge tag-${doc.tag}`}>{doc.label}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

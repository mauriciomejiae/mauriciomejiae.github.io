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
        {/* Premium Hero Section */}
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
                className="button btn-primary"
                to="/docs/backup/data-protector-244-rhel85">
                Explorar Manuales
              </Link>
              <Link
                className="button btn-secondary"
                to="https://github.com/mauriciomejiae"
                style={{marginLeft: '16px'}}>
                GitHub Repo
              </Link>
            </div>
          </div>
        </section>

        {/* Simplified Document Explorer (No Categories) */}
        <section className="recent-section">
          <div className="container">
            <h2 style={{fontSize: '2rem', marginBottom: '2rem', fontWeight: 800}}>Repositorio de Manuales</h2>
            
            <div className="doc-list">
              {[
                { tag: 'backup', label: 'BACKUP', title: 'Data Protector 24.4 en RHEL 8.5', link: '/docs/backup/data-protector-244-rhel85' },
                { tag: 'proxmox', label: 'PROXMOX', title: 'Post-Install Proxmox 9 – Standalone', link: '/docs/proxmox/post-install-proxmox9' },
                { tag: 'linux', label: 'LINUX', title: 'Disclaimer / Banner de Login Linux', link: '/docs/linux/disclaimer-login-linux' },
                { tag: 'oracle', label: 'ORACLE', title: 'Instalación Oracle 19c en OL7', link: '/docs/oracle/instalacion-oracle19c' },
                { tag: 'linux', label: 'LINUX', title: 'Instalación QUADStor VTL en RHEL 9', link: '/docs/linux/quadstor-vtl-rhel9' },
              ].map((doc, i) => (
                <Link key={i} to={doc.link} className="doc-item" style={{display: 'block', textDecoration: 'none'}}>
                  <div className="row align-items-center">
                    <div className="col col--9">
                      <h3 style={{margin: 0, fontSize: '1.2rem'}}>{doc.title}</h3>
                    </div>
                    <div className="col col--3 text--right">
                      <span className={`badge badge--primary`}>{doc.label}</span>
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

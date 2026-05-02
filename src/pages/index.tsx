import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Home(): React.JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Portal de Manuales Técnicos — Mauricio Labs">
      
      <main>
        {/* Premium Hero Section with Spring Energy Palette */}
        <section className="hero-section">
          <div className="container text--center">
            <div className="hero-logo-container">
              <img 
                src="/img/logo.svg" 
                alt="Mauricio Labs Logo" 
                className="hero-logo-large"
              />
            </div>
            <div className="typing-wrapper">
              <h1 className="hero-typing-title">Mauricio Labs&nbsp;</h1>
            </div>
            <p className="hero-subtitle">
              Sistemas de misión crítica, infraestructura de respaldo y 
              automatización empresarial de alto rendimiento.
            </p>
            <div className="hero-actions">
              <Link
                className="button btn-primary"
                to="/docs/intro"
                style={{display: 'inline-flex', alignItems: 'center', gap: '8px'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                Explorar Manuales
              </Link>
              <Link
                className="button btn-secondary"
                to="https://github.com/mauriciomejiae"
                style={{marginLeft: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                GitHub Repo
              </Link>
            </div>
          </div>
        </section>

        {/* Simplified Document Explorer (Using Glassmorphism Cards) */}
        <section className="recent-section">
          <div className="container">
            <h2 style={{fontSize: '2rem', marginBottom: '2.5rem', fontWeight: 800}}>Repositorio de Manuales</h2>
            
            <div className="doc-list">
              {[
                { tag: 'backup', label: 'BACKUP', title: 'Data Protector 24.4 en RHEL 8.5', link: '/docs/backup/data-protector-244-rhel85' },
                { tag: 'proxmox', label: 'PROXMOX', title: 'Post-Install Proxmox 9 – Standalone', link: '/docs/proxmox/post-install-proxmox9' },
                { tag: 'linux', label: 'LINUX', title: 'Disclaimer / Banner de Login Linux', link: '/docs/linux/disclaimer-login-linux' },
                { tag: 'oracle', label: 'ORACLE', title: 'Instalación Oracle 19c en OL7', link: '/docs/oracle/instalacion-oracle19c' },
                { tag: 'linux', label: 'LINUX', title: 'Instalación QUADStor VTL en RHEL 9', link: '/docs/linux/quadstor-vtl-rhel9' },
              ].map((doc, i) => (
                <Link key={i} to={doc.link} className="doc-item" style={{display: 'block', textDecoration: 'none', marginBottom: '16px'}}>
                  <div className="row align-items-center" style={{padding: '10px 0'}}>
                    <div className="col col--9">
                      <h3 style={{margin: 0, fontSize: '1.25rem', fontWeight: 600}}>{doc.title}</h3>
                    </div>
                    <div className="col col--3 text--right">
                      <span className={`badge badge--primary`} style={{padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', letterSpacing: '0.05em'}}>
                        {doc.label}
                      </span>
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

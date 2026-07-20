<template>
  <div class="legal-wrapper">
    <!-- Hexagon pattern background -->
    <svg class="legal-hex-pattern" viewBox="0 0 1200 480" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <pattern id="hexPatternPriv" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <polygon points="60,0 120,30 120,90 60,120 0,90 0,30" fill="none" stroke="url(#volcanoGradientPriv)" stroke-width="0.8" opacity="0.15"/>
        </pattern>
        <linearGradient id="volcanoGradientPriv" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color: #c0392b; stop-opacity: 1" />
          <stop offset="100%" style="stop-color: #e74c3c; stop-opacity: 0.7" />
        </linearGradient>
      </defs>
      <rect width="1200" height="480" fill="url(#hexPatternPriv)"/>
    </svg>

    <!-- Header -->
    <header class="legal-hero">
      <div class="legal-eyebrow"><span class="dot"></span> Data &amp; Privacy</div>
      <h1 class="legal-title">Privacy <span class="accent">Policy</span></h1>
      <div class="legal-meta">
        <span class="legal-meta-item">Effective date: <strong>July 21, 2026</strong></span>
        <span class="legal-meta-item">Last updated: <strong>July 21, 2026</strong></span>
        <span class="legal-meta-item">Applies to: <strong>darkdune.app and related services</strong></span>
      </div>
      <p class="legal-intro">
        This Privacy Policy explains what personal data DarkDune collects, why we collect it, how we use and
        protect it, and the choices and rights you have over it. It applies whenever you visit our website,
        create an account, upload files, or use our AI Assistant and document editor.
      </p>
      <router-link to="/terms-of-service" class="legal-switch">
        <svg viewBox="0 0 24 24" fill="none"><path d="M9 12H15M9 16H15M9 8H15M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
        Looking for our Terms of Service instead?
      </router-link>
    </header>

    <!-- Body -->
    <div class="legal-body">
      <!-- Table of contents -->
      <nav class="legal-toc" aria-label="Table of contents">
        <div class="legal-toc-heading">On this page</div>
        <ul class="legal-toc-list">
          <li><a href="#introduction"><span class="num">01</span>Introduction</a></li>
          <li><a href="#data-we-collect"><span class="num">02</span>Information We Collect</a></li>
          <li><a href="#how-we-use"><span class="num">03</span>How We Use Your Data</a></li>
          <li><a href="#legal-basis"><span class="num">04</span>Legal Basis for Processing</a></li>
          <li><a href="#cookies"><span class="num">05</span>Cookies &amp; Tracking</a></li>
          <li><a href="#sharing"><span class="num">06</span>How We Share Data</a></li>
          <li><a href="#retention"><span class="num">07</span>Data Retention</a></li>
          <li><a href="#security"><span class="num">08</span>Data Security</a></li>
          <li><a href="#your-rights"><span class="num">09</span>Your Privacy Rights</a></li>
          <li><a href="#international"><span class="num">10</span>International Transfers</a></li>
          <li><a href="#children"><span class="num">11</span>Children's Privacy</a></li>
          <li><a href="#changes"><span class="num">12</span>Changes to This Policy</a></li>
          <li><a href="#contact"><span class="num">13</span>Contact Us</a></li>
        </ul>
      </nav>

      <!-- Content -->
      <div class="legal-content">

        <section id="introduction" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">01</span> Introduction</h2>
          <p>
            DarkDune ("we", "us", "our") respects your privacy and is committed to protecting the personal data
            you share with us. This Policy describes our data practices in plain language. It works alongside
            our <router-link to="/terms-of-service" class="inline-link">Terms of Service</router-link>, which
            govern your overall use of the Service.
          </p>
        </section>

        <section id="data-we-collect" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">02</span> Information We Collect</h2>
          <p>We collect information in three ways: what you give us directly, what we collect automatically, and what we receive from third parties.</p>
          <div class="legal-table-wrap">
            <table class="legal-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Examples</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Account data</td>
                  <td>Full name, username, email address, password (hashed)</td>
                  <td>You, at signup</td>
                </tr>
                <tr>
                  <td>Your Content</td>
                  <td>Files, documents, links, and folders you upload or create</td>
                  <td>You, while using the Service</td>
                </tr>
                <tr>
                  <td>AI Assistant interactions</td>
                  <td>Prompts you submit and the responses generated</td>
                  <td>You, while using the AI Assistant</td>
                </tr>
                <tr>
                  <td>Billing data</td>
                  <td>Plan tier, billing address, transaction history (card details are handled by our payment processor, not stored by us)</td>
                  <td>You / payment processor</td>
                </tr>
                <tr>
                  <td>Usage &amp; device data</td>
                  <td>IP address, browser type, pages viewed, timestamps, approximate location</td>
                  <td>Automatically collected</td>
                </tr>
                <tr>
                  <td>Cookies &amp; identifiers</td>
                  <td>Session cookies, analytics identifiers</td>
                  <td>Automatically collected</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="how-we-use" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">03</span> How We Use Your Data</h2>
          <ul class="legal-list">
            <li><strong>Provide the Service</strong> — create your account, store and render Your Content, and power features like linking and the document editor.</li>
            <li><strong>Operate the AI Assistant</strong> — process your prompts and related files to generate the output you request.</li>
            <li><strong>Process payments</strong> — manage subscriptions, invoices, and billing through our payment processor.</li>
            <li><strong>Communicate with you</strong> — send account notices, security alerts, and, if you opt in, product updates.</li>
            <li><strong>Maintain security</strong> — detect fraud, abuse, and unauthorized access to protect you and other users.</li>
            <li><strong>Improve DarkDune</strong> — understand usage patterns and troubleshoot issues using aggregated or de-identified data where possible.</li>
          </ul>
        </section>

        <section id="legal-basis" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">04</span> Legal Basis for Processing</h2>
          <p>If you are located in the European Economic Area, UK, or a similar jurisdiction, we rely on the following legal bases to process your data:</p>
          <ul class="legal-list">
            <li><strong>Contractual necessity</strong> — to provide the Service you signed up for.</li>
            <li><strong>Legitimate interests</strong> — to secure our systems, prevent fraud, and improve the Service.</li>
            <li><strong>Consent</strong> — for optional cookies and marketing communications, which you can withdraw at any time.</li>
            <li><strong>Legal obligation</strong> — where processing is required to comply with the law.</li>
          </ul>
        </section>

        <section id="cookies" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">05</span> Cookies &amp; Tracking Technologies</h2>
          <p>
            We use essential cookies to keep you signed in and remember your preferences, and, with your
            consent where required, analytics cookies to understand how DarkDune is used. You can control
            cookies through your browser settings; disabling essential cookies may affect core functionality.
          </p>
        </section>

        <section id="sharing" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">06</span> How We Share Data</h2>
          <p>We do not sell your personal data. We only share it in these limited circumstances:</p>
          <ul class="legal-list">
            <li><strong>Service providers</strong> — vetted vendors who host our infrastructure, process payments, or provide analytics, under contractual confidentiality obligations.</li>
            <li><strong>Legal reasons</strong> — if required to comply with a law, regulation, court order, or to protect the rights and safety of DarkDune or our users.</li>
            <li><strong>Business transfers</strong> — if DarkDune is involved in a merger, acquisition, or asset sale, your data may transfer as part of that transaction.</li>
            <li><strong>With your direction</strong> — when you explicitly choose to share or export Your Content, such as inviting a collaborator.</li>
          </ul>
        </section>

        <section id="retention" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">07</span> Data Retention</h2>
          <p>
            We retain your personal data and Your Content for as long as your account is active or as needed to
            provide the Service. After you delete your account, we delete or anonymize your data within a
            reasonable period, except where we must retain it longer to comply with legal, tax, or security
            obligations.
          </p>
        </section>

        <section id="security" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">08</span> Data Security</h2>
          <p>
            We use industry-standard safeguards — including encryption in transit, access controls, and regular
            security reviews — to protect your data. However, no method of transmission or storage is 100%
            secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section id="your-rights" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">09</span> Your Privacy Rights</h2>
          <p>Depending on where you live, you may have some or all of the following rights regarding your personal data:</p>
          <ul class="legal-list">
            <li><strong>Access</strong> — request a copy of the personal data we hold about you.</li>
            <li><strong>Correction</strong> — ask us to correct inaccurate or incomplete data.</li>
            <li><strong>Deletion</strong> — request that we delete your account and associated data.</li>
            <li><strong>Portability</strong> — request an export of your data in a machine-readable format.</li>
            <li><strong>Objection / restriction</strong> — object to or ask us to limit certain processing, such as marketing.</li>
            <li><strong>Withdraw consent</strong> — where processing is based on consent, withdraw it at any time.</li>
          </ul>
          <div class="legal-callout">
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <p>To exercise any of these rights, contact us at the email below. We may need to verify your identity before completing your request.</p>
          </div>
        </section>

        <section id="international" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">10</span> International Data Transfers</h2>
          <p>
            Your data may be processed in countries other than your own. When we transfer personal data across
            borders, we use appropriate safeguards, such as standard contractual clauses, to ensure it remains
            protected consistent with this Policy.
          </p>
        </section>

        <section id="children" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">11</span> Children's Privacy</h2>
          <p>
            DarkDune is not directed at children under 16, and we do not knowingly collect personal data from
            them. If you believe a child has provided us with personal data, please contact us so we can delete
            it.
          </p>
        </section>

        <section id="changes" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">12</span> Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If we make material changes, we will notify you
            by email or through an in-app notice before the changes take effect. The "Last updated" date at the
            top of this page reflects the most recent revision.
          </p>
        </section>

        <section id="contact" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">13</span> Contact Us</h2>
          <p>If you have questions about this Policy or how we handle your data, reach out any time.</p>
          <div class="legal-contact">
            <div class="legal-contact-text">
              <h4>Questions about your data?</h4>
              <p>Our privacy team typically responds within 2 business days.</p>
            </div>
            <a href="mailto:privacy@darkdune.app" class="legal-contact-email">
              privacy@darkdune.app
            </a>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicy'
}
</script>

<style scoped src="../assets/LegalPages.css"></style>

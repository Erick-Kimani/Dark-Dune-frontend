<template>
  <div class="legal-wrapper">
    <!-- Hexagon pattern background -->
    <svg class="legal-hex-pattern" viewBox="0 0 1200 480" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <pattern id="hexPatternTos" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <polygon points="60,0 120,30 120,90 60,120 0,90 0,30" fill="none" stroke="url(#volcanoGradientTos)" stroke-width="0.8" opacity="0.15"/>
        </pattern>
        <linearGradient id="volcanoGradientTos" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color: #c0392b; stop-opacity: 1" />
          <stop offset="100%" style="stop-color: #e74c3c; stop-opacity: 0.7" />
        </linearGradient>
      </defs>
      <rect width="1200" height="480" fill="url(#hexPatternTos)"/>
    </svg>

    <!-- Header -->
    <header class="legal-hero">
      <div class="legal-eyebrow"><span class="dot"></span> Legal Agreement</div>
      <h1 class="legal-title">Terms of <span class="accent">Service</span></h1>
      <div class="legal-meta">
        <span class="legal-meta-item">Effective date: <strong>July 21, 2026</strong></span>
        <span class="legal-meta-item">Last updated: <strong>July 21, 2026</strong></span>
        <span class="legal-meta-item">Applies to: <strong>DarkDune web app, dashboard &amp; AI Assistant</strong></span>
      </div>
      <p class="legal-intro">
        These Terms of Service ("Terms") govern your access to and use of DarkDune — our website, dashboard,
        file-linking tools, AI Assistant, and document editor (together, the "Service"). By creating an account
        or using the Service, you agree to be bound by these Terms. If you do not agree, please do not use DarkDune.
      </p>
      <router-link to="/privacy-policy" class="legal-switch">
        <svg viewBox="0 0 24 24" fill="none"><path d="M12 2L4 5V11C4 16 7 20 12 22C17 20 20 16 20 11V5L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
        Looking for our Privacy Policy instead?
      </router-link>
    </header>

    <!-- Body -->
    <div class="legal-body">
      <!-- Table of contents -->
      <nav class="legal-toc" aria-label="Table of contents">
        <div class="legal-toc-heading">On this page</div>
        <ul class="legal-toc-list">
          <li><a href="#acceptance"><span class="num">01</span>Acceptance of Terms</a></li>
          <li><a href="#description"><span class="num">02</span>Description of Service</a></li>
          <li><a href="#accounts"><span class="num">03</span>Accounts &amp; Eligibility</a></li>
          <li><a href="#billing"><span class="num">04</span>Subscriptions &amp; Billing</a></li>
          <li><a href="#acceptable-use"><span class="num">05</span>Acceptable Use</a></li>
          <li><a href="#content"><span class="num">06</span>Your Content &amp; IP</a></li>
          <li><a href="#ai-features"><span class="num">07</span>AI Assistant &amp; Generated Output</a></li>
          <li><a href="#third-party"><span class="num">08</span>Third-Party Services</a></li>
          <li><a href="#termination"><span class="num">09</span>Suspension &amp; Termination</a></li>
          <li><a href="#disclaimers"><span class="num">10</span>Disclaimers</a></li>
          <li><a href="#liability"><span class="num">11</span>Limitation of Liability</a></li>
          <li><a href="#indemnification"><span class="num">12</span>Indemnification</a></li>
          <li><a href="#governing-law"><span class="num">13</span>Governing Law</a></li>
          <li><a href="#changes"><span class="num">14</span>Changes to These Terms</a></li>
          <li><a href="#contact"><span class="num">15</span>Contact Us</a></li>
        </ul>
      </nav>

      <!-- Content -->
      <div class="legal-content">

        <section id="acceptance" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">01</span> Acceptance of Terms</h2>
          <p>
            By accessing or using DarkDune in any way — including browsing our website, registering for an
            account, uploading files, or interacting with the AI Assistant — you confirm that you have read,
            understood, and agree to be legally bound by these Terms and by our
            <router-link to="/privacy-policy" class="inline-link">Privacy Policy</router-link>, which is
            incorporated into these Terms by reference.
          </p>
          <p>
            If you are using DarkDune on behalf of an organization, you represent that you have the authority
            to bind that organization to these Terms, and "you" refers to both you and that organization.
          </p>
        </section>

        <section id="description" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">02</span> Description of Service</h2>
          <p>
            DarkDune is a file-intelligence platform that lets you connect, organize, and compile files, link
            documents by order, date, or category, edit documents in our built-in editor, and use an AI Assistant
            to help plan and generate content. Features, pricing tiers, and storage limits are described on our
            Planning page and may change from time to time as described in Section 14.
          </p>
          <div class="legal-callout">
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <p>We may add, modify, or discontinue individual features (including beta or experimental AI features) at any time, with or without notice, to the extent permitted by law.</p>
          </div>
        </section>

        <section id="accounts" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">03</span> Accounts &amp; Eligibility</h2>
          <p>You must be at least 16 years old, or the age of digital consent in your country, to create a DarkDune account. When you register, you agree to:</p>
          <ul class="legal-list">
            <li><strong>Provide accurate information</strong> — including a valid email address and username, and keep it up to date.</li>
            <li><strong>Protect your credentials</strong> — you are responsible for all activity that occurs under your account and password.</li>
            <li><strong>Notify us promptly</strong> of any unauthorized access or security breach involving your account.</li>
            <li><strong>Maintain one account per person</strong>, unless we approve additional accounts for organizational use.</li>
          </ul>
          <p>We reserve the right to refuse registration or close an account that violates these Terms.</p>
        </section>

        <section id="billing" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">04</span> Subscriptions &amp; Billing</h2>
          <p>
            Certain features of DarkDune are offered under paid subscription plans described on our Planning
            page. By subscribing, you authorize us (or our payment processor) to charge your chosen payment
            method on a recurring basis until you cancel.
          </p>
          <ul class="legal-list">
            <li><strong>Renewals</strong> — subscriptions renew automatically at the end of each billing cycle unless cancelled beforehand.</li>
            <li><strong>Price changes</strong> — we will give you advance notice before any price increase takes effect on your plan.</li>
            <li><strong>Refunds</strong> — fees are generally non-refundable except where required by law or expressly stated at the time of purchase.</li>
            <li><strong>Failed payments</strong> — we may downgrade or suspend paid features if a payment cannot be processed after reasonable attempts.</li>
            <li><strong>Taxes</strong> — prices do not include applicable taxes, which may be added at checkout based on your location.</li>
          </ul>
        </section>

        <section id="acceptable-use" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">05</span> Acceptable Use</h2>
          <p>You agree not to use DarkDune to:</p>
          <ul class="legal-list">
            <li>Upload or generate content that is unlawful, infringing, defamatory, obscene, or that violates another person's rights.</li>
            <li>Reverse-engineer, decompile, or attempt to extract the source code of the Service, except where permitted by law.</li>
            <li>Interfere with, overload, or attempt to gain unauthorized access to our systems, other accounts, or the AI Assistant's underlying models.</li>
            <li>Use automated tools (bots, scrapers) to access the Service outside of any API we officially provide.</li>
            <li>Upload malware, or files intended to disrupt, damage, or gain unauthorized access to any system.</li>
            <li>Use the Service to build a directly competing product without our written consent.</li>
          </ul>
          <p>We may investigate suspected violations and take action, including content removal, suspension, or termination, as described in Section 9.</p>
        </section>

        <section id="content" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">06</span> Your Content &amp; Intellectual Property</h2>
          <p>
            <strong>Your content stays yours.</strong> You retain all ownership rights to the files, documents,
            and materials you upload or create in DarkDune ("Your Content"). We do not claim ownership over it.
          </p>
          <p>
            By uploading Your Content, you grant DarkDune a limited, non-exclusive, worldwide license to host,
            store, reproduce, and display Your Content solely as necessary to operate, maintain, and improve the
            Service for you — for example, rendering files in the editor or indexing them so you can search and
            link them together.
          </p>
          <p>
            The DarkDune name, logo, interface design, and underlying software are our intellectual property (or
            licensed to us) and are protected by copyright, trademark, and other laws. You may not copy or reuse
            them without our permission.
          </p>
        </section>

        <section id="ai-features" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">07</span> AI Assistant &amp; Generated Output</h2>
          <p>
            DarkDune's AI Assistant helps you plan, summarize, and organize content based on the files and
            prompts you provide. AI-generated output may occasionally be inaccurate, incomplete, or unsuitable
            for your specific purpose.
          </p>
          <ul class="legal-list">
            <li><strong>Review before relying on it.</strong> Treat AI output as a starting point, not professional, legal, financial, or medical advice.</li>
            <li><strong>Ownership of output</strong> generated specifically for you belongs to you, subject to any rights of the underlying materials you provided.</li>
            <li><strong>No guarantee of uniqueness</strong> — similar prompts may produce similar output for other users.</li>
          </ul>
        </section>

        <section id="third-party" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">08</span> Third-Party Services</h2>
          <p>
            The Service may link to or integrate with third-party services (for example, payment processors or
            cloud storage providers). We are not responsible for the content, policies, or practices of any
            third party, and your use of those services is governed by their own terms.
          </p>
        </section>

        <section id="termination" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">09</span> Suspension &amp; Termination</h2>
          <p>
            You may stop using DarkDune and delete your account at any time from your account settings. We may
            suspend or terminate your access if you materially breach these Terms, misuse the Service, fail to
            pay applicable fees, or if required by law.
          </p>
          <p>
            Upon termination, your right to use the Service ends immediately. We will retain or delete Your
            Content following termination in accordance with our
            <router-link to="/privacy-policy" class="inline-link">Privacy Policy</router-link> and applicable
            law, unless a longer retention period is required for legal or security reasons.
          </p>
        </section>

        <section id="disclaimers" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">10</span> Disclaimers</h2>
          <p>
            The Service is provided <strong>"as is" and "as available"</strong> without warranties of any kind,
            whether express or implied, including implied warranties of merchantability, fitness for a
            particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted,
            error-free, or completely secure.
          </p>
        </section>

        <section id="liability" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">11</span> Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, DarkDune and its team will not be liable for any indirect,
            incidental, special, consequential, or punitive damages, or any loss of data, profits, or revenue,
            arising from your use of the Service. Our total liability for any claim relating to the Service will
            not exceed the amount you paid us in the twelve (12) months preceding the claim.
          </p>
          <div class="legal-callout legal-callout--danger">
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 003.54 21H20.46A2 2 0 0022.18 18L13.71 3.86A2 2 0 0010.29 3.86Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
            <p>Some jurisdictions do not allow the exclusion or limitation of certain damages, so parts of this section may not apply to you.</p>
          </div>
        </section>

        <section id="indemnification" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">12</span> Indemnification</h2>
          <p>
            You agree to defend and indemnify DarkDune against any claims, damages, or expenses (including
            reasonable legal fees) arising from your misuse of the Service, Your Content, or your violation of
            these Terms or applicable law.
          </p>
        </section>

        <section id="governing-law" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">13</span> Governing Law &amp; Dispute Resolution</h2>
          <p>
            These Terms are governed by the laws of the jurisdiction in which DarkDune is established, without
            regard to conflict-of-law principles. Before filing a formal claim, you agree to contact us first so
            we can attempt to resolve the dispute informally.
          </p>
        </section>

        <section id="changes" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">14</span> Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time to reflect changes to the Service or for legal reasons.
            If we make material changes, we will notify you by email or through an in-app notice before the
            changes take effect. Continued use of DarkDune after changes take effect constitutes acceptance of
            the revised Terms.
          </p>
        </section>

        <section id="contact" class="legal-section">
          <h2 class="legal-section-heading"><span class="idx">15</span> Contact Us</h2>
          <p>If you have questions about these Terms, please reach out — we're happy to help.</p>
          <div class="legal-contact">
            <div class="legal-contact-text">
              <h4>Questions about these Terms?</h4>
              <p>Our team typically responds within 2 business days.</p>
            </div>
            <a href="mailto:legal@darkdune.app" class="legal-contact-email">
              legal@darkdune.app
            </a>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TermsOfService'
}
</script>

<style scoped src="../assets/LegalPages.css"></style>

import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

export type LegalPageType = 'terms' | 'acceptable-use' | 'privacy';

interface LegalPageProps {
  page: LegalPageType;
  onBack: () => void;
}

const pageMeta: Record<LegalPageType, { title: string; updated: string }> = {
  'terms': { title: 'Terms of Use', updated: 'October 23, 2026' },
  'acceptable-use': { title: 'Acceptable Use Policy', updated: 'October 23, 2026' },
  'privacy': { title: 'Privacy Policy', updated: 'October 23, 2026' },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3
        className="mb-2 text-sm font-bold tracking-wide text-gold-accent"
        style={{ textShadow: '0 0 10px rgba(255, 184, 28, 0.25)' }}
      >
        {title}
      </h3>
      <div className="text-sm leading-relaxed text-cinema-200">{children}</div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="mb-1.5 flex gap-2 text-sm leading-relaxed text-cinema-200">
      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-accent/70" />
      <span>{children}</span>
    </li>
  );
}

function TermsContent() {
  return (
    <>
      <Section title="1. Acceptance of Terms">
        <p>
          By accessing or using Lost The Plot ("the Service"), you agree to be bound by these Terms of Use.
          If you do not agree, please discontinue use of the Service immediately.
        </p>
      </Section>
      <Section title="2. User-Generated Content">
        <p>You retain ownership of all script concepts, plot-hole dissections, and creative submissions you post.</p>
        <ul className="mt-2 space-y-0">
          <Bullet>You grant the Service a non-exclusive license to display your content within the community feeds.</Bullet>
          <Bullet>You are solely responsible for the originality and legality of your submissions.</Bullet>
          <Bullet>Plagiarism of copyrighted film scripts or another writer's work is strictly prohibited.</Bullet>
        </ul>
      </Section>
      <Section title="3. Prohibited Conduct">
        <ul className="space-y-0">
          <Bullet>Reverse engineering, scraping, or automated data extraction from the Service.</Bullet>
          <Bullet>Creating multiple accounts to manipulate votes or challenge leaderboards.</Bullet>
          <Bullet>Uploading malicious code or exploiting bugs to bypass character limits.</Bullet>
        </ul>
      </Section>
      <Section title="4. Service Availability">
        <p>
          The Service is provided "as is" without warranty of uninterrupted availability. We reserve the right
          to modify, suspend, or discontinue any feature at any time without prior notice.
        </p>
      </Section>
      <Section title="5. Limitation of Liability">
        <p>
          Lost The Plot shall not be liable for any indirect, incidental, or consequential damages arising from
          your use of the Service, including loss of profile data or challenge entries.
        </p>
      </Section>
      <Section title="6. Changes to These Terms">
        <p>
          We may update these Terms periodically. Continued use of the Service after changes are posted
          constitutes acceptance of the revised Terms.
        </p>
      </Section>
    </>
  );
}

function AcceptableUseContent() {
  return (
    <>
      <Section title="The Cinephile Code of Conduct">
        <p>
          Lost The Plot is a community built on creative passion, rigorous film analysis, and mutual respect
          among screenwriters and film fans. This Code of Conduct defines the standards every member is expected
          to uphold.
        </p>
      </Section>

      <Section title="Creative Freedom">
        <p>
          We celebrate bold, wild, and unconventional thinking. The best rewrites come from taking risks.
        </p>
        <ul className="mt-2 space-y-0">
          <Bullet>
            <span className="font-medium text-cinema-100">Wild alternative script concepts</span> are not just
            allowed — they're the point. Whether you're rewriting the ending of Interstellar or pitching a
            genre-swap for Casablanca, push boundaries.
          </Bullet>
          <Bullet>
            <span className="font-medium text-cinema-100">Rigorous plot-hole dissection</span> is the heart of the
            Feed. Identify broken logic, inconsistent character motivations, and narrative shortcuts — then fix
            them with a real rewrite, not just a complaint.
          </Bullet>
          <Bullet>
            <span className="font-medium text-cinema-100">The Sob Rating scale</span> exists to rate how badly a
            plot hole damages the film. Use it honestly: a 1 is a nitpick, a 5 is franchise-breaking. Don't
            weaponize ratings to tank another writer's submission.
          </Bullet>
        </ul>
      </Section>

      <Section title="Zero-Tolerance Malice">
        <p>
          There is no place in this community for cruelty. The following behaviors result in immediate content
          removal and potential account suspension:
        </p>
        <ul className="mt-2 space-y-0">
          <Bullet>
            <span className="font-medium text-cinema-100">Personal insults</span> directed at another writer's
            intelligence, skill level, or creative choices. Critique the script, not the screenwriter.
          </Bullet>
          <Bullet>
            <span className="font-medium text-cinema-100">Hate speech</span> of any kind — including but not
            limited to racism, sexism, homophobia, transphobia, ableism, or religious discrimination.
          </Bullet>
          <Bullet>
            <span className="font-medium text-cinema-100">Harassment of other screenwriters</span>, including
            targeted downvoting campaigns, persistent unwanted comments, or following a user across multiple
            submissions to intimidate or discourage them.
          </Bullet>
          <Bullet>
            <span className="font-medium text-cinema-100">Malicious spamming</span> — flooding the Feed or Pitch
            Board with repeated, low-effort, or off-topic submissions designed to bury other writers' work.
          </Bullet>
        </ul>
      </Section>

      <Section title="System Integrity">
        <p>
          The character limits and reward systems exist to keep competition fair and submissions meaningful.
        </p>
        <ul className="mt-2 space-y-0">
          <Bullet>
            <span className="font-medium text-cinema-100">The 400-character Feed limit</span> and
            <span className="font-medium text-cinema-100"> 700-character Challenge limit</span> are hard caps.
            Any attempt to bypass them — through invisible characters, encoding tricks, or DOM manipulation —
            is a violation.
          </Bullet>
          <Bullet>
            <span className="font-medium text-cinema-100">Multiple account abuse</span> to inflate votes
            or stack challenge entries will result in a permanent ban across all accounts.
          </Bullet>

        </ul>
      </Section>

      <Section title="Enforcement">
        <p>
          Moderators review flagged content and may remove submissions or suspend accounts.
          Repeated violations escalate from warnings to permanent bans. Appeals can be submitted through the
          in-app flag system for admin review.
        </p>
      </Section>

      <Section title="The Bottom Line">
        <p>
          Be bold with your ideas. Be rigorous with your analysis. Be kind to your fellow cinephile.
          That's the whole deal.
        </p>
      </Section>
    </>
  );
}

function PrivacyContent() {
  return (
    <>
      <Section title="1. Information We Collect">
        <p>
          When you sign in, we collect your display name and authentication credentials. We do not collect
          real-name identity, location data, or biometric information.
        </p>
        <ul className="mt-2 space-y-0">
          <Bullet><span className="font-medium text-cinema-100">Account data:</span> display name, avatar initials, and sign-in email.</Bullet>
          <Bullet><span className="font-medium text-cinema-100">Content data:</span> your posts, pitches, challenge entries, comments, and votes.</Bullet>
          <Bullet><span className="font-medium text-cinema-100">Preference data:</span> saved posts — stored locally in your browser.</Bullet>
        </ul>
      </Section>
      <Section title="2. How We Use Your Data">
        <ul className="space-y-0">
          <Bullet>To display your submissions and profile within the community.</Bullet>
          <Bullet>To track challenge entries and leaderboard standings.</Bullet>
          <Bullet>To improve content moderation and detect abuse or vote manipulation.</Bullet>
        </ul>
      </Section>
      <Section title="3. Data Sharing">
        <p>
          We do not sell or share your personal data with third parties. Aggregate, anonymized statistics
          (e.g., total posts per week) may be used for internal analytics with no personally identifiable
          information.
        </p>
      </Section>
      <Section title="4. Local Storage">
        <p>
          Your saved posts and voting history are stored in your browser's
          LocalStorage. Clearing your browser data will reset these values. This data never leaves your device
          unless you explicitly sync to an account.
        </p>
      </Section>
      <Section title="5. Your Rights">
        <ul className="space-y-0">
          <Bullet><span className="font-medium text-cinema-100">Access:</span> you can view all your data through your Profile tab at any time.</Bullet>
          <Bullet><span className="font-medium text-cinema-100">Deletion:</span> you may delete individual posts or request full account deletion via admin contact.</Bullet>
          <Bullet><span className="font-medium text-cinema-100">Opt-out:</span> you may stop using the Service at any time and clear LocalStorage to remove all locally stored data.</Bullet>
        </ul>
      </Section>
      <Section title="6. Data Security">
        <p>
          Authentication tokens are managed through Supabase Auth with industry-standard encryption. LocalStorage
          data is sandboxed by your browser and inaccessible to other websites.
        </p>
      </Section>
      <Section title="7. Children's Privacy">
        <p>
          The Service is not directed to children under 13. We do not knowingly collect data from anyone under 13.
          If you believe a minor has registered, please contact us for immediate removal.
        </p>
      </Section>
      <Section title="8. Changes to This Policy">
        <p>
          We may update this Privacy Policy as the Service evolves. Material changes will be announced through
          in-app notifications. Continued use after changes are posted constitutes acceptance.
        </p>
      </Section>
    </>
  );
}

export function LegalPage({ page, onBack }: LegalPageProps) {
  const meta = pageMeta[page];
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ block: 'start' });
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div ref={topRef} className="px-4 pb-28 pt-4">
      {/* Back button — top */}
      <button
        onClick={onBack}
        style={{ touchAction: 'manipulation' }}
        className="spring-tap mb-4 flex items-center gap-1.5 rounded-xl bg-cinema-800/50 px-3 py-2 text-sm font-semibold text-cinema-200 transition-colors hover:text-gold-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Feed
      </button>

      {/* Glassmorphic content container */}
      <div
        className="overflow-hidden rounded-2xl border border-amber-500/70 glass animate-slide-up"
        style={{ borderColor: 'rgba(245, 158, 11, 0.7)' }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 184, 28, 0.10) 0%, rgba(255, 184, 28, 0.02) 100%)',
            borderBottom: '1px solid rgba(255, 184, 28, 0.15)',
          }}
        >
          <h2
            className="text-sm font-bold uppercase tracking-wider text-gold-accent"
            style={{ textShadow: '0 0 12px rgba(255, 184, 28, 0.4)' }}
          >
            {meta.title}
          </h2>
        </div>

        {/* Body */}
        <div className="px-4 py-5">
          <p className="mb-5 text-[11px] tracking-wide text-cinema-500">Last updated: {meta.updated}</p>
          {page === 'terms' && <TermsContent />}
          {page === 'acceptable-use' && <AcceptableUseContent />}
          {page === 'privacy' && <PrivacyContent />}
        </div>
      </div>

      {/* Back button — bottom */}
      <button
        onClick={onBack}
        style={{ touchAction: 'manipulation' }}
        className="spring-tap mt-4 flex items-center gap-1.5 rounded-xl bg-cinema-800/50 px-3 py-2 text-sm font-semibold text-cinema-200 transition-colors hover:text-gold-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Feed
      </button>
    </div>
  );
}

import { existsSync } from "fs";
import path from "path";
import Image from "next/image";
import { getPromptEntries } from "@/data/loader";
import { PromptGallery } from "@/components/prompt/PromptGallery";

const HERO_BG = "/hero-bg.jpg";
const hasHeroBg = existsSync(
  path.join(process.cwd(), "public", HERO_BG.replace(/^\//, "")),
);

export default async function HomePage() {
  const entries = await getPromptEntries();

  return (
    <main className="min-h-screen bg-canvas">
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface-dark text-on-dark px-lg py-xxl">
        {hasHeroBg && (
          <Image src={HERO_BG} alt="" fill priority className="object-cover" />
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_15%,var(--color-accent)_0%,transparent_55%),radial-gradient(circle_at_80%_0%,var(--color-badge-violet)_0%,transparent_50%)]"
        />
        {hasHeroBg && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-surface-dark/70"
          />
        )}
        <div className="relative mx-auto max-w-7xl">
          <p className="text-caption font-medium text-subtle uppercase tracking-normal mb-3">
            V-Prompt Challenge · 1차 Beta
          </p>
          <h1 className="text-display-md font-semibold leading-display-md tracking-display-md">
            수상작 갤러리
          </h1>
          <p className="mt-3 text-base leading-body text-subtle">
            챌린지를 통해 선발된 {entries.length}개의 우수 프롬프트 수상작을
            확인하세요.
          </p>
        </div>
      </section>

      {/* Gallery + Detail Panel */}
      <PromptGallery entries={entries} />
    </main>
  );
}

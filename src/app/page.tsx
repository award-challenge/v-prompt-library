import { getPromptEntries } from "@/data/loader";
import { PromptGallery } from "@/components/prompt/PromptGallery";

export default async function HomePage() {
  const entries = await getPromptEntries();

  return (
    <main className="min-h-screen bg-canvas">
      {/* Hero */}
      <section className="bg-surface-dark text-on-dark px-lg py-xxl">
        <div className="mx-auto max-w-7xl">
          <p className="text-caption font-medium text-subtle uppercase tracking-widest mb-3">
            V-Prompt Challenge · 1차 Beta
          </p>
          <h1 className="text-4xl font-bold tracking-tight">수상작 갤러리</h1>
          <p className="mt-3 text-base text-subtle">
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

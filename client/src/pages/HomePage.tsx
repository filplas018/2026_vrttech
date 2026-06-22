export const HomePage = () => {
  return (
    <main className="flex min-h-full w-full flex-1 flex-col  text-slate-900">
      <header className="border-b-2 mx-2 px-6 py-4 text-brand">
        <h1 className="text-2xl font-bold">Vítejte na VRT domovské stránce</h1>
      </header>

      <section className="mx-auto flex flex-1 w-full px-4 py-12 lg:px-6 bg-linear-to-br from-white via-orange-50 to-sky-50">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_rgba(15,89,155,0.10)] backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-brand-secondary">
                VRT Tech
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Digitalizace zakázek, dokumentů a realizace pro geotermální vrty a vrtané studny.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Tohle je zatím konceptová domovská stránka pro klienta. Má ukázat, že systém
                bude sjednocovat zakázky, přístupy, dokumenty, fotky, plánování i předání díla.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-brand-secondary px-4 py-2 text-sm font-semibold text-white shadow-sm">
                  Zakázky
                </span>
                <span className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm">
                  Dokumentace
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                  Fotky a mapy
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                  Kalendář a termíny
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">Uživatelé</p>
                <p className="mt-2 text-base font-medium text-slate-900">
                  2 hlavní super uživatelé a role pro jednatele, sekretářku a další členy týmu.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">Hydrogeologové</p>
                <p className="mt-2 text-base font-medium text-slate-900">
                  Maximálně 4 osoby, kterým lze zakázku přiřadit.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">Zakázky</p>
                <p className="mt-2 text-base font-medium text-slate-900">
                  Geotermální vrty, vrtané studny, nebo obojí v jedné evidenci.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">Dokumenty</p>
                <p className="mt-2 text-base font-medium text-slate-900">
                  Napojené soubory, faktury, rozpočty a podklady k předání.
                </p>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-2xl font-semibold text-slate-950">Geotermální vrty</h3>
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-brand-secondary">
                    Hlavní workflow
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Evidence poptávky, návštěvy, podmínek na místě, plánování termínů,
                  průběhu realizace, technické zprávy vrtu a předání investorovi.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-500">Obsah zakázky</p>
                    <p className="mt-1 text-sm text-slate-800">Fotogalerie, mapy, dokumentace, kontakty.</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-500">Stavy</p>
                    <p className="mt-1 text-sm text-slate-800">Poptávka, zájem, návštěva, realizace, předání.</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-500">Finance</p>
                    <p className="mt-1 text-sm text-slate-800">Faktury, budget, splatnost, pozastávky.</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-500">Protokoly</p>
                    <p className="mt-1 text-sm text-slate-800">Zjišťovací protokol a elektronický podpis adminem.</p>
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-2xl font-semibold text-slate-950">Vrtané studny</h3>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-brand">
                    9 kroků / nebo povolený vrt
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Stejné jádro jako u geotermálních vrtů, ale navíc průzkumné vrty,
                  hydrogeologické posouzení, povolení, čerpací zkoušky a další návazné kroky.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-500">Varianta</p>
                    <p className="mt-1 text-sm text-slate-800">Na klíč nebo připravené dokumenty.</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-500">Průzkum</p>
                    <p className="mt-1 text-sm text-slate-800">Terénní prohlídka, fotky, údaje, zpětná vazba.</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-500">Odborné kroky</p>
                    <p className="mt-1 text-sm text-slate-800">Posouzení, povolení, dozor, zkoušky, zpráva.</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-500">Výstup</p>
                    <p className="mt-1 text-sm text-slate-800">Projekt vodního díla a povolení odběru vody.</p>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,89,155,0.10)] backdrop-blur">
            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-sm font-medium text-slate-300">Stav projektu</p>
              <p className="mt-2 text-2xl font-semibold">Návrh systému</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Tahle stránka má sloužit klientovi jako představa, co bude aplikace řešit.
                Zatím jen ukazuje směr, rozsah a jednotlivé oblasti systému.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Přístupy</p>
                <p className="mt-1 text-base font-medium text-slate-900">
                  Nastavení práv pro jednotlivé role a generování hesel pro uživatele.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Kalendář</p>
                <p className="mt-1 text-base font-medium text-slate-900">
                  Vytížení vrtací techniky, termíny zakázek a posouvání realizací.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Dokumenty a fotky</p>
                <p className="mt-1 text-base font-medium text-slate-900">
                  Připojené soubory, galerie, mapy, průběh prací i podklady pro předání.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Později</p>
                <p className="mt-1 text-base font-medium text-slate-900">
                  Sem se doplní reálné formuláře, seznamy zakázek a detailní workflow.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Automatise tes tâches",
    desc: "Crée des workflows comme Zapier/IFTTT.",
  },
  { title: "Connecte tes apps", desc: "Slack, Discord, Gmail et plus encore." },
  {
    title: "Interface intuitive",
    desc: "Glisser-déposer pour construire ton scénario.",
  },
];

export default function Home() {
  const nav = useNavigate();

  const goToWorkflows = () => nav("/workflows");

  return (
    <div>
      {/* Hero */}
      <section className="text-white bg-purple-600 py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Bienvenue sur AREA
          </h1>
          <p className="mt-4 text-lg md:text-xl opacity-90">
            Construis tes automatisations en quelques clics.
          </p>
          <button
            onClick={goToWorkflows}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg shadow hover:bg-blue-50 transition"
          >
            Commencer
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Fonctionnalités</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <article
              key={f.title}
              role="button"
              tabIndex={0}
              onClick={goToWorkflows}
              onKeyDown={(e) => {
                if (e.key === "Enter") goToWorkflows();
              }}
              className="p-6 bg-white rounded-2xl shadow-purple-300 shadow hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              aria-label={f.title}
            >
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

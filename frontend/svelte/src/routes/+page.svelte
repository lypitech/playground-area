

<script>
  let features = [
    { title: "Automatise tes tâches", desc: "Crée des workflows comme Zapier/IFTTT.", href: "/workflows" },
    { title: "Connecte tes apps", desc: "Slack, Discord, Gmail et plus encore.", href: "/apps" },
    { title: "Interface intuitive", desc: "Glisser-déposer pour construire ton scénario.", href: "/about" },
  ];
</script>
<div class="h-screen flex flex-col">

    <!-- Hero Section -->
    <section class="h-1/2 flex flex-col items-center justify-center bg-indigo-600 text-white">
        <h1 class="text-5xl font-bold mb-4">Bienvenue sur AREA</h1>
        <p class="text-lg mb-6">Construis tes automatisations en quelques clics</p>
        <button class="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-blue-100 transition">
            Commencer
        </button>
    </section>

    <!-- Features Section -->
    <section class="features">
        {#each features as feat}
            <div
            role="button"
            tabindex="0"
            class="card cursor-pointer hover:bg-gray-100"
            on:click={() => (window.location.href = feat.href)}
            on:keydown={(event) => {
                if (event.key === 'Enter') window.location.href = feat.href;
            }}
            >
            <h2>{feat.title}</h2>
            <p>{feat.desc}</p>
        </div>
        {/each}
    </section>


    <!-- Footer -->
    <footer>
        <p>© 2025 AREA - Projet étudiant</p>
    </footer>

</div>
<style>

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    padding: 3rem 2rem;
  }
  .card {
    background: #f9fafb;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    text-align: center;
    cursor: pointer;
  }
  .card:hover {
    background: #fff;
    box-shadow: 0 6px 8px rgba(0,0,0,0.1);
  }
  footer {
    text-align: center;
    padding: 1rem;
    background: #f3f4f6;
    margin-top: 2rem;
  }
</style>

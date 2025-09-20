<section class="button">
    <button on:click={() => history.back()}>Back</button>
</section>

<section class="title">
    <h1>Apps</h1>
    <div>
        first app
    </div>
</section>

<style>
    h1 {
        text-align: center;
        color: white;
        font-size: 4em;
    }

    div {
        text-align: center;
        font-size: 1.5em;
        color: white;
    }

    button {
        font-size: 1em;
        padding: 0.5em;
        border-radius: 1em;
        background-color: white;
        color: blueviolet;
        cursor: pointer;

        &:hover {
            background-color: lightyellow;
            scale: 1.1;
        }
    }

    section.button {
        background-color: blueviolet;
        padding-top: 1em;
        padding-left: 1em;
    }

    section.title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 0.6;
        background-color: blueviolet;
        padding: 2em;
    }
</style>
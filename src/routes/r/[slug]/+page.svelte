<script>
    /** @type {import('./$types').PageData} */
    export let data;

    let slug = data.slug;

    import Navbar from "$lib/components/navbar.svelte";
    import Sidebar from "$lib/components/sidebar.svelte";
    import { onMount } from "svelte";

    let notFound = false;

    onMount(async () => {
        let response = await fetch(`/api/r/${slug}`);

        if (response.status == 200) {
            let json = await response.json();

            if (json.status == 200) {
                console.log(json);
            } else if (json.status == 404) {
                notFound = true;
                console.log("404");
            }
        } else if (response.status == 404) {
            notFound = true;
            console.log("404");
        }
    });
</script>

<body class="bg-ctp-base">
    <Navbar />
    {#if notFound}
        <div class="flex flex-col items-center justify-center h-[100vh]">
            <h1 class="text-5xl text-ctp-red">404 Not Found</h1>
            <a
                class="text-xl text-ctp-text transition-all duration-300 hover:scale-105"
                href="/">Return Home</a
            >
        </div>
    {:else}
        <p>a</p>
    {/if}
</body>

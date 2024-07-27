<script>
    /** @type {import('./$types').PageData} */
    export let data;

    let slug = data.slug;

    import Navbar from "$lib/components/navbar.svelte";
    import Sidebar from "$lib/components/sidebar.svelte";
    import { onMount } from "svelte";

    import { goto } from "$app/navigation";
    import SignedIn from "clerk-sveltekit/client/SignedIn.svelte";
    import SignedOut from "clerk-sveltekit/client/SignedOut.svelte";
    import SignIn from "clerk-sveltekit/client/SignIn.svelte";

    let notFound = false;

    onMount(async () => {
        try {
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
        } catch (error) {
            console.error("Error fetching data:", error);
            notFound = true;
        }
    });

    let title = "";
    let content = "";

    async function createPost() {
        let response = await fetch(`/api/r/${slug}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                subrabbit: slug,
                content: content,
                author: window.Clerk?.user.id,
            }),
        });

        let json = await response.json();

        if (json.status == 201) {
            goto(json.url);
        } else {
            console.log(json.message);
        }
    }
</script>

<body class="bg-ctp-base h-[100vh]">
    <Navbar />
    {#if notFound}
        <div class="flex flex-col items-center justify-center min-h-[90%]">
            <h1 class="text-5xl text-ctp-red">404 Not Found</h1>
            <a
                class="text-xl text-ctp-text transition-all duration-300 hover:scale-105"
                href="/">Return Home</a
            >
        </div>
    {:else}
        <SignedIn>
            <div
                class="flex flex-col bg-ctp-surface0 min-h-[90%] rounded-md mx-[25%] mt-5"
            >
                <div class="flex flex-col m-5">
                    <input
                        class="mt-1 block text-white w-full rounded-md border-ctp-overlay2 border-[1px] p-2 bg-ctp-overlay2 placeholder-gray-600"
                        type="text"
                        placeholder="Post Title"
                        bind:value={title}
                    />
                    <textarea
                        class="mt-2 block text-white w-full rounded-md border-ctp-overlay2 border-[1px] p-2 bg-ctp-overlay2 placeholder-gray-600"
                        type="text"
                        rows="12"
                        placeholder="Post Content"
                        bind:value={content}
                    />
                    <button
                        class="mt-4 bg-ctp-blue text-gray-800 p-2 rounded w-full"
                        on:click={createPost}
                    >
                        Create
                    </button>
                </div>
            </div>
        </SignedIn>
        <SignedOut>
            <div class="flex absolute justify-center h-[100%] w-[100%]">
                <div class="mt-auto mb-auto text-black-pls">
                    <SignIn redirectUrl={`/r/${slug}/new`} />
                </div>
            </div>
        </SignedOut>
    {/if}
</body>

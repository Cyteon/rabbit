<script>
    /** @type {import('./$types').PageData} */
    export let data;

    let slug = data.slug;

    import Navbar from "$lib/components/navbar.svelte";
    import Sidebar from "$lib/components/sidebar.svelte";
    import SignedIn from "clerk-sveltekit/client/SignedIn.svelte";
    import SignedOut from "clerk-sveltekit/client/SignedOut.svelte";
    import { onMount } from "svelte";

    let notFound = false;
    let json = { data: { posts: [] } };

    let post = {};

    onMount(async () => {
        try {
            let response = await fetch(`/api/r/${slug}`);

            if (response.status === 200) {
                let json = await response.json();

                if (json.status === 200) {
                    // Process posts data
                    for (
                        let index = 0;
                        index < json.data.posts.length;
                        index++
                    ) {
                        if (json.data.posts[index].id === data.post) {
                            post = json.data.posts[index];
                            let user = await fetch(`/api/u/${post.author}`);
                            let userData = await user.json();

                            console.log(userData);

                            post.imageUrl = userData.imageUrl;
                            post.username = userData.username;
                            json.data.posts[index].imageUrl = userData.imageUrl;
                        }
                    }

                    console.log(post);
                } else if (json.status === 404) {
                    notFound = true;
                    console.log("404");
                }
            } else if (response.status === 404) {
                notFound = true;
                console.log("404");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            notFound = true;
        }
    });
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
        <div
            class="flex flex-col bg-ctp-surface0 min-h-[90%] rounded-md mx-[25%] mt-5"
        >
            <div class="flex flex-row">
                <p
                    class="justify-start mr-auto mt-auto text-xl ml-3 text-ctp-text p-2"
                >
                    r/{slug}
                </p>
            </div>
            <div
                class="flex flex-col bg-ctp-surface1 rounded-md m-3 p-3 transition-all duration-300 hover:scale-[102%]"
            >
                <div class="flex flex-row">
                    <a href={`/u/${post.author}`} class="my-auto">
                        <img
                            class="h-8 w-8 rounded-full mr-2"
                            src={post.imageUrl}
                            alt="avatar"
                        />
                    </a>
                    <div class="flex flex-col">
                        <a
                            href={`/r/${post.subrabbit}`}
                            class="text-sm text-ctp-text font-bold"
                        >
                            r/{post.subrabbit}
                        </a>
                        <a
                            href={`/u/${post.author}`}
                            class="text-sm text-ctp-text">{post.username}</a
                        >
                    </div>
                </div>
                <h1 class="text-2xl text-ctp-text">{post.title}</h1>
                <p class="text-base text-ctp-text">{post.content}</p>
            </div>
        </div>
    {/if}
</body>

<script>
    /** @type {import('./$types').PageData} */
    export let data;

    let slug = data.slug;

    import Navbar from "$lib/components/navbar.svelte";
    import Sidebar from "$lib/components/sidebar.svelte";
    import SignedIn from "clerk-sveltekit/client/SignedIn.svelte";
    import SignedOut from "clerk-sveltekit/client/SignedOut.svelte";

    import FaCaretSquareUp from "svelte-icons/fa/FaCaretSquareUp.svelte";
    import FaCaretSquareDown from "svelte-icons/fa/FaCaretSquareDown.svelte";
    import { onMount } from "svelte";

    let notFound = false;
    let json = { data: {}, post: {}, subrabbit: {} };

    let post = {};

    onMount(async () => {
        try {
            let response = await fetch(`/api/r/${slug}/${data.post}`);

            if (response.status === 200) {
                json = await response.json();

                if (json.status === 200) {
                    post = json.data;
                    let user = await fetch(`/api/u/${post.author_clerk_id}`);
                    let userData = await user.json();

                    post.imageUrl = userData.imageUrl;
                    post.username = userData.username;
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
            <div class="flex flex-col bg-ctp-surface1 rounded-md m-3 p-3">
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
                            href={`/r/${json.subrabbit.name}`}
                            class="text-sm text-ctp-text font-bold"
                        >
                            r/{json.subrabbit.name}
                        </a>
                        <a
                            href={`/u/${post.author}`}
                            class="text-sm text-ctp-text">{post.username}</a
                        >
                    </div>
                </div>
                <h1 class="text-2xl text-ctp-text">{post.title}</h1>
                <p class="text-base text-ctp-text break-words">
                    {post.content}
                </p>
                <div class="flex flex-row mt-3">
                    <div
                        class="text-ctp-text bg-ctp-surface0 w-fit py-2 px-3 flex flex-row rounded-full"
                    >
                        <button
                            class="w-5 transition-all duration-300 hover:scale-110"
                        >
                            <FaCaretSquareUp />
                        </button>
                        <p class="mx-2">{post.upvotes - post.downvotes}</p>
                        <button class="w-5">
                            <FaCaretSquareDown />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</body>

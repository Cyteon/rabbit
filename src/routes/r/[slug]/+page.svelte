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
    let json = { data: {}, posts: [] };

    let selfData = { data: { votes: {} } };

    onMount(async () => {
        try {
            let response = await fetch(`/api/r/${slug}`);

            if (response.status == 200) {
                json = await response.json();

                if (json.status == 200) {
                    //console.log(json);
                } else if (json.status == 404) {
                    notFound = true;
                    console.log("404");
                }
            } else if (response.status == 404) {
                notFound = true;
                console.log("404");
            }

            for (let index = 0; index < json.posts.length; index++) {
                const post = json.posts[index];
                let user = await fetch(`/api/u/${post.author_clerk_id}`);
                let userData = await user.json();

                console.log(userData);

                json.posts[index].imageUrl = userData.imageUrl;
                json.posts[index].username = userData.username;
            }

            let result = await fetch(`/api/u/${window?.Clerk?.user?.id}`);
            selfData = await result.json();

            console.log(json);
        } catch (error) {
            console.error("Error fetching data:", error);
            notFound = true;
        }
    });

    async function votePost(vote, post) {
        try {
            let response = await fetch(`/api/r/${slug}/${post.id_rand}/vote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    vote: vote,
                    user_id: selfData.data.id,
                    subrabbit: post.subrabbit,
                    post: post.id,
                }),
            });

            if (response.status === 200) {
                let json = await response.json();
                post.votes = json.post.votes;

                selfData.data.votes[post.id] = vote;
            }
        } catch (error) {
            console.error("Error voting post:", error);
        }
    }

    function downvote(event, post) {
        event.stopPropagation();
        votePost(-1, post);
    }

    function upvote(event, post) {
        event.stopPropagation();
        votePost(1, post);
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
        <div
            class="flex flex-col bg-ctp-surface0 min-h-[90%] rounded-xl mx-[10%] mt-5"
        >
            <div class="flex flex-row">
                <p
                    class="justify-start mr-auto mt-auto text-xl ml-3 text-ctp-text p-2"
                >
                    r/{slug}
                </p>
                <button
                    class="justify-start ml-auto mr-3 mt-3 text-gray-800 bg-ctp-blue p-2 rounded-md"
                    on:click={() => {
                        window.location.href = `/r/${slug}/new`;
                    }}
                    >+ Create Post
                </button>
            </div>
            {#each json.posts as post}
                <div
                    class="flex flex-col bg-ctp-surface1 rounded-md m-3 p-3 transition-all duration-300 hover:scale-[100.5%] overflow-hidden"
                    on:click={() => {
                        window.location.href = `/r/${slug}/${post.id_rand}`;
                    }}
                >
                    <div class="flex flex-row">
                        <a
                            href={`/u/${post.username}`}
                            class="my-auto"
                            on:click|stopPropagation
                        >
                            <img
                                class="h-8 w-8 rounded-full mr-2"
                                src={post.imageUrl}
                                alt="avatar"
                            />
                        </a>
                        <a
                            href={`/u/${post.username}`}
                            class="text-base text-ctp-text mt-auto mb-auto"
                            on:click|stopPropagation>{post.username}</a
                        >
                    </div>
                    <h1 class="text-2xl text-ctp-text">{post.title}</h1>
                    <div>
                        <p
                            class="text-base text-ctp-text break-words max-h-24 overflow-hidden"
                        >
                            {post.content}
                        </p>
                    </div>
                    <div class="flex flex-row">
                        <div
                            class="text-ctp-text bg-ctp-surface0 w-fit py-2 px-3 flex flex-row rounded-full"
                        >
                            {#if post.id in selfData.data.votes}
                                {#if selfData.data.votes[post.id] == -1}
                                    <button
                                        on:click={(event) =>
                                            upvote(event, post)}
                                        class="w-5 transition-all duration-300 hover:scale-110"
                                    >
                                        <FaCaretSquareUp />
                                    </button>
                                    <p class="mx-2">{post.votes}</p>
                                    <button
                                        on:click={(event) =>
                                            downvote(event, post)}
                                        class="w-5 transition-all duration-300 hover:scale-110 text-ctp-blue"
                                    >
                                        <FaCaretSquareDown />
                                    </button>
                                {:else}
                                    <button
                                        on:click={(event) =>
                                            upvote(event, post)}
                                        class="w-5 transition-all duration-300 hover:scale-110 text-ctp-blue"
                                    >
                                        <FaCaretSquareUp />
                                    </button>
                                    <p class="mx-2">{post.votes}</p>
                                    <button
                                        on:click={(event) =>
                                            downvote(event, post)}
                                        class="w-5 transition-all duration-300 hover:scale-110"
                                    >
                                        <FaCaretSquareDown />
                                    </button>
                                {/if}
                            {:else}
                                <button
                                    on:click={(event) => upvote(event, post)}
                                    class="w-5 transition-all duration-300 hover:scale-110"
                                >
                                    <FaCaretSquareUp />
                                </button>
                                <p class="mx-2">{post.votes}</p>
                                <button
                                    on:click={(event) => downvote(event, post)}
                                    class="w-5 transition-all duration-300 hover:scale-110"
                                >
                                    <FaCaretSquareDown />
                                </button>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</body>

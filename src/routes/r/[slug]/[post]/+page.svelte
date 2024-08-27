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

    import { marked } from "marked";
    import DOMPurify from "dompurify";

    let notFound = false;
    let json = { data: {}, post: {}, subrabbit: {}, comments: [] };

    let post = {};

    let selfData = { data: { votes: {} } };

    let comment;

    onMount(async () => {
        try {
            let response;

            try {
                let response = await fetch(`/api/u/self`);

                if (response.status == 200) {
                    selfData = await response.json();
                }
            } catch (_) {}

            response = await fetch(`/api/r/${slug}/${data.post}`);

            if (response.status === 200) {
                json = await response.json();

                console.log(json);

                if (json.status === 200) {
                    post = json.data;
                    let user = await fetch(`/api/u/id_${post.author_clerk_id}`);
                    let userData = await user.json();

                    post.imageUrl = userData.imageUrl;
                    post.username = userData.username;

                    json.comments.forEach(async (post, index) => {
                        let user = await fetch(
                            `/api/u/id_${post.author_clerk_id}`,
                        );
                        let userData = await user.json();

                        json.comments[index].imageUrl = userData.imageUrl;
                        json.comments[index].username = userData.username;
                    });

                    post.content = DOMPurify.sanitize(
                        marked.parse(post.content),
                    );
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

        setTimeout(() => {
            Prism.highlightAll();
        }, 1000);
    });

    async function votePost(vote) {
        try {
            let response = await fetch(`/api/r/${slug}/${data.post}/vote`, {
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

    async function downvote() {
        await votePost(-1);
    }

    async function upvote() {
        await votePost(1);
    }

    async function addComment() {
        let result = await fetch(`/api/r/${slug}/${data.post}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content: comment,
                user_id: selfData.data.id,
                clerk_id: window?.Clerk.user.id,
                subrabbit: post.subrabbit,
                subrabbit_name: json.subrabbit.name,
                post: post.id,
            }),
        });

        if (result.status === 200) {
            let data = await result.json();

            data.comment.imageUrl = selfData.user.imageUrl;
            data.comment.username = selfData.user.username;
            data.comment.votes = { 1: 0, "-1": 0 };
            data.comment.author_clerk_id = selfData.data.id;

            json.comments = [data.comment, ...json.comments];
        }
    }
</script>

<head>
    <meta property="og:title" content={post.title} />
</head>

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
            class="flex flex-col bg-ctp-surface0 min-h-[90%] rounded-md mx-[10%] mt-5"
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
                <divb
                    class=" text-ctp-text break-words whitespace-pre-wrap prose"
                >
                    {@html post.content}
                </divb>
                <div class="flex flex-row mt-3">
                    <div
                        class="text-ctp-text bg-ctp-surface0 w-fit py-2 px-3 flex flex-row rounded-full"
                    >
                        {#if post.id in selfData.data.votes}
                            {#if selfData.data.votes[post.id] == -1}
                                <button
                                    on:click={upvote}
                                    class="w-5 transition-all duration-300 hover:scale-110"
                                >
                                    <FaCaretSquareUp />
                                </button>
                                <p class="mx-2">
                                    {post.votes}
                                </p>
                                <button
                                    on:click={downvote}
                                    class="w-5 transition-all duration-300 hover:scale-110 text-ctp-blue"
                                >
                                    <FaCaretSquareDown />
                                </button>
                            {:else}
                                <button
                                    on:click={upvote}
                                    class="w-5 transition-all duration-300 hover:scale-110 text-ctp-blue"
                                >
                                    <FaCaretSquareUp />
                                </button>
                                <p class="mx-2">
                                    {post.votes}
                                </p>
                                <button
                                    on:click={downvote}
                                    class="w-5 transition-all duration-300 hover:scale-110"
                                >
                                    <FaCaretSquareDown />
                                </button>
                            {/if}
                        {:else}
                            <button
                                on:click={upvote}
                                class="w-5 transition-all duration-300 hover:scale-110"
                            >
                                <FaCaretSquareUp />
                            </button>
                            <p class="mx-2">{post.votes}</p>
                            <button
                                on:click={downvote}
                                class="w-5 transition-all duration-300 hover:scale-110"
                            >
                                <FaCaretSquareDown />
                            </button>
                        {/if}
                    </div>
                </div>
            </div>
            <div class="ml-3 mr-3 p-2 flex flex-row bg-ctp-surface1 rounded-md">
                <input
                    placeholder="Add a comment"
                    class="rounded-md p-2 mr-2 w-full bg-ctp-mantle text-ctp-text"
                    bind:value={comment}
                />
                <button
                    class="bg-ctp-blue text-gray-800 px-3 py-2 rounded-md"
                    on:click={addComment}
                >
                    Send
                </button>
            </div>
            {#each json.comments as comment}
                <div
                    class="ml-3 mr-3 mt-3 p-2 flex flex-col bg-ctp-surface1 rounded-md text-ctp-text"
                >
                    <div class="flex flex-row">
                        <a href={`/u/${comment.author}`} class="my-auto">
                            <img
                                class="h-8 w-8 rounded-full mr-2"
                                src={comment.imageUrl}
                                alt="avatar"
                            />
                        </a>
                        <a
                            href={`/u/${comment.author}`}
                            class="text-base text-ctp-text mt-auto mb-auto"
                            >{comment.username}</a
                        >
                    </div>
                    <p>{comment.content}</p>
                </div>
            {/each}
        </div>
    {/if}
</body>

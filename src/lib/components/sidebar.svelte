<script>
    import MdHome from "svelte-icons/md/MdHome.svelte";
    import MdArrowDropDown from "svelte-icons/md/MdArrowDropDown.svelte";
    import MdAdd from "svelte-icons/md/MdAdd.svelte";
    import SignedIn from "clerk-sveltekit/client/SignedIn.svelte";

    import { goto } from "$app/navigation";

    import { onMount } from "svelte";

    // State variable to control the visibility of the popup
    let showPopup = false;
    let communityName = "";
    let communityDescription = "";
    let communityError = "";

    function togglePopup() {
        showPopup = !showPopup;
        communityName = "";
        communityDescription = "";
        communityError = "";
    }

    let json = { data: { subrabbits_interacted_with: [] } };

    onMount(async () => {
        let self = await fetch(`/api/u/self`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (self.status == 200) {
            json = await self.json();
        }
    });

    async function createCommunity() {
        console.log(communityName);
        console.log(communityDescription);

        let response = await fetch("/api/subrabbits/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: communityName,
                description: communityDescription,
                owner: window.Clerk?.user.id,
            }),
        });

        let json = await response.json();

        if (json.status == 201) {
            goto(json.url);
        } else {
            communityError = json.message;
        }
    }

    // State variable to control the visibility of the accordion
    let showAccordion = false;
</script>

<nav
    class="bg-ctp-mantle border-ctp-overlay2 border-r-[1px] w-[15%] h-[100%] text-ctp-text fixed"
>
    <div class="m-2">
        <button
            class="flex flex-row w-full transition-all min-h-12 duration-300 hover:bg-black/15 p-1 rounded-lg"
        >
            <div class="h-8 mt-auto mb-auto"><MdHome /></div>
            <p class="text-base m-auto">Home</p>
        </button>
        <SignedIn>
            <hr class="border-gray-600 m-1 border-t-[1px]" />
            <div class="accordion">
                <div
                    role="aria-button"
                    class="flex flex-row items-center justify-between cursor-pointer min-h-12 p-1 rounded-lg transition-all duration-300 hover:bg-black/15"
                    on:click={() => (showAccordion = !showAccordion)}
                >
                    <p class="font-bold">Communities</p>
                    <div class="h-6"><MdArrowDropDown /></div>
                </div>
                <div
                    class="accordion-content"
                    style:max-height={showAccordion ? "200px" : "0px"}
                >
                    <button
                        class="flex flex-row w-full transition-all duration-300 hover:bg-black/15 p-1 rounded-lg"
                        on:click={togglePopup}
                    >
                        <div class="h-8"><MdAdd /></div>
                        <p class="text-base m-auto">Create a community</p>
                    </button>
                    {#each json.data.subrabbits_interacted_with as subrabbit}
                        <button
                            class="flex flex-row w-full transition-all duration-300 hover:bg-black/15 p-1 rounded-lg"
                            on:click={() => goto(`/r/${subrabbit}`)}
                        >
                            r/{subrabbit}
                        </button>
                    {/each}
                </div>
            </div>
        </SignedIn>
    </div>
</nav>

{#if showPopup}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div class="bg-ctp-surface2 p-6 rounded-lg shadow-lg">
            <h2 class="text-lg font-bold text-ctp-text">Create a Community</h2>

            <form class="mt-4">
                <label class="block">
                    <span class="text-ctp-text">Name</span>
                    <input
                        class="mt-1 block text-white w-full rounded-md border-ctp-overlay2 border-[1px] p-2 bg-ctp-overlay2 placeholder-gray-600"
                        type="text"
                        onkeypress="return event.charCode != 32"
                        placeholder="Community Name"
                        bind:value={communityName}
                    />
                </label>
                <label class="block mt-2">
                    <span class="text-ctp-text">Description</span>
                    <textarea
                        class="mt-1 block text-white w-full rounded-md border-ctp-overlay2 border-[1px] p-2 bg-ctp-overlay2 placeholder-gray-600"
                        placeholder="Community Description"
                        bind:value={communityDescription}
                    ></textarea>
                </label>

                <button
                    class="mt-4 bg-ctp-blue text-gray-800 p-2 rounded w-full"
                    on:click={createCommunity}
                >
                    Create
                </button>
                <p class="text-ctp-red text-sm">{communityError}</p>

                <button
                    class="mt-1 bg-ctp-blue text-gray-800 p-2 rounded w-full"
                    on:click={togglePopup}
                >
                    Cancel
                </button>
            </form>
        </div>
    </div>
{/if}

<style>
    .accordion-content {
        overflow: hidden;
        transition: max-height 0.3s ease;
    }
</style>

<script>
    import MdHome from "svelte-icons/md/MdHome.svelte";
    import MdArrowDropDown from "svelte-icons/md/MdArrowDropDown.svelte";
    import MdAdd from "svelte-icons/md/MdAdd.svelte";
    import SignedIn from "clerk-sveltekit/client/SignedIn.svelte";

    import { goto } from "$app/navigation";

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
</script>

<nav
    class="bg-ctp-surface0 border-ctp-overlay2 border-r-[1px] w-[15%] h-[94%] text-ctp-text absolute"
>
    <div class="m-2">
        <button
            class="flex flex-row w-full transition-all duration-300 hover:bg-black/15 p-1 rounded-lg"
        >
            <div class="h-8"><MdHome /></div>
            <p class="text-base m-auto">Home</p>
        </button>
        <SignedIn>
            <label>
                <input
                    class="peer/showLabel absolute scale-0"
                    type="checkbox"
                />
                <span
                    class="block max-h-14 max-w-xs overflow-hidden rounded-lg p-1 transition-all duration-300 hover:bg-black/15 peer-checked/showLabel:max-h-52"
                >
                    <div class="flex flex-grow-0">
                        <p class="cursor-pointer font-bold mt-[5%] mb-[5%]">
                            Communities
                        </p>
                        <div class="h-6 mt-auto mb-auto ml-auto mr-1">
                            <MdArrowDropDown />
                        </div>
                    </div>

                    <button
                        class="flex flex-row w-full transition-all duration-300 hover:bg-black/15 p-1 rounded-lg"
                        on:click={togglePopup}
                    >
                        <div class="h-8"><MdAdd /></div>
                        <p class="text-base m-auto">Create a community</p>
                    </button>
                </span>
            </label>
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

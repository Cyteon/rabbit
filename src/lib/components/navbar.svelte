<script>
    import UserButton from "clerk-sveltekit/client/UserButton.svelte";
    import SignInButton from "clerk-sveltekit/client/SignInButton.svelte";
    import SignedOut from "clerk-sveltekit/client/SignedOut.svelte";
</script>

<nav class="bg-ctp-mantle border-ctp-overlay2 border-b-[1px] sticky top-0 z-10">
    <div class="p-3 flex flex-row">
        <a class="text-ctp-text text-xl mt-auto mb-auto" href="/">Rabbit</a>
        <div class="justify-end ml-auto">
            <UserButton />
            <SignedOut>
                <button
                    class="text-ctp-crust bg-ctp-blue py-1 px-3 rounded-md transition-all hover:scale-105 duration-300 shadow-md"
                >
                    <SignInButton />
                </button>
            </SignedOut>
        </div>
    </div>
</nav>

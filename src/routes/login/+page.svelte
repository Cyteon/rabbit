<script lang="ts">
    import SignIn from "clerk-sveltekit/client/SignIn.svelte";
</script>

<div class="bg-ctp-base">
    <div class="flex justify-center h-[100vh]">
        <div class="mt-auto mb-auto text-black-pls">
            <SignIn redirectUrl="/" />
        </div>
    </div>
</div>

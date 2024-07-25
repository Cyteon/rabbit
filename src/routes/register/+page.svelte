<script lang="ts">
    import SignUp from "clerk-sveltekit/client/SignUp.svelte";
</script>

<div class="bg-ctp-base">
    <div class="flex justify-center h-[100vh]">
        <div class="mt-auto mb-auto">
            <SignUp redirectUrl="/" />
        </div>
    </div>
</div>

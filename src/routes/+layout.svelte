<script lang="ts">
    import '$lib/app.css';
    import Navbar from '$lib/Navbar.svelte';
    import {
        Modal,
        Button,
        Label,
        Input,
        Select,
        Toast
    } from 'flowbite-svelte';
    import {
        CheckCircleSolid,
        CloseCircleSolid
    } from 'flowbite-svelte-icons';

    // modal state
    let formModal = false;

    // form fields
    let streamerId = '';
    let inputType  = 'login';
    let login      = '';
    let twitchId   = '';

    // toast state
    let showToast = false;
    let toastColor: 'green' | 'red' = 'green';
    let toastMessage = '';

    function openModal() {
        formModal = true;
    }

    async function submitStreamer(event: Event) {
        event.preventDefault();
        // clear any existing toast
        showToast = false;

        // front-end validation
        if (!streamerId.trim()
            || (inputType === 'login'   && !login.trim())
            || (inputType === 'twitch_id' && !twitchId.trim())
        ) {
            toastColor   = 'red';
            toastMessage = 'Validation error: need Streamer ID + (Login or Twitch ID).';
            fireToast();
            return;
        }

        // build payload
        const apiBase = localStorage.getItem('apiBase') ?? 'http://localhost:8080';
        const body: any = { streamer_id: streamerId.trim() };
        if (inputType === 'login')  body.login     = login.trim();
        else                         body.twitch_id = twitchId.trim();

        try {
            const res = await fetch(`${apiBase}/api/v1/streamers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (!res.ok) {
                toastColor   = 'red';
                toastMessage = data.message || 'Unknown error';
            } else {
                toastColor   = 'green';
                toastMessage = `Streamer ${data.id} created successfully!`;
                // clear inputs on success for quick next entry
                streamerId = '';
                login      = '';
                twitchId   = '';
            }
        } catch (e: any) {
            toastColor   = 'red';
            toastMessage = `Network error: ${e.message}`;
        }

        fireToast();
    }

    function fireToast() {
        showToast = true;
        // auto-hide after 3s
        setTimeout(() => (showToast = false), 3000);
    }
</script>

<Navbar on:openSubmitModal={openModal} />

<slot />

<!-- Submit-streamer Modal -->
<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
    <form on:submit={submitStreamer} class="flex flex-col space-y-4 p-4">
        <h3 class="text-xl font-medium text-gray-900">Submit streamer</h3>

        <Label class="space-y-2">
            <span>Streamer ID</span>
            <Input type="text" bind:value={streamerId} />
        </Label>

        <Label class="space-y-2">
            <span>Field type</span>
            <Select bind:value={inputType}>
                <option value="login">Login</option>
                <option value="twitch_id">Twitch ID</option>
            </Select>
        </Label>

        {#if inputType === 'login'}
            <Label class="space-y-2">
                <span>Login</span>
                <Input type="text" bind:value={login} />
            </Label>
        {:else}
            <Label class="space-y-2">
                <span>Twitch ID</span>
                <Input type="text" bind:value={twitchId} />
            </Label>
        {/if}

        <div class="flex justify-end space-x-2 pt-2">
            <Button type="submit" size="sm" color="purple">Submit</Button>
            <Button color="alternative" on:click={() => (formModal = false)}>Close</Button>
        </div>
    </form>
</Modal>

<!-- Toast notification -->
{#if showToast}
    <div class="fixed top-4 right-4 z-50">
        <Toast color={toastColor}>
            <svelte:fragment slot="icon">
                {#if toastColor === 'green'}
                    <CheckCircleSolid class="w-5 h-5" />
                    <span class="sr-only">Success icon</span>
                {:else}
                    <CloseCircleSolid class="w-5 h-5" />
                    <span class="sr-only">Error icon</span>
                {/if}
            </svelte:fragment>
            {toastMessage}
        </Toast>
    </div>
{/if}

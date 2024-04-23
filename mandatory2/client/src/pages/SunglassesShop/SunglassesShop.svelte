<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { BASE_URL } from '../../stores/generalStore';
    import { fetchGet, fetchPost } from '../../util/api';

    let customer = {
        name: 'Gleb',
    };

    onMount(async () => {
        try {
            const postResponse = await fetchPost(`${BASE_URL}/api/customers`, customer);
            if (!postResponse) {
                console.error('Failed to create customer');
                return;
            }

            const result = await fetchGet(`${BASE_URL}/api/customers`);
            console.log(result);
        } catch (error) {
            console.error('Error in processing:', error);
        }
    });

    function completeCheckout() {
        navigate('/');
    }
</script>

<h1>Sunglasses Shop</h1>

<button on:click={completeCheckout}>Checkout</button>

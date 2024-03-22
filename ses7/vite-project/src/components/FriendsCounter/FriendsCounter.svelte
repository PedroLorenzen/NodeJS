<script>
    export let friendsCounter = 0
    function alienateFriend() {
        friendsCounter --
    }
</script>

<div>Friends Counter</div>
<div>on:click={alienateFriend}</div>
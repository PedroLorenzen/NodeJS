<script>
    import { Router, Route, Link } from 'svelte-routing';
    import Movies from './pages/Movies/Movies.svelte';
    import Home from './pages/Home/Home.svelte';
    import SunglassesShop from './pages/SunglassesShop/SunglassesShop.svelte';
</script>

<Router>
    <nav>
        <Link to="/">Home</Link>
        <Link to="/movies">Eclipse Movies</Link>
        <Link to="/shop">Sunglasses Shop</Link>
    </nav>
    <Route path="/" component={Home} />
    <Route path="/movies" component={Movies} />
    <Route path="/shop" component={SunglassesShop} />
</Router>

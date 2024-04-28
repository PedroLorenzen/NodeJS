<script>
  import { Router, Route, Link } from 'svelte-routing';
  import Footer from "./components/Footer/Footer.svelte";
  import Header from "./components/Header/Header.svelte";
  import Home from "./pages/Home/Home.svelte";
  import User from "./pages/User/User.svelte";
</script>

<main>
  <Header />
  <Router>
    <Route path="/" component={Home} />
    <Route path="/User" component={User} />
  </Router>
  <Footer />
</main>
<script>
  import { Router, Route, Link } from 'svelte-routing';
  import Footer from "./components/Footer/Footer.svelte";
  import Header from "./components/Header/Header.svelte";
  import Home from "./pages/Home/Home.svelte";
  import User from "./pages/User/User.svelte";
  import Jobs from "./pages/Jobs/Jobs.svelte";
</script>

<main>
  <Header />
  <Router>
    <Route path="/" component={Home} />
    <Route path="/User" component={User} />
    <Route path="/Jobs" component={Jobs} />
  </Router>
  <Footer />
</main>
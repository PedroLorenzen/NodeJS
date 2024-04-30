<script>
  import { Router, Route, Link } from 'svelte-routing';
  import { get } from "svelte/store";
  import { onMount } from 'svelte';
  import checkSession from './util/checkSession.js';
  import PrivateRouteGuard from './components/ProtectedRoute/PrivateRouteGuard.svelte';
  import Footer from "./components/Footer/Footer.svelte";
  import Header from "./components/Header/Header.svelte";
  import Home from "./pages/Home/Home.svelte";
  import User from "./pages/User/User.svelte";
  import Jobs from "./pages/Jobs/Jobs.svelte";
  import Contact from "./pages/Contact/Contact.svelte";
  import Unauthorized from './pages/Unauthorized/Unauthorized.svelte';

  onMount(async () => {
      await checkSession();
  });

</script>



<main>
  <Header />
  <Router>
    <Route path="/" component={Home} />
    <Route path="/User">
      <PrivateRouteGuard>
        <User />
      </PrivateRouteGuard>
    </Route>
    <Route path="/Jobs">
      <PrivateRouteGuard>
        <Jobs />
      </PrivateRouteGuard>
    </Route>
    <Route path="/Contact">
      <PrivateRouteGuard>
        <Contact />
      </PrivateRouteGuard>
    </Route>
    <Route path="/Unauthorized" component={Unauthorized} />
  </Router>
  <Footer />
</main>
import "../styles/globals.css";
import "primereact/resources/themes/tailwind-light/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css"; // primeflex
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const showNavbar =
    router.pathname !== "/login" && router.pathname !== "/signup";

  return (
    <div suppressHydrationWarning>
      {showNavbar && <Navbar />}
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

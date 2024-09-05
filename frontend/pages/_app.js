// frontend/pages/_app.js
import Link from 'next/link';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <nav>
        <Link href="/login">Login</Link> |
        <Link href="/register">Register</Link> |
        <Link href="/viewlogs">View Logs</Link>
      </nav>
      <Component {...pageProps} />
    </>
  );
}
// import "@/styles/globals.css";
// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }

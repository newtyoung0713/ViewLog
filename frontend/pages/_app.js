// frontend/pages/_app.js
import Head from 'next/head';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track is user logging
  const [username, setUsername] = useState(''); // For display user name
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('username');
    if (token && user) {
      setIsLoggedIn(true);
      setUsername(user.split('@')[0]);
    }
  }, [isLoggedIn, username]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    router.push('/');
  };

  const hideNavbar = router.pathname === '/login' || router.pathname === '/register';

  return (
    <>
      <Head>
        <title>ViewLog</title>
        <meta name='description' content='This is a website to record the log for the user' />
      </Head>
      {!hideNavbar && (
      <nav>
        {isLoggedIn ? (
          <>
            <span>Welcome, {username || 'User'}!</span> <button href="#" onClick={handleLogout}>Log out</button>
            <br /><Link href="/newRecord">Add a record</Link>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link> | <Link href="/register">Register</Link>
          </>
        )}
      </nav>
      )}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
// import "@/styles/globals.css";
// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }

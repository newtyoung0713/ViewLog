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
          <div className='welcome-container'>
            <h4>Welcome, {username.charAt(0).toUpperCase() + username.slice(1)}!</h4>
            <a className='logout-link' href="#" onClick={handleLogout}>Log out</a>
          </div>
        ) : (
          <>
            <Link href="/login">Login</Link> | <Link href="/register">Register</Link>
          </>
        )}
      </nav>
      )}
      <Component {...pageProps} />

      {/* Using CSS-in-JS */}
      <style jsx>{`
        .welcome-container {
          position: absolute;
          top: -10px;
          right: 20px;
          display: flex;
          align-items: center;
        }
        .welcome-container h4 {
          margin-right: 10px;
        }
        .logout-link {
          color: #f44336;
          text-decoration: none;
          cursor: pointer;
          font-weight: bold;
        }
        .logout-link:hover {
          color: #d32f2f;
        }
      `}</style>
    </>
  );
}

export default MyApp;
// import "@/styles/globals.css";
// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }

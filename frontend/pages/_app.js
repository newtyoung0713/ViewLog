// frontend/pages/_app.js
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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    router.push('/login');
  };

  const hideNavbar = router.pathname === '/login' || router.pathname === '/register';

  return (
    <div>
      {!hideNavbar && (
        <nav>
          {isLoggedIn ? (
            <>
              <span>Welcome, {username || 'User'}!</span> | <button href="#" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link> | <Link href="/register">Register</Link>
            </>
          )}
        </nav>
      )}
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
// import "@/styles/globals.css";
// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }

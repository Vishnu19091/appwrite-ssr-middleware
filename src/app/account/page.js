"use client";
// src/app/account/page.jsx
import { signOut } from "@/lib/server/appwrite";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [user, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define an asynchronous function to fetch the data
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        console.log(jsonData);
        setUsers(jsonData);
        setError(null);
      } catch (err) {
        setError(err.message);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Call the function inside useEffect
    fetchData();
  }, []); // The empty dependency array [] makes this run only on mount

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <ul>
        <li>
          <strong>Email:</strong> {user.email}
        </li>
        <li>
          <strong>Name:</strong> {user.name}
        </li>
        <li>
          <strong>ID:</strong> {user.$id}
        </li>
      </ul>

      <form action={signOut}>
        <button type="submit">Sign out</button>
      </form>
    </>
  );
}

import { useEffect, useState } from "react";
import { User } from "../types";

export default function useFetchUser() {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user");
        const json: User = await response.json();
        setUser(json);
      } catch (err) {
        const error: any = err;
        setError(error);
        console.log(error.toString());
      }
    };
    fetchData();
  }, []);

  return { user, error };
}

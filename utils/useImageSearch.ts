import { useEffect, useState } from "react";

interface Results {
  title: string;
  src: string;
  href: string;
  source: string;
}

type Query = {
  query?: string;
  nonce?: number;
};

export default function useImageSearch({ query, nonce }: Query) {
  const [results, setResults] = useState<Results[]>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query !== undefined) {
      const search = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/search?q=${query}&tbm=isch`);
          if (response.ok) {
            const json = (await response.json()) as Results[];
            setLoading(false);
            setResults(json);
          } else {
            const error = {
              code: response.status,
              message: response.statusText,
            };
            setLoading(false);
            setError(error);
          }
        } catch (err) {
          const error: any = err;
          setLoading(false);
          setError(error);
          console.log(error.toString());
        }
      };
      search();
    }
  }, [nonce]);

  return { results, error, loading };
}

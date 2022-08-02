import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Map: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("https://map.anselbrandt.dev");
  }, [router]);
  return null;
};

export default Map;

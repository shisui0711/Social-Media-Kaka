import { useEffect, useState } from "react";

export const useMediaQuery = () => {
  const [sm, setSm] = useState(false);
  const [md, setMd] = useState(false);
  const [lg, setLg] = useState(false);
  const [xl, setXl] = useState(false);
  const [xxl, setXxl] = useState(false);

  useEffect(() => {
    // I write this into a function for better visibility
    const handleSm = (e: MediaQueryListEvent) => {
      setSm(e.matches);
    };

    const handleMd = (e: MediaQueryListEvent) => {
      setMd(e.matches);
    };

    const handleLg = (e: MediaQueryListEvent) => {
      setLg(e.matches);
    };

    const handleXl = (e: MediaQueryListEvent) => {
      setXl(e.matches);
    };

    const handleXxl = (e: MediaQueryListEvent) => {
      setXxl(e.matches);
    };

    const smQuery = window.matchMedia("(min-width: 640px)");
    setSm(smQuery.matches);
    const mdQuery = window.matchMedia("(min-width: 768px)");
    setMd(mdQuery.matches);
    const lgQuery = window.matchMedia("(min-width: 1024px)");
    setLg(lgQuery.matches);
    const xlQuery = window.matchMedia("(min-width: 1280px)");
    setXl(xlQuery.matches);
    const xxlQuery = window.matchMedia("(min-width: 1536px)");
    setXxl(xxlQuery.matches);

    smQuery.addEventListener("change", handleSm);
    mdQuery.addEventListener("change", handleMd);
    lgQuery.addEventListener("change", handleLg);
    xlQuery.addEventListener("change", handleXl);
    xxlQuery.addEventListener("change", handleXxl);

    // Clean up the event listener when the component unmounts
    return () => {
      smQuery.removeEventListener("change", handleSm);
      mdQuery.removeEventListener("change", handleMd);
      lgQuery.removeEventListener("change", handleLg);
      xlQuery.removeEventListener("change", handleXl);
      xxlQuery.removeEventListener("change", handleXxl);
    };
  }, []);

  return {
    sm,
    md,
    lg,
    xl,
    xxl,
  };
};

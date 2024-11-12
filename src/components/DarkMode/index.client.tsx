"use client";
import { useState } from "react";
import Image from "next/image";

enum Mode {
  LIGHT = 'light',
  DARK = 'dark' 
}

const DarkModeSwitch = () => {
  const [mode, setMode] = useState(Mode.LIGHT);

  const src = `/icons/${mode}-mode.svg`;
  const onClick = () => {
    if (localStorage.theme === Mode.LIGHT) {
      document.documentElement.classList.add(Mode.DARK);
      localStorage.theme = Mode.DARK;
      setMode(Mode.LIGHT);
    } else {
      document.documentElement.classList.remove(Mode.DARK);
      localStorage.theme = Mode.LIGHT;
      setMode(Mode.DARK);
    }
  };

  return (
    <button onClick={onClick}>
      <Image src={src} width={20} height={20} alt="mode-icon" priority/>
    </button>
  );
};

export default DarkModeSwitch;

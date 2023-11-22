/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import InputField from "./components/InputField";
import Button from "./components/Button";
import useSound from "use-sound";
import beepSound from "./sounds/beep.mp3";

const appStyle = css`
  text-align: center;
  margin-top: 50px;
`;

const errorStyle = css`
  color: red;
  margin-top: 20px;
`;

const App = () => {
  const [minutes, setMinutes] = useState<string>("0");
  const [seconds, setSeconds] = useState<string>("0");
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // useSoundフックでサウンドをセットアップ
  const [play] = useSound(beepSound, { volume: 0.5 });

  useEffect(() => {
    let id: NodeJS.Timeout | null = null;
    if (isActive && totalSeconds > 0) {
      id = setIntervalId(() => {
        setTotalSeconds((seconds) => seconds - 1);
      }, 1000);
      setIntervalId(id);
    } else if (totalSeconds === 0 && isActive) {
      clearInterval(intervalId as NodeJS.Timeout);
      play();
      setIsActive(false);
    }
    return () => {
      if (id) clearInterval(id);
    };
  }, [isActive, totalSeconds]);

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  const handleStart = () => {
    const totalSec = parseInt(minutes) * 60 + parseInt(seconds);
    if (!isNaN(totalSec) && totalSec >= 0) {
      setTotalSeconds(totalSec);
      setIsActive(true);
      setErrorMessage(null);
    } else {
      setErrorMessage("Invalid time input!");
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTotalSeconds(parseInt(minutes) * 60 + parseInt(seconds));
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinutes(e.target.value);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeconds(e.target.value);
  };

  return (
    <div css={appStyle}>
      <h1>Timer App</h1>
      {errorMessage && <div css={errorStyle}>{errorMessage}</div>}
      <InputField
        label="Minutes:"
        value={minutes}
        onChange={handleMinutesChange}
      />
      <InputField
        label="Seconds:"
        value={seconds}
        onChange={handleSecondsChange}
      />
      <Button onClick={handleStart} disabled={isActive} text="Start" />
      <Button
        onClick={toggleActive}
        disabled={!isActive && totalSeconds === 0}
        text={isActive ? "Pause" : "Resume"}
      />
      <Button
        onClick={handleReset}
        disabled={!isActive && totalSeconds === 0}
        text="Reset"
      />
      <h2>
        Time Remaining: {Math.floor(totalSeconds / 60)}:
        {totalSeconds % 60 < 10 ? `0${totalSeconds % 60}` : totalSeconds % 60}
      </h2>
    </div>
  );
};

export default App;

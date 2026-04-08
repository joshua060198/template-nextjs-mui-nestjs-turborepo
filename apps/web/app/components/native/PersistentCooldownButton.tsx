import { Button, ButtonProps } from "@mui/material";
import { MouseEventHandler, useEffect, useRef, useState } from "react";

type PersistentCooldownButtonProps = ButtonProps & {
  waitTime?: number;
  savedKey: string;
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function PersistentCooldownButton({
  waitTime = 5000,
  savedKey,
  children,
  onClick,
  ...props
}: PersistentCooldownButtonProps) {
  const [countdown, setCountdown] = useState(() => {
    const storedCooldown = localStorage.getItem(savedKey);
    if (!storedCooldown) return 0;

    const remainingMs = Number(storedCooldown) - Date.now();
    return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
  });

  const [isDisabled, setIsDisabled] = useState(() => countdown > 0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (countdown <= 0) return;

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsDisabled(false);
          localStorage.removeItem(savedKey);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [countdown, savedKey]);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (intervalRef.current) return;

    const cooldownUntil = Date.now() + waitTime;
    localStorage.setItem(savedKey, cooldownUntil.toString());

    setIsDisabled(true);
    setCountdown(Math.ceil(waitTime / 1000));

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsDisabled(false);
          localStorage.removeItem(savedKey);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    onClick?.(e);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled}
      {...props}
      sx={{ display: "flex", flexDirection: "column", ...props.sx }}
    >
      <span>{children ? children : ""}</span>
      <span>
        {`${isDisabled ? "Resend in" : ""} ${countdown > 0 ? formatTime(countdown) : ""}`}
      </span>
    </Button>
  );
}

export default PersistentCooldownButton;

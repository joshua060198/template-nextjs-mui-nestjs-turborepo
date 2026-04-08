import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Image from "next/image";

export default function GlobalLoadingComponent() {
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Image
        loading="eager"
        src="/logo.png"
        alt="logo"
        width={319}
        height={92}
      />
      <CircularProgress size={64} sx={{ mt: 2 }} />
    </Box>
  );
}

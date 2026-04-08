import Box from "@mui/material/Box";
import Image from "next/image";

export default function SidebarLogoComponent() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
      <Image
        loading="eager"
        src="/logo.png"
        alt="logo"
        width={198}
        height={60}
      />
    </Box>
  );
}

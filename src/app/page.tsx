import { Box } from "@mui/material";

import HomeProjectsSection from "./_components/home/HomeProjectsSection";

export default function HomePage() {
  return (
    <Box
      component="section"
      sx={{
        mx: "auto",
        width: "100%",
        maxWidth: "1200px",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
      }}
    >
      <HomeProjectsSection />
    </Box>
  );
}

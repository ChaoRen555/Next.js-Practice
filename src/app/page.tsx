import { Box, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Box
      component="section"
      sx={{
        mx: "auto",
        display: "flex",
        minHeight: "60vh",
        width: "100%",
        maxWidth: "1200px",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3 },
        py: { xs: 6, sm: 8 },
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "2rem", sm: "3rem" },
          fontWeight: 600,
          color: "#273432",
        }}
      >
        Welcome
      </Typography>
    </Box>
  );
}

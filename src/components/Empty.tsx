import { Box, Typography } from "@mui/material";

const Empty = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="background.default"
    >
      <Typography variant="h6" color="textSecondary">
        No content available
      </Typography>
    </Box>
  );
};

export default Empty;

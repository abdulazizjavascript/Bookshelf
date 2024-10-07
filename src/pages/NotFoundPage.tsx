import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{ textAlign: "center", marginTop: "100px" }}
    >
      <Box>
        <Typography variant="h1" component="div" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="div" gutterBottom>
          Oops! Page not found
        </Typography>
        <Typography variant="body1" component="div" gutterBottom>
          Sorry, the page you are looking for does not exist.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBackToHome}
          sx={{ marginTop: "20px" }}
        >
          Back to Register
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;

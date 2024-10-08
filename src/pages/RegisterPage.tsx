import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { LoadingButton } from "@mui/lab";
import { TextField, Container, Box, Typography } from "@mui/material";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import SendIcon from "@mui/icons-material/Send";

import useAuth from "../hooks/useAuth";
import { User } from "../types";

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      setLoading(true);
      await registerUser(data, navigate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Box textAlign="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Register
          </Typography>
          <LockPersonIcon sx={{ fontSize: 40, marginBottom: 3 }} />
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Name"
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name ? errors.name.message : ""}
          />

          <TextField
            label="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
            })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ""}
          />

          <LoadingButton
            endIcon={<SendIcon />}
            loading={loading}
            type="submit"
            variant="contained"
            color="primary"
          >
            Register
          </LoadingButton>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;

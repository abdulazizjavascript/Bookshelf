import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

import { LoadingButton } from "@mui/lab";
import { TextField, Container, Box, Typography } from "@mui/material";

import useAuth from "../hooks/useAuth";
import { User } from "../types";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      setLoading(true);
      registerUser(data, navigate);
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
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Register
        </Typography>

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
            loading={loading}
            type="submit"
            variant="contained"
            color="primary"
          >
            Submit
          </LoadingButton>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;

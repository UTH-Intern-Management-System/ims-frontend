import React from 'react';
import { TextField, Button, Container } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { register } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    register({
      email: data.get('email'),
      password: data.get('password')
    });
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <TextField label="Email" name="email" fullWidth margin="normal" />
        <TextField label="Password" name="password" type="password" fullWidth margin="normal" />
        <Button type="submit" variant="contained" fullWidth>
          Register
        </Button>
      </form>
    </Container>
  );
};

export default Register;
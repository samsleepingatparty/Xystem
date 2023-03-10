import React, { useState } from "react";
import "./Register.css";
import { auth, provider } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import { useAuthValue } from "../../../context/AuthContext";
import { Heading, Input, Button, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setTimeActive } = useAuthValue();

  const validatePassword = () => {
    let isValid = true;
    if (password !== "" && confirmPassword !== "") {
      if (password !== confirmPassword) {
        isValid = false;
        setError("Passwords does not match");
      }
    }
    return isValid;
  };

  const registerWithEmailAndPassword = () => {
    setIsLoading(true);
    // Create a new user with email and password using firebase
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        sendEmailVerification(auth.currentUser)
          .then(() => {
            setTimeActive(true);
            navigate("/verify-email");
          })
          .catch((err) => alert(err.message));
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  const registerWithGoogle = () => {
    setIsLoading(true);
    signInWithPopup(auth, provider)
      .then(() => {
        navigate("/profile");
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  const register = (e) => {
    e.preventDefault();
    setError("");
    if (validatePassword()) {
      registerWithEmailAndPassword();
    }
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="center">
      <motion.div
        className="auth"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Heading as={"h1"} marginBottom={"10px"}>
          Register
        </Heading>
        {error && <div className="auth__error">{error}</div>}
        <form onSubmit={register} name="registration_form">
          <Input
            variant="flushed"
            type="email"
            value={email}
            color="whiteAlpha.500"
            placeholder="Enter your email"
            _placeholder={{ color: "inherit" }}
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            variant="flushed"
            type="password"
            value={password}
            required
            color="whiteAlpha.500"
            placeholder="Enter your password"
            _placeholder={{ color: "inherit" }}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            variant="flushed"
            type="password"
            value={confirmPassword}
            required
            color="whiteAlpha.500"
            placeholder="Confirm password"
            _placeholder={{ color: "inherit" }}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            type="submit"
            colorScheme="blue"
            loadingText="Please wait..."
            onClick={register}
            isLoading={isLoading}
          >
            Register
          </Button>
          <Text color="white.500" fontSize="sm" fontWeight="bold">
            OR
          </Text>
          <Button
            colorScheme="red"
            onClick={registerWithGoogle}
            isLoading={isLoading}
          >
            Register with Google
          </Button>
        </form>
        <p>
          Already have an account?{" "}
          <Link to="/login" className="link">
            <Text
              fontWeight="bold"
              color="red.400"
              _hover={{
                color: "blue.400",
                transition: "0.5s ease-out",
              }}
            >
              Login
            </Text>
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;

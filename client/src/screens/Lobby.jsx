import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import { useSocket } from "../context/SocketProvider";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();
  const location = useLocation(); // Add this to access URL parameters

  // Add this useEffect to read URL parameters when component mounts
  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    const userIdParam = params.get("userId");

    // Set email if provided in URL
    if (emailParam) {
      setEmail(emailParam);
    }

    // Set room if userId is provided (optional)
    if (userIdParam) {
      setRoom(userIdParam); // or any logic to create room from userId
    }
  }, [location]);

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Lobby
        </Typography>
        <form onSubmit={handleSubmitForm}>
          <TextField
            fullWidth
            label="Email ID"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Room Number"
            variant="outlined"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Join
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LobbyScreen;

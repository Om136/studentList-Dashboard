import { useState } from "react";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { StudentList } from "./components/StudentList";
import { AddStudentForm } from "./components/AddStudentForm";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";

const Header = () => {
  const { user, signIn, signOut, signingIn } = useAuth();

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Student Dashboard
        </Typography>
        {user ? (
          <Button color="inherit" onClick={signOut} disabled={signingIn}>
            Sign Out
          </Button>
        ) : (
          <Button color="inherit" onClick={signIn} disabled={signingIn}>
            {signingIn ? "Signing In..." : "Sign In"}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

const AppContent = () => {
  const { loading } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0); // Key to trigger refresh

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Header />
      <AddStudentForm
        onStudentAdded={() => setRefreshKey((prev) => prev + 1)}
      />
      <StudentList key={refreshKey} />
    </Container>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Avatar,
} from "@mui/material";
import { Grid } from "@mui/material";
import type { StudentFormData } from "../types/student";
import { api } from "../services/mockApi";
import { useAuth } from "../hooks/useAuth";

export const AddStudentForm = () => {
  const { user, signIn, signingIn, error: authError, clearError } = useAuth();
  const [formData, setFormData] = useState<StudentFormData>({
    name: "",
    email: "",
    course: "",
    photoUrl: "https://placehold.co/150",
    phoneNumber: "",
    address: "",
    gpa: 0.0,
    status: "active",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please sign in to add a student");
      return;
    }

    // Validate GPA
    const gpa = Number(formData.gpa);
    if (isNaN(gpa) || gpa < 0 || gpa > 10.0) {
      setError("GPA must be between 0.0 and 10.0");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.addStudent(formData);
      setSuccess("Student added successfully!");
      setFormData({
        name: "",
        email: "",
        course: "",
        photoUrl: "https://placehold.co/150",
        phoneNumber: "",
        address: "",
        gpa: 0.0,
        status: "active",
      });
      setError("");
    } catch {
      setError("Failed to add student");
      setSuccess("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "gpa" ? Number(value) : value,
    }));
  };

  if (!user) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Sign in to Add Students
          </Typography>
          {authError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
              {authError}
            </Alert>
          )}
          <Button
            variant="contained"
            onClick={signIn}
            disabled={signingIn}
            sx={{ position: "relative" }}
          >
            {signingIn ? (
              <>
                Signing In...
                <CircularProgress
                  size={24}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              </>
            ) : (
              "Sign In with Google"
            )}
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Student
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            {/* Photo Section */}
            <Grid sx={{ gridColumn: { xs: "1/-1", md: "1/span 4" } }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar
                  src={formData.photoUrl}
                  sx={{ width: 120, height: 120 }}
                />
                <TextField
                  name="photoUrl"
                  label="Photo URL"
                  value={formData.photoUrl}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  disabled={isSubmitting}
                />
              </Box>
            </Grid>

            {/* Main Information Section */}
            <Grid sx={{ gridColumn: { xs: "1/-1", md: "5/span 8" } }}>
              <Grid container spacing={2}>
                {/* Personal Information */}
                <Grid sx={{ gridColumn: { xs: "1/-1", sm: "1/span 6" } }}>
                  <TextField
                    name="name"
                    label="Name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid sx={{ gridColumn: { xs: "1/-1", sm: "7/span 6" } }}>
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid sx={{ gridColumn: { xs: "1/-1", sm: "1/span 6" } }}>
                  <TextField
                    name="phoneNumber"
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                    required
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid sx={{ gridColumn: { xs: "1/-1", sm: "7/span 6" } }}>
                  <TextField
                    name="course"
                    label="Course"
                    value={formData.course}
                    onChange={handleChange}
                    fullWidth
                    required
                    disabled={isSubmitting}
                  />
                </Grid>

                {/* Academic Information */}
                <Grid sx={{ gridColumn: { xs: "1/-1", sm: "1/span 6" } }}>
                  <TextField
                    name="gpa"
                    label="GPA"
                    type="number"
                    value={formData.gpa}
                    onChange={handleChange}
                    fullWidth
                    required
                    disabled={isSubmitting}
                    inputProps={{ min: 0, max: 10, step: 0.1 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">/10.0</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid sx={{ gridColumn: { xs: "1/-1", sm: "7/span 6" } }}>
                  <TextField
                    name="status"
                    label="Status"
                    value={formData.status}
                    onChange={handleChange}
                    select
                    fullWidth
                    required
                    disabled={isSubmitting}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </TextField>
                </Grid>

                {/* Address */}
                <Grid sx={{ gridColumn: { xs: "1/-1", sm: "1/span 12" } }}>
                  <TextField
                    name="address"
                    label="Address"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                    required
                    disabled={isSubmitting}
                    multiline
                    rows={1}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "background.paper",
                        height: "56px", // Standard height of a single-line Material-UI TextField
                        "& textarea": {
                          height: "24px !important", // Adjust textarea height to fit within the input
                          overflow: "auto !important", // Allow scrolling if content is too long
                          paddingTop: "16px !important", // Adjust to center vertically
                          paddingBottom: "16px !important", // Adjust to center vertically
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 3 }}>
            {success}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, position: "relative" }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              Adding Student...
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            </>
          ) : (
            "Add Student"
          )}
        </Button>
      </form>
    </Paper>
  );
};

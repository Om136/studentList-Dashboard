import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Box,
  Avatar,
  MenuItem,
  InputAdornment,
  Grid,
} from "@mui/material";
import type { Student, StudentFormData } from "../types/student";

interface EditStudentDialogProps {
  student: Student | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<StudentFormData>) => Promise<void>;
}

export const EditStudentDialog = ({
  student,
  open,
  onClose,
  onSave,
}: EditStudentDialogProps) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        course: student.course,
        photoUrl: student.photoUrl,
        phoneNumber: student.phoneNumber,
        address: student.address,
        gpa: student.gpa,
        status: student.status,
      });
    }
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "gpa" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    // Validate GPA
    const gpa = Number(formData.gpa);
    if (isNaN(gpa) || gpa < 0 || gpa > 10.0) {
      setError("GPA must be between 0.0 and 10.0");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await onSave(student.id, formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update student");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          <Box sx={{ flexGrow: 1, mt: 2 }}>
            <Grid container spacing={2}>
              <Box
                component={Grid}
                sx={{ gridColumn: { xs: "1 / -1", sm: "1 / span 6" } }}
              >
                <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                  <Avatar
                    src={formData.photoUrl}
                    sx={{ width: 100, height: 100 }}
                  />
                </Box>
                <TextField
                  name="photoUrl"
                  label="Photo URL"
                  value={formData.photoUrl}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  disabled={isSubmitting}
                />
              </Box>
              <Box
                component={Grid}
                sx={{ gridColumn: { xs: "1 / -1", sm: "7 / span 6" } }}
              >
                <TextField
                  name="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  disabled={isSubmitting}
                />
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  disabled={isSubmitting}
                />
              </Box>
              <Box
                component={Grid}
                sx={{ gridColumn: { xs: "1 / -1", sm: "1 / span 6" } }}
              >
                <TextField
                  name="phoneNumber"
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  disabled={isSubmitting}
                />
                <TextField
                  name="course"
                  label="Course"
                  value={formData.course}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  disabled={isSubmitting}
                />
              </Box>
              <Box
                component={Grid}
                sx={{ gridColumn: { xs: "1 / -1", sm: "7 / span 6" } }}
              >
                <TextField
                  name="address"
                  label="Address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  disabled={isSubmitting}
                  multiline
                  rows={2}
                />
                <TextField
                  name="gpa"
                  label="GPA"
                  type="number"
                  value={formData.gpa}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  disabled={isSubmitting}
                  inputProps={{ min: 0, max: 10.0, step: 0.1 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">/10.0</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  name="status"
                  label="Status"
                  value={formData.status}
                  onChange={handleChange}
                  select
                  fullWidth
                  required
                  margin="normal"
                  disabled={isSubmitting}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>
              </Box>
            </Grid>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? <CircularProgress size={20} /> : undefined
            }
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

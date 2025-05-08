import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  TableSortLabel,
  Menu,
  Chip,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FilterListIcon from "@mui/icons-material/FilterList";
import type { Student } from "../types/student";
import { api } from "../services/mockApi";
import { EditStudentDialog } from "./EditStudentDialog";
import { UserAvatar } from "./UserAvatar";

type SortField =
  | "name"
  | "email"
  | "course"
  | "enrollmentDate"
  | "gpa"
  | "status";
type SortOrder = "asc" | "desc";

export const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );

  // Sorting and filtering states
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    course: "",
    dateFrom: "",
    dateTo: "",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch students
  useEffect(() => {
    fetchStudents();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...students];

    // Apply filters
    if (filters.name) {
      result = result.filter((s) =>
        s.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.email) {
      result = result.filter((s) =>
        s.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    if (filters.course) {
      result = result.filter((s) =>
        s.course.toLowerCase().includes(filters.course.toLowerCase())
      );
    }
    if (filters.dateFrom) {
      result = result.filter((s) => s.enrollmentDate >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter((s) => s.enrollmentDate <= filters.dateTo);
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredStudents(result);
  }, [students, filters, sortField, sortOrder]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await api.getStudents();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    setSortOrder((current) => {
      if (sortField !== field) return "asc";
      return current === "asc" ? "desc" : "asc";
    });
    setSortField(field);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      if (selectedStudents.length === 1) {
        await api.deleteStudent(selectedStudents[0]);
      } else {
        await api.deleteMultipleStudents(selectedStudents);
      }
      await fetchStudents();
      setSelectedStudents([]);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: string, data: Partial<Student>) => {
    try {
      setLoading(true);
      await api.updateStudent(id, data);
      await fetchStudents();
      setEditStudent(null);
    } catch (error) {
      console.error("Failed to update student:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const csvContent = await api.exportToCSV();
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "students.csv";
      link.click();
    } catch (error) {
      console.error("Failed to export CSV:", error);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (id: string) => {
    setSelectedStudents((current) => {
      if (current.includes(id)) {
        return current.filter((studentId) => studentId !== id);
      }
      return [...current, id];
    });
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "success" : "error";
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderTableHeader = () => (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selectedStudents.length === filteredStudents.length}
            indeterminate={
              selectedStudents.length > 0 &&
              selectedStudents.length < filteredStudents.length
            }
            onChange={handleSelectAll}
          />
        </TableCell>
        <TableCell>
          <TableSortLabel
            active={sortField === "name"}
            direction={sortField === "name" ? sortOrder : "asc"}
            onClick={() => handleSort("name")}
          >
            Student
          </TableSortLabel>
        </TableCell>
        <TableCell>
          <TableSortLabel
            active={sortField === "email"}
            direction={sortField === "email" ? sortOrder : "asc"}
            onClick={() => handleSort("email")}
          >
            Contact Info
          </TableSortLabel>
        </TableCell>
        <TableCell>
          <TableSortLabel
            active={sortField === "course"}
            direction={sortField === "course" ? sortOrder : "asc"}
            onClick={() => handleSort("course")}
          >
            Course
          </TableSortLabel>
        </TableCell>
        <TableCell>
          <TableSortLabel
            active={sortField === "gpa"}
            direction={sortField === "gpa" ? sortOrder : "asc"}
            onClick={() => handleSort("gpa")}
          >
            GPA
          </TableSortLabel>
        </TableCell>
        <TableCell>
          <TableSortLabel
            active={sortField === "status"}
            direction={sortField === "status" ? sortOrder : "asc"}
            onClick={() => handleSort("status")}
          >
            Status
          </TableSortLabel>
        </TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );

  return (
    <Box>
      <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          disabled={selectedStudents.length === 0}
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete Selected
        </Button>
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={handleExportCSV}
        >
          Export CSV
        </Button>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={(e) => setFilterAnchorEl(e.currentTarget)}
        >
          Filters
        </Button>
      </Box>

      {isMobile ? (
        <Stack spacing={2}>
          {filteredStudents.map((student) => (
            <Card key={student.id}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Avatar sx={{ width: 60, height: 60 }} />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {student.name}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {student.email}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {student.phoneNumber}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {student.address}
                      </Typography>
                      <Typography color="textSecondary">
                        Course: {student.course}
                      </Typography>
                      <Typography color="textSecondary">
                        GPA: {student.gpa?.toFixed(2) ?? "N/A"}/10.0
                      </Typography>
                      <Typography color="textSecondary">
                        Enrolled: {student.enrollmentDate}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={student.status}
                          color={getStatusColor(student.status)}
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton onClick={() => setEditStudent(student)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedStudents([student.id]);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            {renderTableHeader()}
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <UserAvatar name={student.name} size={40} />
                      <Typography variant="body1">{student.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{student.email}</Typography>
                    <Typography variant="body2">
                      {student.phoneNumber}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {student.address}
                    </Typography>
                  </TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>{student.gpa?.toFixed(2) ?? "N/A"}/10.0</TableCell>
                  <TableCell>
                    <Chip
                      label={student.status}
                      color={getStatusColor(student.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => setEditStudent(student)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => {
                          setSelectedStudents([student.id]);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {filteredStudents.length === 0 && !loading && (
        <Box sx={{ textAlign: "center", p: 3 }}>
          <Typography color="textSecondary">No students found</Typography>
        </Box>
      )}

      <EditStudentDialog
        student={editStudent}
        open={editStudent !== null}
        onClose={() => setEditStudent(null)}
        onSave={handleEdit}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            {selectedStudents.length === 1
              ? "this student"
              : `these ${selectedStudents.length} students`}
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
        PaperProps={{
          sx: { width: 300, p: 2 },
        }}
      >
        <Stack spacing={2}>
          <TextField
            label="Name"
            value={filters.name}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, name: e.target.value }))
            }
            size="small"
          />
          <TextField
            label="Email"
            value={filters.email}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, email: e.target.value }))
            }
            size="small"
          />
          <TextField
            label="Course"
            value={filters.course}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, course: e.target.value }))
            }
            size="small"
          />
          <TextField
            label="From Date"
            type="date"
            value={filters.dateFrom}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
            }
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="To Date"
            type="date"
            value={filters.dateTo}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
            }
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <Button
            variant="outlined"
            onClick={() => {
              setFilters({
                name: "",
                email: "",
                course: "",
                dateFrom: "",
                dateTo: "",
              });
              setFilterAnchorEl(null);
            }}
          >
            Clear Filters
          </Button>
        </Stack>
      </Menu>
    </Box>
  );
};

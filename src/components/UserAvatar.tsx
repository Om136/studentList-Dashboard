import { Avatar } from "@mui/material";

interface UserAvatarProps {
  name: string;
  size?: number;
}

export const UserAvatar = ({ name, size = 40 }: UserAvatarProps) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar sx={{ width: size, height: size, bgcolor: "#1976d2" }}>
      {initials}
    </Avatar>
  );
};

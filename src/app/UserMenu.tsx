"use client";

import { useState, type MouseEvent } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";

import { logoutAction } from "./actions/authActions";

type UserMenuProps = {
  email?: string | null;
  image?: string | null;
  name?: string | null;
};

const getAvatarFallback = (name?: string | null, email?: string | null) => {
  const value = name?.trim() || email?.trim() || "Signed in";

  return value.charAt(0).toUpperCase();
};

const UserMenu = ({ name, email, image }: UserMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const menuOpen = Boolean(anchorEl);
  const displayName = name?.trim() || "Signed in";
  const avatarFallback = getAvatarFallback(name, email);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-controls={menuOpen ? "user-menu" : undefined}
        aria-expanded={menuOpen ? "true" : undefined}
        aria-haspopup="menu"
        className="flex cursor-pointer items-center gap-3 rounded-full border border-white/45 bg-white/35 px-2 py-1.5 pr-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition duration-300 hover:border-white/70 hover:bg-white/55"
      >
        <Avatar
          src={image ?? undefined}
          alt={displayName}
          sx={{
            width: 40,
            height: 40,
            border: "1px solid rgba(255,255,255,0.7)",
            bgcolor: "#6d867d",
            color: "#ffffff",
            fontFamily: "inherit",
            fontSize: "0.95rem",
            fontWeight: 700,
            boxShadow: "0 12px 30px -18px rgba(95,121,113,0.55)",
          }}
        >
          {avatarFallback}
        </Avatar>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-[#31403d]">
            {displayName}
          </span>
        </span>
      </button>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              minWidth: 220,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.72)",
              borderRadius: "20px",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(245,248,246,0.94) 100%)",
              boxShadow: "0 28px 80px -36px rgba(95,121,113,0.42)",
              backdropFilter: "blur(18px)",
            },
          },
          list: {
            sx: {
              p: 0,
            },
          },
        }}
      >
        <Box sx={{ px: 2.25, py: 1.75 }}>
          <Typography
            sx={{
              color: "#31403d",
              fontSize: "0.98rem",
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            {displayName}
          </Typography>

          {email ? (
            <Typography
              sx={{
                mt: 0.75,
                color: "#31403d",
                fontSize: "0.95rem",
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              {email}
            </Typography>
          ) : null}
        </Box>

        <Box sx={{ px: 1.25, pb: 1.25 }}>
          <Box component="form" action={logoutAction} onSubmit={handleClose}>
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center rounded-2xl border border-[#c9d6d0] bg-white/82 px-4 py-3 text-sm font-medium text-[#41534f] transition duration-300 hover:border-white hover:bg-white"
            >
              Logout
            </button>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

export default UserMenu;

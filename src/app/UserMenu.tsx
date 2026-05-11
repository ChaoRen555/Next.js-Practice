"use client";

import Link from "next/link";
import type { UserRole } from "@prisma/client";
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
  role?: UserRole;
};

const getAvatarFallback = (name?: string | null, email?: string | null) => {
  const value = name?.trim() || email?.trim() || "Signed in";

  return value.charAt(0).toUpperCase();
};

const UserMenu = ({ name, email, image, role }: UserMenuProps) => {
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
        className="flex cursor-pointer items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-2 py-1.5 pr-4 text-left shadow-[inset_0_1px_0_var(--glass-highlight)] transition duration-300 hover:border-[var(--accent)] hover:bg-[var(--surface-hover)]"
      >
        <Avatar
          src={image ?? undefined}
          alt={displayName}
          sx={{
            width: 40,
            height: 40,
            border: "1px solid var(--line)",
            bgcolor: "var(--accent-strong)",
            color: "var(--on-accent)",
            fontFamily: "inherit",
            fontSize: "0.95rem",
            fontWeight: 700,
            boxShadow: "0 12px 30px -18px var(--nav-shadow)",
          }}
        >
          {avatarFallback}
        </Avatar>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-[var(--text)]">
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
              border: "1px solid var(--line)",
              borderRadius: "20px",
              background: "var(--surface-strong)",
              boxShadow: "0 28px 80px -36px var(--nav-shadow)",
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
              color: "var(--text)",
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
                color: "var(--text)",
                fontSize: "0.95rem",
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              {email}
            </Typography>
          ) : null}

          <Typography
            sx={{
              mt: 0.75,
              color: "var(--accent-strong)",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {role ?? "USER"}
          </Typography>
        </Box>

        <Box sx={{ px: 1.25, pb: 1.25 }}>
          <Link
            href="/profile"
            onClick={handleClose}
            className="mb-2 flex w-full cursor-pointer items-center justify-center rounded-2xl border border-transparent bg-[var(--surface-soft)] px-4 py-3 text-sm font-medium text-[var(--text)] transition duration-300 hover:border-[var(--line)] hover:bg-[var(--surface-hover)]"
          >
            Edit profile
          </Link>

          <Box component="form" action={logoutAction} onSubmit={handleClose}>
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center rounded-2xl border border-transparent bg-[var(--surface-soft)] px-4 py-3 text-sm font-medium text-[var(--text)] transition duration-300 hover:border-[var(--line)] hover:bg-[var(--surface-hover)]"
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

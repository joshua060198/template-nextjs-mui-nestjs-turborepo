"use client";
import { styled, ToggleButton, ToggleButtonProps } from "@mui/material";
import React from "react";

const IconToggleButton: React.FC<ToggleButtonProps> = styled(ToggleButton)(
  ({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    "& > svg": {
      marginRight: theme.spacing(0.85),
    },
    borderRadius: 12,
    textTransform: "none",
  }),
);
export default IconToggleButton;

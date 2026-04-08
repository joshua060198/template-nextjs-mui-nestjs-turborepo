"use client";
import { Button, IconButton, Modal, Paper, Typography } from "@mui/material";
import { AddIcon } from "@web/components/IconCollection";
import { useTranslations } from "next-intl";
import { type ComponentType, useState } from "react";

export interface AddFormProps {
  closeModal: () => void;
}

export interface TableAddProps {
  entityName: string;
  FormComponent: ComponentType<AddFormProps>;
}

export default function TableAdd({ entityName, FormComponent }: TableAddProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Global.Component.Table");

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <>
      <Modal
        open={open}
        onClose={(e, reason) => {
          if (reason === "escapeKeyDown") closeModal();
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          sx={{
            p: 3,
            width: {
              xs: "90vw",
              md: "80vw",
              lg: "70vw",
              xl: "55vw",
            },
            overflowY: "auto",
            maxHeight: "85vh",
          }}
        >
          <Typography
            align="center"
            sx={{ mb: 2 }}
            variant="h5"
            color="text.secondary"
          >
            {t("Add.Title", { name: entityName })}
          </Typography>
          <FormComponent closeModal={closeModal} />
        </Paper>
      </Modal>
      <IconButton
        color="secondary"
        sx={{ display: { xs: "inherit", sm: "none" } }}
        onClick={openModal}
      >
        <AddIcon />
      </IconButton>
      <Button
        sx={{ display: { xs: "none", sm: "inherit" } }}
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={openModal}
        color="secondary"
      >
        {t("Add.Button", { name: entityName })}
      </Button>
    </>
  );
}

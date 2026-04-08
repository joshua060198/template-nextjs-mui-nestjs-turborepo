import { IconButton, Modal, Paper, Tooltip, Typography } from "@mui/material";
import { EditIcon } from "@web/components/IconCollection";
import { useTranslations } from "next-intl";
import { type ComponentType, useState } from "react";

export interface EditFormProps<T> {
  closeModal: () => void;
  editedItem: T;
}

export interface TableEditProps<T> {
  entityName: string;
  FormComponent: ComponentType<EditFormProps<T>>;
  item: T;
}

export default function TableEdit<T>({
  entityName,
  FormComponent,
  item,
}: TableEditProps<T>) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Global.Component.Table");
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <>
      <Modal
        open={open}
        onClose={closeModal}
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
              md: "75vw",
              lg: "65vw",
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
            {t("Edit.Title", { name: entityName })}
          </Typography>
          <FormComponent closeModal={closeModal} editedItem={item} />
        </Paper>
      </Modal>
      <Tooltip title={t("Edit.Tooltip")}>
        <IconButton size="small" color="primary" onClick={openModal}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
}

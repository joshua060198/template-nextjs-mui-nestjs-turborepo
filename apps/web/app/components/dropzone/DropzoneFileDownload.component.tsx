"use client";
import { Typography } from "@mui/material";
import { FileId } from "@repo/common/entity/file.entity.type";
import { useDownloadFile } from "@web/libs/hooks/api/file.api.hooks";

interface DropzoneFileDownloadComponentProps {
  id: FileId;
  text: string;
}

export default function DropzoneFileDownloadComponent({
  id,
  text,
}: DropzoneFileDownloadComponentProps) {
  const downloadQuery = useDownloadFile(id);

  const handleDownload = async () => {
    const res = await downloadQuery.refetch();
    if (res.data?.url) {
      window.open(res.data.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Typography
      sx={{
        "&:hover": {
          textDecoration: "underline",
          color: (theme) => theme.palette.info.main,
          cursor: "pointer",
        },
      }}
      onClick={handleDownload}
    >
      {text}
    </Typography>
  );
}

import { LinkProps, Typography, TypographyProps } from "@mui/material";
import { Link as IntlLink } from "@web/i18n/navigation";

export default function Link(props: LinkProps & TypographyProps) {
  return (
    <Typography
      component={IntlLink}
      color="primary"
      fontWeight="bold"
      variant="body2"
      {...props}
    >
      {props.children}
    </Typography>
  );
}

import Box from "@mui/material/Box";
import PermissionTableComponent from "@web/components/page/admin/rbac/permission/PermissionTable.component";
import PageContentComponent from "@web/components/page/PageContent.component";
import PageHeaderComponent from "@web/components/page/PageHeader.component";

export default function RBACPermissionPage() {
  return (
    <Box>
      <PageHeaderComponent page="Admin.RBAC.Permission" />
      <PageContentComponent>
        <PermissionTableComponent />
      </PageContentComponent>
    </Box>
  );
}

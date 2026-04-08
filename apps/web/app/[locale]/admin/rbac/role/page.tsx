import Box from "@mui/material/Box";
import RoleTableComponent from "@web/components/page/admin/rbac/role/RoleTable.component";
import PageContentComponent from "@web/components/page/PageContent.component";
import PageHeaderComponent from "@web/components/page/PageHeader.component";

export default function RBACRolePage() {
  return (
    <Box>
      <PageHeaderComponent page="Admin.RBAC.Role" />
      <PageContentComponent>
        <RoleTableComponent />
      </PageContentComponent>
    </Box>
  );
}

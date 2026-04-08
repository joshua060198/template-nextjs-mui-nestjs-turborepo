import Box from "@mui/material/Box";
import UserManagementTableComponent from "@web/components/page/admin/rbac/user-management/UserManagementTable.component";
import PageContentComponent from "@web/components/page/PageContent.component";
import PageHeaderComponent from "@web/components/page/PageHeader.component";

export default function RBACUserManagementPage() {
  return (
    <Box>
      <PageHeaderComponent page="Admin.RBAC.UserManagement" />
      <PageContentComponent>
        <UserManagementTableComponent />
      </PageContentComponent>
    </Box>
  );
}

import { usePathname } from "@web/i18n/navigation";
import BreadcrumbsBuilderComponent from "@web/components/breadcrumbs/BreadcrumbsBuilder.component";

export default function BreadcrumbsWrapper() {
  const pathname = usePathname();
  return <BreadcrumbsBuilderComponent pathname={pathname} />;
}

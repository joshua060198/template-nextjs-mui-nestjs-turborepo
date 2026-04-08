import BreadcrumbsComponent from "@web/components/breadcrumbs/Breadcrumbs.component";

type BreadcrumbItem = {
  label: string;
  href: string;
};

type Props = {
  pathname: string;
  getLabelFromId?: (segment: string) => string;
};

export default function BreadcrumbsBuilderComponent({
  pathname,
  getLabelFromId,
}: Props) {
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");

    return {
      href,
      label: isId(segment)
        ? getLabelFromId
          ? getLabelFromId(segment)
          : "Details"
        : toTitle(segment),
    };
  });

  return <BreadcrumbsComponent items={breadcrumbs.slice(1)} />;
}

function toTitle(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function isId(segment: string) {
  return /^\d+$/.test(segment) || /^[0-9a-fA-F-]{36}$/.test(segment);
}

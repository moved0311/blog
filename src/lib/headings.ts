export type Heading = {
  id: string;
  level: 1 | 2;
  text: string;
};

export const slugifyHeading = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[`*_~[\]{}()<>]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

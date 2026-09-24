export type DocumentImage = {
  id: string;
  src: string;
  title: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type FileFact = { label: string; value: string };
export type FileLink = { title: string; href: string; role?: string };

export type ProjectFileData = {
  title: string;
  subtitle?: string;
  statement: string;
  facts: FileFact[];
  actions?: FileLink[];
  summary: string;
  abstract: string[];
  method: {
    title: string;
    columns?: { title: string; text?: string; steps?: string[] }[];
    paragraphs: string[];
    details?: { title: string; paragraphs: string[] }[];
  };
  images: DocumentImage[];
  record?: { title: string; facts: FileFact[]; paragraphs?: string[] };
  references: FileLink[];
};

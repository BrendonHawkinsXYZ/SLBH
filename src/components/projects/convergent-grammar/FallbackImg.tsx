"use client";

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

export function FallbackImg({ ...props }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={props.alt ?? ""}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = "none";
      }}
    />
  );
}

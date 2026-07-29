"use client";

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

/** Hides itself if the source 404s, so an empty image slot stays a clean frame. */
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

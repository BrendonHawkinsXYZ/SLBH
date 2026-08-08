import { FallbackImg } from "./FallbackImg";

type Props = {
  src: string;
  alt: string;
  caption: string;
  /** Frame proportion. Matches the shape of the export that lands in /public. */
  ratio?: "wide" | "four-three" | "square" | "tall" | "band";
  className?: string;
};

/**
 * One documentation plate: a proportioned frame, the image, a mono caption.
 * The frame keeps its space whether or not the file exists yet, so the page
 * reads the same before and after an export lands in public/projects/acg/.
 */
export function Plate({ src, alt, caption, ratio = "four-three", className }: Props) {
  return (
    <figure
      className={`acg-plate acg-plate--${ratio}${className ? ` ${className}` : ""}`}
    >
      <div
        className={`acg-plate-frame${src ? "" : " acg-plate-frame--empty"}`}
      >
        <div className="acg-plate-bg" />
        {src ? (
          <FallbackImg src={src} alt={alt} className="acg-img-fill" />
        ) : (
          <span className="t-mono acg-plate-tk">TK: {caption}</span>
        )}
      </div>
      <figcaption className="t-mono acg-plate-caption">{caption}</figcaption>
    </figure>
  );
}

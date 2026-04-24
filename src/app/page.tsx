import { MonoReadout } from "@/components/MonoReadout";
import { Reveal } from "@/components/Reveal";

export default function HomePage() {
  return (
    <>
      <section
        className="container-page"
        style={{ paddingTop: 80, paddingBottom: 80 }}
      >
        <Reveal layer="primary">
          <h1 className="t-display">Studio Lab BH</h1>
        </Reveal>
        <Reveal layer="editorial">
          <p
            className="t-body-lg"
            style={{ marginTop: 24, maxWidth: 640 }}
          >
            A systems research lab. Placeholder — home page build begins in the
            next step.
          </p>
        </Reveal>
      </section>

      <Reveal layer="readout">
        <MonoReadout pageName="Home" readout="SCROLL 0%" />
      </Reveal>
    </>
  );
}

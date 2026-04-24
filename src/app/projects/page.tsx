import { getAllProjects } from "@/lib/projects";
import { ProjectIndex } from "@/components/projects/ProjectIndex";
import { TrunkLine } from "@/components/TrunkLine";

export default function ProjectsPage() {
  const projects = getAllProjects();
  const total = projects.length;
  const ongoing = projects.filter((p) => p.status === "ongoing").length;
  const complete = projects.filter((p) => p.status === "complete").length;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      {/* §3.1 Hero */}
      <section
        style={{
          minHeight: 400,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          className="container-page"
          style={{ paddingTop: 80, paddingBottom: 96 }}
        >
          <p
            className="t-mono"
            style={{ opacity: 0.55, marginBottom: 20, marginTop: 0 }}
          >
            PROJECTS / {pad(total)} ACTIVE
          </p>
          <h1 className="t-h1" style={{ margin: "0 0 28px", maxWidth: 720 }}>
            Projects are instruments in the field.
          </h1>
          <p
            className="t-body-lg"
            style={{ margin: 0, maxWidth: 480, opacity: 0.82 }}
          >
            Each project is a working instrument, a built artifact, or a
            deployed experiment. Some become papers. Some become tools. All of
            them feed back into the lab&apos;s model of affect as a structured
            system.
          </p>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <TrunkLine length={110} nodePosition="top" />
        </div>
      </section>

      {/* §3.2 Mono readout strip */}
      <div
        className="hairline-t hairline-b proj-readout"
      >
        <span className="t-mono" style={{ opacity: 0.55 }}>
          SLBH / v2.0 / PROJECTS
        </span>
        <span
          className="t-label proj-readout-mid"
          style={{ opacity: 0.55, letterSpacing: "0.18em" }}
        >
          AFFECT · SYSTEMS · DATA · TIME
        </span>
        <span
          className="t-mono"
          style={{ opacity: 0.55, textAlign: "right" }}
        >
          {pad(total)} TOTAL · {pad(ongoing)} ONGOING · {pad(complete)} COMPLETE
        </span>
      </div>

      {/* §3.3 Project index */}
      <ProjectIndex projects={projects} />

      <style>{`
        .proj-readout {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px var(--pad-x-mobile);
          max-width: var(--max-w);
          margin-inline: auto;
          width: 100%;
          box-sizing: border-box;
        }
        @media (min-width: 768px) {
          .proj-readout { padding: 20px var(--pad-x); }
        }
        .proj-readout-mid { display: none; }
        @media (min-width: 768px) {
          .proj-readout-mid { display: block; }
        }
      `}</style>
    </>
  );
}

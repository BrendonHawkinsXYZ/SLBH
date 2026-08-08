import { getAllProjects, STATUS_ORDER, type ProjectStatus } from "@/lib/projects";
import { ProjectIndex } from "@/components/projects/ProjectIndex";

export default function ProjectsPage() {
  const projects = getAllProjects();
  const total = projects.length;
  const pad = (n: number) => String(n).padStart(2, "0");
  const labels: Record<ProjectStatus, string> = {
    flagship: "FLAGSHIP",
    active: "ACTIVE",
    seasonal: "SEASONAL",
    complete: "COMPLETE",
    archived: "ARCHIVED",
    "in-development": "IN DEVELOPMENT",
  };
  const statusReadout = STATUS_ORDER
    .map((status) => ({ status, count: projects.filter((p) => p.status === status).length }))
    .filter(({ count }) => count > 0)
    .map(({ status, count }) => `${pad(count)} ${labels[status]}`)
    .join(" · ");

  return (
    <>
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
          {pad(total)} TOTAL · {statusReadout}
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

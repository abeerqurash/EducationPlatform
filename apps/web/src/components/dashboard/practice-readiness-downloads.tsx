"use client";
import { readinessReportText, type ReadinessReport } from "@education/database/practice-readiness/report";
import { dashboardAction } from "@/components/shared/dashboard-action-styles";
export function PracticeReadinessDownloads({ report }: { report: ReadinessReport }) {
  function download(format: "json" | "txt") {
    const body = format === "json" ? JSON.stringify(report, null, 2) : readinessReportText(report);
    const url = URL.createObjectURL(new Blob([body], { type: format === "json" ? "application/json" : "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `practice-readiness-${report.exam.toLowerCase()}.${format}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className="flex flex-wrap gap-2" aria-label="Download matching readiness report">
    <button type="button" className={dashboardAction} disabled={!report.matchingSessions} onClick={() => download("txt")}>Download TXT</button>
    <button type="button" className={dashboardAction} disabled={!report.matchingSessions} onClick={() => download("json")}>Download JSON</button>
  </div>;
}

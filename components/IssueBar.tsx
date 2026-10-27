import LagosClock from "./LagosClock";

/**
 * Masthead strip above the home hero, in the spirit of a magazine's issue line.
 * "No. 26.10" is the year and month of the latest deploy, so it is always true.
 */
export default function IssueBar() {
  const now = new Date();
  const issue = `${String(now.getFullYear()).slice(2)}.${String(now.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="issue-bar" role="note" aria-label="Site masthead">
      <span>Show your working</span>
      <span className="hidden sm:inline">No. {issue}</span>
      <LagosClock />
    </div>
  );
}

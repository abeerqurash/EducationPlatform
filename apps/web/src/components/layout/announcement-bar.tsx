import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";

export function AnnouncementBar() {
  return (
    <div className="announcement">
      <div className="site-container announcement__inner">
        <span className="announcement__badge">
          New
        </span>

        <p>
          Smarter tools for students are being built every week.
        </p>

        <Link href="/tools" className="announcement__link">
          Explore tools
          <ArrowRightIcon />
        </Link>
      </div>
    </div>
  );
}
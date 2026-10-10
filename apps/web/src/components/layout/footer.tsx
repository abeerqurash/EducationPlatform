import Link from "next/link";

import { siteConfig } from "@/config/site";

const footerGroups = [
  {
    title: "Tools",
    links: [
      ["All tools", "/tools"],
      ["Grade calculators", "/tools/grades"],
      ["GPA calculators", "/tools/gpa"],
      ["Math tools", "/tools/math"],
      ["Study tools", "/tools/study"],
    ],
  },
  {
    title: "Learn",
    links: [
      ["Test prep", "/test-prep"],
      ["Admissions", "/admissions"],
      ["Practice", "/practice"],
      ["Resources", "/resources"],
      ["Guides", "/guides"],
    ],
  },
  {
    title: "Platform",
    links: [
      ["Pricing", "/pricing"],
      ["About", "/about"],
      ["Blog", "/blog"],
      ["Contact", "/contact"],
      ["Sign in", "/login"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
      ["Cookies", "/cookies"],
      ["Privacy preferences", "/privacy/preferences"],
      ["Accessibility", "/accessibility"],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link href="/" className="brand brand--footer">
              <span className="brand__mark" aria-hidden="true">
                E
              </span>

              <span className="brand__name">
                Education
                <span>Platform</span>
              </span>
            </Link>

            <p>
              Accurate tools and smarter resources for students,
              parents and educators.
            </p>
          </div>

          <div className="footer-links">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2>{group.title}</h2>

                <ul>
                  {group.links.map(([label, href]) => (
                    <li key={href}>
                      <Link href={href}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}.
            All rights reserved.
          </p>

          <p>
            Built for better learning.
          </p>
        </div>
      </div>
    </footer>
  );
}

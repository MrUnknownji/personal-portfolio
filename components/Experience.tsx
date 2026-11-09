import Link from "next/link";
import { PROFILE } from "@/data/profile";

export default function Experience() {
  return (
    <div className="experience" data-offset-reveal>
      <div className="experience-column">
        <h3 className="experience-heading">Experience</h3>
        <ol className="experience-list">
          {PROFILE.experience.map((entry) => (
            <li key={`${entry.role}-${entry.organization}`}>
              <span className="experience-period">{entry.period}</span>
              <div>
                <h4>
                  {entry.role} <span>· {entry.organization}</span>
                </h4>
                <p>{entry.summary}</p>
                {entry.highlights.length > 0 && (
                  <ul>
                    {entry.highlights.map((highlight) => (
                      <li key={highlight.text}>
                        {highlight.href ? (
                          <Link href={highlight.href}>
                            {highlight.text} <span aria-hidden="true">↗</span>
                          </Link>
                        ) : (
                          highlight.text
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
        <h3 className="experience-heading experience-heading-education">Education</h3>
        <ol className="experience-list">
          {PROFILE.education.map((entry) => (
            <li key={entry.title}>
              <span className="experience-period">{entry.period}</span>
              <div>
                <h4>
                  {entry.title} <span>· {entry.institution}</span>
                </h4>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="experience-column" id="skills">
        <h3 className="experience-heading">Skills</h3>
        <dl className="experience-skills">
          {PROFILE.skills.map((skill) => (
            <div key={skill.group}>
              <dt>{skill.group}</dt>
              <dd>{skill.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
        <p className="experience-open-to">
          <span>Open to</span>
          {PROFILE.openTo}
        </p>
      </div>
    </div>
  );
}

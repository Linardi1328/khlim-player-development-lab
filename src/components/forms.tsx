"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import {
  metrics,
  sessionTypes,
  skillLabels,
  skills,
  statuses,
  today,
} from "@/lib/domain";
type Field = {
  name: string;
  label: string;
  type?: string;
  value?: string | number;
  help?: string;
  options?: Record<string, string>;
  min?: number | string;
  max?: number | string;
  step?: string;
  maxLength?: number;
};
export function DataForm({
  endpoint,
  method = "POST",
  fields,
  submit,
  back,
  after,
}: {
  endpoint: string;
  method?: string;
  fields: Field[];
  submit: string;
  back?: string;
  after?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);
    setError("");
    setErrors({});
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to save. Please try again.");
        setErrors(data.fields ?? {});
        setPending(false);
        if (data.fields) {
          const field = form.elements.namedItem(Object.keys(data.fields)[0]);
          if (field instanceof HTMLElement) field.focus();
        }
        return;
      }
      router.push(data.redirect ?? after ?? `/athletes/${data.id}?saved=1`);
      router.refresh();
    } catch {
      setError(
        "Connection interrupted. Your entry is still here. Please try again.",
      );
      setPending(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="data-form">
      {error && (
        <div role="alert" className="form-error">
          {error}
        </div>
      )}
      <div className="form-fields">
        {fields.map((field) => {
          const id = `field-${field.name}`;
          const common = {
            id,
            name: field.name,
            required: true,
            defaultValue: field.value,
            disabled: pending,
            "aria-invalid": !!errors[field.name],
            "aria-describedby":
              [
                field.help ? `${id}-help` : "",
                errors[field.name] ? `${id}-error` : "",
              ]
                .filter(Boolean)
                .join(" ") || undefined,
          };
          return (
            <div
              className={`field ${field.type === "textarea" ? "field-wide" : ""}`}
              key={field.name}
            >
              <label htmlFor={id}>{field.label}</label>
              {field.options ? (
                <select {...common}>
                  {Object.entries(field.options).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  {...common}
                  rows={4}
                  maxLength={field.maxLength ?? 2000}
                />
              ) : (
                <input
                  {...common}
                  type={field.type ?? "text"}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  maxLength={field.maxLength ?? 240}
                  autoComplete={
                    field.name === "email"
                      ? "username"
                      : field.name === "password"
                        ? "current-password"
                        : "off"
                  }
                />
              )}
              {field.help && (
                <p id={`${id}-help`} className="field-help">
                  {field.help}
                </p>
              )}
              {errors[field.name] && (
                <p id={`${id}-error`} className="field-error">
                  {errors[field.name]}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="form-actions">
        {back && (
          <Link className="button button-quiet" href={back}>
            Cancel
          </Link>
        )}
        <button className="button button-dark" disabled={pending} type="submit">
          {pending ? (
            <>
              <LoaderCircle className="spin" size={17} />
              Saving…
            </>
          ) : (
            <>
              {submit}
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
export function LoginForm() {
  return (
    <DataForm
      endpoint="/api/auth/login"
      fields={[
        {
          name: "email",
          label: "Email address",
          type: "email",
          maxLength: 254,
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          maxLength: 128,
        },
      ]}
      submit="Sign in to the lab"
    />
  );
}
export function ProfileForm({
  athlete,
}: {
  athlete?: {
    id: string;
    name: string;
    group: string;
    jerseyNumber: number;
    position: string;
    focus: string;
  };
}) {
  return (
    <DataForm
      endpoint={athlete ? `/api/athletes/${athlete.id}` : "/api/athletes"}
      method={athlete ? "PATCH" : "POST"}
      fields={[
        {
          name: "name",
          label: "Athlete name",
          value: athlete?.name,
          maxLength: 80,
          help: "Use a fictional name. This lab contains synthetic athletes only.",
        },
        {
          name: "group",
          label: "Development group",
          options: {
            U9: "U9 · Foundation",
            U12: "U12 · Development",
            U15: "U15 · Performance",
          },
          value: athlete?.group,
        },
        {
          name: "jerseyNumber",
          label: "Jersey number",
          type: "number",
          min: 0,
          max: 99,
          value: athlete?.jerseyNumber ?? 0,
        },
        {
          name: "position",
          label: "Playing position",
          options: Object.fromEntries(
            [
              "Developing all-rounder",
              "Guard",
              "Wing",
              "Forward",
              "Center",
            ].map((x) => [x, x]),
          ),
          value: athlete?.position,
        },
        {
          name: "focus",
          label: "Current development focus",
          type: "textarea",
          maxLength: 240,
          value: athlete?.focus,
          help: "A clear, encouraging focus for the athlete’s next stage.",
        },
      ]}
      submit={athlete ? "Save profile" : "Create athlete"}
      back={athlete ? `/athletes/${athlete.id}` : "/athletes"}
    />
  );
}
export const recordNames: Record<string, string> = {
  assessments: "assessment",
  measurements: "measurement",
  goals: "goal",
  training: "training session",
  feedback: "coach feedback",
};
export function RecordForm({
  athleteId,
  kind,
}: {
  athleteId: string;
  kind: string;
}) {
  const [metric, setMetric] = useState<keyof typeof metrics>("FREE_THROW");
  const dateField = (name: string, label: string) => ({
    name,
    label,
    type: "date",
    value: today(),
    max: today(),
    min: "2000-01-01",
  });
  const fields: Record<string, Field[]> = {
    assessments: [
      dateField("assessedAt", "Assessment date"),
      ...skills.map((skill) => ({
        name: skill,
        label: skillLabels[skill],
        options: {
          "1": "1 · Exploring",
          "2": "2 · Developing",
          "3": "3 · Consistent",
          "4": "4 · Confident",
          "5": "5 · Advanced",
        },
        value: "3",
      })),
      {
        name: "notes",
        label: "Assessment notes",
        type: "textarea",
        help: "Describe the observed skills and the next area to practice.",
      },
    ],
    measurements: [
      {
        name: "metric",
        label: "Metric",
        options: Object.fromEntries(
          Object.entries(metrics).map(([key, value]) => [
            key,
            `${value.label} (${value.unit})`,
          ]),
        ),
      },
      {
        name: "value",
        label: `Result (${metrics[metric].unit})`,
        type: "number",
        min: metrics[metric].min,
        max: metrics[metric].max,
        step: "0.01",
      },
      dateField("measuredAt", "Measured date"),
      {
        name: "protocol",
        label: "Measurement protocol",
        type: "textarea",
        maxLength: 500,
        help: metrics[metric].help,
      },
    ],
    goals: [
      { name: "title", label: "Goal title", maxLength: 100 },
      {
        name: "dueDate",
        label: "Due date",
        type: "date",
        min: "2000-01-01",
        max: "2100-12-31",
      },
      {
        name: "target",
        label: "Success target",
        help: "Make it observable, such as 8 of 10 off-hand layups.",
      },
      {
        name: "status",
        label: "Status",
        options: statuses,
        value: "NOT_STARTED",
      },
      { name: "description", label: "Practice plan", type: "textarea" },
    ],
    training: [
      dateField("sessionDate", "Session date"),
      { name: "type", label: "Session type", options: sessionTypes },
      {
        name: "minutes",
        label: "Duration (minutes)",
        type: "number",
        min: 5,
        max: 240,
        value: 60,
      },
      { name: "notes", label: "Session notes", type: "textarea" },
    ],
    feedback: [
      {
        name: "feedback",
        label: "Feedback for the athlete",
        type: "textarea",
        help: "Celebrate something specific and offer one clear next step. This is visible to the athlete.",
      },
    ],
  };
  return (
    <div
      onChange={(event) => {
        if (
          event.target instanceof HTMLSelectElement &&
          event.target.name === "metric"
        )
          setMetric(event.target.value as keyof typeof metrics);
      }}
    >
      <DataForm
        endpoint={`/api/athletes/${athleteId}/${kind}`}
        fields={fields[kind]}
        submit={`Save ${recordNames[kind]}`}
        after={`/athletes/${athleteId}?tab=${kind}&saved=1`}
        back={`/athletes/${athleteId}?tab=${kind}`}
      />
    </div>
  );
}
export function GoalStatusForm({
  id,
  status,
}: {
  id: string;
  status: keyof typeof statuses;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  return (
    <form
      className="goal-status"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setSaved(false);
        setError("");
        const value = new FormData(event.currentTarget).get("status");
        try {
          const res = await fetch(`/api/goals/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: value }),
          });
          if (!res.ok) throw new Error();
          setSaved(true);
          router.refresh();
        } catch {
          setError("Could not update status. Try again.");
        } finally {
          setPending(false);
        }
      }}
    >
      <label className="sr-only" htmlFor={`goal-${id}`}>
        Goal status
      </label>
      <select
        id={`goal-${id}`}
        name="status"
        defaultValue={status}
        disabled={pending}
      >
        {Object.entries(statuses).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
      <button className="button button-small" disabled={pending}>
        {pending ? "Saving…" : "Update"}
      </button>
      {saved && (
        <span className="saved-inline" role="status">
          <Check size={15} />
          Saved
        </span>
      )}
      {error && (
        <span role="alert" className="field-error">
          {error}
        </span>
      )}
    </form>
  );
}

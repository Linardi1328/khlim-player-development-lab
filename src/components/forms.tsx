"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import {
  metrics,
  sessionTypes,
  skillLabels,
  skills,
  statuses,
  today,
} from "@/lib/domain";
import { useLanguage } from "./language-provider";

type AiDraftTarget = "focus" | "assessmentNotes" | "practicePlan";
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
  aiDraft?: AiDraftTarget;
};

export function PasswordInput({
  id,
  name,
  disabled,
  required = true,
  autoComplete = "current-password",
  ariaInvalid,
  ariaDescribedBy,
  maxLength = 128,
}: {
  id: string;
  name: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  maxLength?: number;
}) {
  const { tr } = useLanguage();
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-shell">
      <input
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        type={visible ? "text" : "password"}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((value) => !value)}
        aria-label={tr(visible ? "Hide password" : "Show password")}
        title={tr(visible ? "Hide password" : "Show password")}
        disabled={disabled}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

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
  const { locale, tr } = useLanguage();
  const [pending, setPending] = useState(false);
  const [drafting, setDrafting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [aiErrors, setAiErrors] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const name = Object.keys(errors)[0];
    const field = name ? formRef.current?.elements.namedItem(name) : null;
    if (field instanceof HTMLElement) field.focus();
  }, [errors]);

  async function draftField(field: Field) {
    if (!field.aiDraft || !formRef.current) return;
    setDrafting(field.name);
    setAiErrors((current) => ({ ...current, [field.name]: "" }));
    try {
      const context = Object.fromEntries(
        Array.from(new FormData(formRef.current).entries()).map(
          ([key, value]) => [key, String(value)],
        ),
      );
      const response = await fetch("/api/ai/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: field.aiDraft,
          language: locale,
          context,
        }),
      });
      const data = await response.json();
      if (!response.ok || typeof data.draft !== "string")
        throw new Error(data.error ?? "AI drafting is unavailable right now.");
      const textarea = formRef.current.elements.namedItem(field.name);
      if (textarea instanceof HTMLTextAreaElement) {
        textarea.value = data.draft.slice(0, field.maxLength ?? 2000);
        textarea.focus();
      }
    } catch (draftError) {
      setAiErrors((current) => ({
        ...current,
        [field.name]:
          draftError instanceof Error
            ? draftError.message
            : "AI drafting is unavailable right now.",
      }));
    } finally {
      setDrafting(null);
    }
  }

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
    <form ref={formRef} onSubmit={handleSubmit} className="data-form">
      {error && (
        <div role="alert" className="form-error">
          {tr(error)}
        </div>
      )}
      <div className="form-fields">
        {fields.map((field) => {
          const id = `field-${field.name}`;
          const describedBy =
            [
              field.help ? `${id}-help` : "",
              errors[field.name] ? `${id}-error` : "",
              aiErrors[field.name] ? `${id}-ai-error` : "",
            ]
              .filter(Boolean)
              .join(" ") || undefined;
          const common = {
            id,
            name: field.name,
            required: true,
            defaultValue: field.value,
            disabled: pending,
            "aria-invalid": !!errors[field.name],
            "aria-describedby": describedBy,
          };
          return (
            <div
              className={`field ${field.type === "textarea" ? "field-wide" : ""}`}
              key={field.name}
            >
              <div className="field-label-row">
                <label htmlFor={id}>{tr(field.label)}</label>
                {field.aiDraft && (
                  <button
                    type="button"
                    className="ai-draft-button"
                    onClick={() => draftField(field)}
                    disabled={pending || drafting === field.name}
                  >
                    {drafting === field.name ? (
                      <LoaderCircle className="spin" size={14} />
                    ) : (
                      <Sparkles size={14} />
                    )}
                    {tr(
                      drafting === field.name ? "Drafting…" : "Draft with AI",
                    )}
                  </button>
                )}
              </div>
              {field.options ? (
                <select {...common}>
                  {Object.entries(field.options).map(([value, label]) => (
                    <option key={value} value={value}>
                      {tr(label)}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  {...common}
                  rows={4}
                  maxLength={field.maxLength ?? 2000}
                />
              ) : field.type === "password" ? (
                <PasswordInput
                  id={id}
                  name={field.name}
                  disabled={pending}
                  ariaInvalid={!!errors[field.name]}
                  ariaDescribedBy={describedBy}
                  maxLength={field.maxLength ?? 128}
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
                  {tr(field.help)}
                </p>
              )}
              {field.aiDraft && (
                <p className="ai-helper">
                  <Sparkles size={13} aria-hidden="true" />
                  {tr("Review and edit this suggestion before saving.")}
                </p>
              )}
              {errors[field.name] && (
                <p id={`${id}-error`} className="field-error">
                  {tr(errors[field.name])}
                </p>
              )}
              {aiErrors[field.name] && (
                <p id={`${id}-ai-error`} role="alert" className="field-error">
                  {tr(aiErrors[field.name])}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="form-actions">
        {back && (
          <Link className="button button-quiet" href={back}>
            {tr("Cancel")}
          </Link>
        )}
        <button className="button button-dark" disabled={pending} type="submit">
          {pending ? (
            <>
              <LoaderCircle className="spin" size={17} />
              {tr("Saving…")}
            </>
          ) : (
            <>
              {tr(submit)}
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export function LoginForm() {
  const { tr } = useLanguage();
  return (
    <>
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
      <div className="login-form-tools">
        <Link href="/forgot-password" className="forgot-link">
          {tr("Forgot password?")}
        </Link>
      </div>
    </>
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
            ].map((value) => [value, value]),
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
          aiDraft: "focus",
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
        aiDraft: "assessmentNotes",
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
      {
        name: "description",
        label: "Practice plan",
        type: "textarea",
        aiDraft: "practicePlan",
      },
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
  const { tr } = useLanguage();
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
          setError(tr("Could not update status. Try again."));
        } finally {
          setPending(false);
        }
      }}
    >
      <label className="sr-only" htmlFor={`goal-${id}`}>
        {tr("Goal status")}
      </label>
      <select
        id={`goal-${id}`}
        name="status"
        defaultValue={status}
        disabled={pending}
      >
        {Object.entries(statuses).map(([key, value]) => (
          <option key={key} value={key}>
            {tr(value)}
          </option>
        ))}
      </select>
      <button className="button button-small" disabled={pending}>
        {pending ? tr("Saving…") : tr("Update")}
      </button>
      {saved && (
        <span className="saved-inline" role="status">
          <Check size={15} />
          {tr("Saved")}
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

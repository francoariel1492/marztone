interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  required?: boolean;
  placeholder?: string;
}

export function Field({ label, value, onChange, type = 'text', textarea, required, placeholder }: FieldProps) {
  return (
    <label className="block">
      <span className="label">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {textarea ? (
        <textarea
          rows={3}
          className="input resize-y"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          className="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}

interface BilingualFieldProps {
  label: string;
  valueEs: string;
  valueEn: string;
  onChangeEs: (v: string) => void;
  onChangeEn: (v: string) => void;
  textarea?: boolean;
  required?: boolean;
}

/** Par de campos ES/EN uno al lado del otro. */
export function BilingualField({
  label,
  valueEs,
  valueEn,
  onChangeEs,
  onChangeEn,
  textarea,
  required,
}: BilingualFieldProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label={`${label} (ES)`} value={valueEs} onChange={onChangeEs} textarea={textarea} required={required} />
      <Field label={`${label} (EN)`} value={valueEn} onChange={onChangeEn} textarea={textarea} required={required} />
    </div>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-wood-700 dark:text-cream-200">
      <input
        type="checkbox"
        className="h-4 w-4 accent-copper-500"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

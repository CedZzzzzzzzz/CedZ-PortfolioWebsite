import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import {
  MESSAGE_MAX,
  validateContactMessage,
  type ContactErrors,
  type ContactField,
} from '../../../lib/contact/contactMessage'
import { sendContactMessage } from '../../../lib/contact/sendContactMessage'
import { suggestEmail } from '../../../lib/contact/suggestEmail'
import { DesktopIcon } from './DesktopIcon'

interface ContactDialogProps {
  open: boolean
  /** Shown to copy when sending fails. */
  email: string
  onClose: () => void
}

type Phase = 'form' | 'sending' | 'limited' | 'failed' | 'sent'

const empty: Record<ContactField, string> = {
  name: '',
  email: '',
  org: '',
  message: '',
}

const inputs = [
  {
    field: 'name',
    label: 'name',
    type: 'text',
    autoComplete: 'name',
    placeholder: 'Juan Dela Cruz',
    maxLength: 80,
    wide: false,
    optional: false,
  },
  {
    field: 'email',
    label: 'email',
    type: 'email',
    autoComplete: 'email',
    placeholder: 'you@company.com',
    maxLength: 120,
    wide: false,
    optional: false,
  },
  {
    field: 'org',
    label: 'company or school',
    type: 'text',
    autoComplete: 'organization',
    placeholder: "Where you're writing from",
    maxLength: 100,
    wide: true,
    optional: true,
  },
] as const

/** "Email me" dialog: a short form that sends the message without leaving the site. */
export function ContactDialog({ open, email, onClose }: ContactDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const done = useRef<HTMLButtonElement>(null)
  const id = useId()
  const [values, setValues] = useState(empty)
  const [website, setWebsite] = useState('')
  const [errors, setErrors] = useState<ContactErrors>({})
  const [phase, setPhase] = useState<Phase>('form')
  const sent = phase === 'sent'
  const emailFix = suggestEmail(values.email)
  const unsent = phase === 'limited' || phase === 'failed'

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (open && !element.open) element.showModal()
    else if (!open && element.open) element.close()
  }, [open])

  useEffect(() => {
    if (sent) done.current?.focus()
  }, [sent])

  function change(field: ContactField, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => ({ ...previous, [field]: undefined }))
  }

  function reset() {
    setValues(empty)
    setErrors({})
    setPhase('form')
  }

  // A sent message is cleared on close; an unsent draft is kept.
  function close() {
    if (sent) reset()
    onClose()
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const result = validateContactMessage(values)
    if (!result.ok) {
      setErrors(result.errors)
      const first = Object.keys(result.errors)[0]
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setPhase('sending')
    setPhase(await sendContactMessage(result.message, website))
  }

  function describedBy(field: ContactField) {
    return errors[field] ? `${id}-${field}-error` : undefined
  }

  function error(field: ContactField) {
    return (
      errors[field] && (
        <p className="dp-msg-error mono" id={`${id}-${field}-error`}>
          {errors[field]}
        </p>
      )
    )
  }

  return (
    <dialog
      ref={dialog}
      className="dp-modal dp-msg"
      aria-labelledby={`${id}-title`}
      onClose={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div className="dp-pane dp-msg-pane">
        <div className="dp-pane-top">
          <p className="dp-ptitle">Message</p>
          <button
            type="button"
            className="dp-modal-close dp-msg-close"
            aria-label="Close"
            onClick={close}
          >
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="dp-msg-body">
          <p className="dp-crumb mono">
            <span className="dp-accent">❯</span> mail --to marcus
          </p>
          <h2 className="dp-msg-title" id={`${id}-title`}>
            {sent ? 'Message sent.' : 'Send me a message.'}
          </h2>

          {sent ? (
            <div className="dp-msg-sent">
              <p className="dp-msg-log mono" role="status">
                <span className="dp-msg-ok">[ ok ]</span> message delivered
                <br />
                <span className="dp-msg-ok">[ ok ]</span> reply goes to{' '}
                {values.email.trim()}
              </p>
              <p className="dp-msg-sub">
                Thanks, {values.name.trim().split(/\s+/)[0]}. I&apos;ll get back
                to you soon.
              </p>
              <div className="dp-msg-actions">
                <button
                  type="button"
                  className="dp-cream"
                  ref={done}
                  onClick={close}
                >
                  Done
                </button>
                <button type="button" className="dp-msg-ghost" onClick={reset}>
                  Send another
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="dp-msg-sub">
                I read everything and usually reply within a day or two.
              </p>
              <form className="dp-msg-form" noValidate onSubmit={submit}>
                {inputs.map((input) => (
                  <div
                    key={input.field}
                    className={`dp-msg-field${input.wide ? ' wide' : ''}`}
                  >
                    <label className="mono" htmlFor={`${id}-${input.field}`}>
                      {input.label}
                      {input.optional && <small>optional</small>}
                    </label>
                    <input
                      id={`${id}-${input.field}`}
                      name={input.field}
                      type={input.type}
                      autoComplete={input.autoComplete}
                      placeholder={input.placeholder}
                      maxLength={input.maxLength}
                      value={values[input.field]}
                      aria-invalid={Boolean(errors[input.field])}
                      aria-describedby={describedBy(input.field)}
                      onChange={(event) =>
                        change(input.field, event.target.value)
                      }
                    />
                    {error(input.field)}
                    {input.field === 'email' && emailFix && !errors.email && (
                      <p className="dp-msg-hint mono">
                        did you mean{' '}
                        <button
                          type="button"
                          onClick={() => change('email', emailFix)}
                        >
                          {emailFix}
                        </button>
                        ?
                      </p>
                    )}
                  </div>
                ))}
                <div className="dp-msg-field wide">
                  <label className="mono" htmlFor={`${id}-message`}>
                    message
                    <small>
                      {values.message.length} / {MESSAGE_MAX}
                    </small>
                  </label>
                  <textarea
                    id={`${id}-message`}
                    name="message"
                    placeholder="Tell me about the project, role, or idea."
                    maxLength={MESSAGE_MAX}
                    value={values.message}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={describedBy('message')}
                    onChange={(event) => change('message', event.target.value)}
                  />
                  {error('message')}
                </div>
                {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
                <div className="dp-msg-trap" aria-hidden="true">
                  <label htmlFor={`${id}-website`}>Website</label>
                  <input
                    id={`${id}-website`}
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                  />
                </div>
                <div className="dp-msg-foot">
                  <p
                    className={`dp-msg-status mono${unsent ? ' failed' : ''}`}
                    role="status"
                  >
                    {unsent && (
                      <>
                        {phase === 'limited'
                          ? 'too many messages for now. wait a few minutes, or write to '
                          : "couldn't send. try again, or write to "}
                        <span className="dp-msg-address">{email}</span>
                      </>
                    )}
                  </p>
                  <button
                    type="submit"
                    className="dp-cream"
                    disabled={phase === 'sending'}
                  >
                    {phase === 'sending' ? (
                      <span className="dp-msg-spin" aria-hidden="true" />
                    ) : (
                      <DesktopIcon name="send" size={18} strokeWidth={2} />
                    )}
                    {phase === 'sending' ? 'Sending…' : 'Send message'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </dialog>
  )
}

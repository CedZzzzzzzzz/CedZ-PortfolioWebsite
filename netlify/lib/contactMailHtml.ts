import type { ContactMessage } from '../../src/lib/contact/contactMessage'

const SITE = 'https://marcuscedricpedrosa.dev'
const SANS =
  "-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue',Helvetica,Arial,sans-serif"
const MONO =
  "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

/*
 * Inline styles are the light theme. Clients that honour prefers-color-scheme
 * (Apple Mail, iOS Mail, Outlook apps) swap to the site's dark tokens through
 * these classes; [data-ogsc]/[data-ogsb] cover Outlook.com's dark mode.
 */
const DARK_CSS = `
:root{color-scheme:light dark;supported-color-schemes:light dark;}
@media (prefers-color-scheme: dark){
  .bg{background:#000000 !important;}
  .card{background:#0b0b0b !important;border-color:#2a2a2a !important;}
  .line{border-color:#2a2a2a !important;}
  .fg{color:#e8e8e8 !important;}
  .mut{color:#707070 !important;}
  .box{background:#000000 !important;border-color:#2a2a2a !important;}
  .btn{background:#f2f2f2 !important;}
  .btn-t{color:#000000 !important;}
  .link{color:#e8e8e8 !important;}
}
[data-ogsc] .fg{color:#e8e8e8 !important;}
[data-ogsc] .mut{color:#707070 !important;}
[data-ogsc] .link{color:#e8e8e8 !important;}
[data-ogsb] .bg{background:#000000 !important;}
[data-ogsb] .card{background:#0b0b0b !important;}
[data-ogsb] .box{background:#000000 !important;}
`

/** Visitor input goes into HTML, so every value is escaped before use. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function row(key: string, value: string): string {
  return `<tr>
<td class="mut line" width="96" style="padding:12px 0;border-top:1px solid #e8e8ed;font-family:${MONO};font-size:12px;color:#86868b;vertical-align:top;">${key}</td>
<td class="fg line" style="padding:12px 0;border-top:1px solid #e8e8ed;font-size:15px;color:#1d1d1f;">${value}</td>
</tr>`
}

/** Apple-style HTML body for a contact-form message, branded like the site, light or dark. */
export function contactMailHtml(
  message: ContactMessage,
  subject: string,
): string {
  const name = escapeHtml(message.name.replace(/\s+/g, ' '))
  const email = escapeHtml(message.email)
  const replyHref = escapeHtml(
    `mailto:${message.email}?subject=${encodeURIComponent(`Re: ${subject}`)}`,
  )
  const body = escapeHtml(message.message).replace(/\r?\n/g, '<br>')

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<style>${DARK_CSS}</style></head>
<body class="bg" style="margin:0;padding:0;background:#f5f5f7;">
<table role="presentation" class="bg" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;font-family:${SANS};">
<tr><td align="center" style="padding:36px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

<tr><td style="padding:0 4px 18px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td><a href="${SITE}" style="text-decoration:none;"><div style="width:36px;height:36px;border-radius:9px;background:#000000;"><img src="${SITE}/Logo/Logo.png" width="36" height="36" alt="cedz" style="display:block;border:0;"></div></a></td>
<td style="padding-left:12px;"><div class="fg" style="font-size:15px;font-weight:600;color:#1d1d1f;">cedz.portfolio</div><div class="mut" style="font-family:${MONO};font-size:11px;color:#86868b;">contact form</div></td>
</tr></table>
</td></tr>

<tr><td class="card" style="background:#ffffff;border:1px solid #e8e8ed;border-radius:18px;padding:34px 30px;">
<div class="mut" style="font-family:${MONO};font-size:12px;color:#86868b;">~/cedz-portfolio/contact.txt</div>
<h1 class="fg" style="margin:8px 0 22px;font-size:28px;line-height:1.15;font-weight:600;letter-spacing:-.02em;color:#1d1d1f;">${name} wants to talk.</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${row('from', name)}
${row('email', `<a class="link" href="mailto:${email}" style="color:#1d1d1f;text-decoration:underline;">${email}</a>`)}
${message.org ? row('org', escapeHtml(message.org)) : ''}
</table>
<div class="box fg" style="margin-top:20px;padding:20px;background:#f5f5f7;border:1px solid #e5e5ea;border-radius:12px;font-size:15px;line-height:1.55;color:#1d1d1f;">${body}</div>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;"><tr>
<td class="btn" style="background:#000000;border-radius:980px;"><a class="btn-t" href="${replyHref}" style="display:inline-block;padding:13px 26px;font-size:15px;font-weight:500;color:#ffffff;text-decoration:none;">Reply to ${name}</a></td>
</tr></table>
</td></tr>

<tr><td align="center" class="mut" style="padding:22px 16px 0;font-size:12px;line-height:1.5;color:#86868b;">
Sent from <a class="mut" href="${SITE}" style="color:#86868b;">marcuscedricpedrosa.dev</a>. Replying goes straight to ${name}.
</td></tr>

</table>
</td></tr>
</table>
</body></html>`
}

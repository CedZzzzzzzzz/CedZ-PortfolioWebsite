export function gmailComposeUrl(mailtoUrl: string): string {
  const email = mailtoUrl.replace(/^mailto:/i, '').split('?')[0] ?? ''
  return `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}`
}

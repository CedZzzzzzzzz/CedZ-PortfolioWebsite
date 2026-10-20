export interface VisitorInputs {
  userAgent: string
  screenWidth: number
  screenHeight: number
  timeZone: string
  date: Date
}

export interface VisitorInfo {
  browser: string
  os: string
  screen: string
  city: string
  sessionTime: string
}

export function getVisitorInfo(inputs: VisitorInputs): VisitorInfo {
  const { userAgent, screenWidth, screenHeight, timeZone, date } = inputs
  let browser = 'a browser'
  if (/Edg\//.test(userAgent)) browser = 'Edge'
  else if (/OPR\//.test(userAgent)) browser = 'Opera'
  else if (/Firefox\//.test(userAgent)) browser = 'Firefox'
  else if (/Chrome\//.test(userAgent)) browser = 'Chrome'
  else if (/Safari\//.test(userAgent)) browser = 'Safari'

  let os = 'an unknown OS'
  if (/Windows/.test(userAgent)) os = 'Windows'
  else if (/Android/.test(userAgent)) os = 'Android'
  else if (/iPhone|iPad|iPod/.test(userAgent)) os = 'iOS'
  else if (/Mac OS X/.test(userAgent)) os = 'macOS'
  else if (/CrOS/.test(userAgent)) os = 'ChromeOS'
  else if (/Linux/.test(userAgent)) os = 'Linux'

  let sessionTime: string
  let city = timeZone
    ? timeZone.split('/').at(-1)?.replace(/_/g, ' ') || 'somewhere'
    : 'somewhere'
  try {
    sessionTime = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date)
  } catch {
    sessionTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date)
    city = 'somewhere'
  }

  return {
    browser,
    os,
    screen: `${screenWidth}×${screenHeight}`,
    city,
    sessionTime,
  }
}

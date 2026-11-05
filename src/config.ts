export const demoUploadsEnabled =
  !import.meta.env.PROD && import.meta.env.VITE_ENABLE_DEMO_UPLOADS === 'true'

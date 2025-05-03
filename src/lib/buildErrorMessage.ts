/**
 * Turn your backend’s { message, details }
 * into one string: "message – details"
 */
export function buildErrorMessage(json: {
    message?: string;
    details?: string;
  }): string {
    const msg = json.message ?? 'Unknown error';
    const det = json.details ? ` – ${json.details}` : '';
    return msg + det;
  }
  
export const ADMIN_USERNAME = 'aicc-admin'; // there is no database, this is only a tool to help us manage JSONs
export const ADMIN_PASSWORD = 'aicc-admin'; // useless to login in production with this =))

const SESSION_KEY = 'aicc-admin-auth';

export const isAdminAuthed = (): boolean => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  } catch {
    return false;
  }
};

export const loginAdmin = (username: string, password: string): boolean => {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    try {
      sessionStorage.setItem(SESSION_KEY, 'true');
    } catch {
      /* ignore */
    }
    return true;
  }
  return false;
};

export const logoutAdmin = (): void => {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
};

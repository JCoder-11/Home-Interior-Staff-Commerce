export const ROLES = {
  SALES: "sales",
  ADMIN: "admin",
  IT_ADMIN: "it_admin",
};

// Where each role lands after login.
const homePaths = {
  sales: "/dashboard",
  admin: "/admin",
  it_admin: "/it-admin",
};

export function homeFor(role) {
  return homePaths[role] || "/login";
}
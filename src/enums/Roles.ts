export enum Role {
  ADMIN = "admin",
  MANAGER = "manager",
  MEMBER = "member",
}

export const RoleOptions = [
  { label: "Admin", value: Role.ADMIN },
  { label: "Manager", value: Role.MANAGER },
  { label: "Member", value: Role.MEMBER },
];

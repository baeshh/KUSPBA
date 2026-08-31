export type PublicAuthUser = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  affiliation: string | null;
  school: string | null;
  department: string | null;
  academicYear: string | null;
  profileCompleted: boolean;
  grade: string;
};

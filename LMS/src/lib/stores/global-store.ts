// global-store.ts
import { writable } from 'svelte/store';

type AdminDetails = {
  adminName: string;
  schoolId: string | null;
};

type SuperAdminDetails = {
  adminName: string;
  // Add any other super admin specific fields here
};

type TeacherDetails = {
  teacherName: string;
  schoolId: string | null;
  // Add any other teacher specific fields here
};

type GlobalStore = {
  role: string;
  details: AdminDetails | SuperAdminDetails | TeacherDetails;
};

export const writableGlobalStore = writable<GlobalStore>({
  role: '',
  details: {
    adminName: '',
    schoolId: null,
  },
});

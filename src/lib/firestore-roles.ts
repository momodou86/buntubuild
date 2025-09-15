
'use server';

import {
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const rolesCollection = collection(db, 'roles');

const allPermissions = [
  'View Dashboard',
  'Manage Users',
  'View Transactions',
  'Approve Releases',
  'Manage Roles',
  'Access Settings',
  'Manage Own Savings',
  'Request Fund Releases',
  'View Own Transactions',
];

const initialRoles: Omit<Role, 'id'>[] = [
  {
    name: 'Admin',
    description: 'Has full access to all system features, including user management and settings.',
    permissions: allPermissions,
  },
  {
    name: 'User',
    description: 'Standard user with access to their own dashboard and savings goals.',
    permissions: [
      'View Dashboard',
      'Manage Own Savings',
      'Request Fund Releases',
      'View Own Transactions',
    ],
  },
];

async function seedInitialRoles() {
    for (const role of initialRoles) {
        const q = query(rolesCollection, where('name', '==', role.name));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            await addDoc(rolesCollection, role);
            console.log(`Seeded role: ${role.name}`);
        }
    }
}

export async function getRoles(): Promise<Role[]> {
  await seedInitialRoles();
  const snapshot = await getDocs(rolesCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Role[];
}

export async function createRole(role: Omit<Role, 'id'>): Promise<Role> {
  const docRef = await addDoc(rolesCollection, role);
  return { id: docRef.id, ...role };
}

export async function updateRole(id: string, data: Partial<Omit<Role, 'id' | 'name'>>): Promise<void> {
  const roleRef = doc(db, 'roles', id);
  // The name of a role cannot be updated.
  await setDoc(roleRef, data, { merge: true });
}

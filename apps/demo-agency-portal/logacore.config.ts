import { defineConfig } from '@logacore/core';
import { plugin as helloWorld } from '@logacore/plugin-hello-world';
import { plugin as cms } from '@logacore/plugin-cms';
import { plugin as usersRoles } from '@logacore/plugin-users-roles';

export default defineConfig({
  plugins: [helloWorld, cms, usersRoles],
});

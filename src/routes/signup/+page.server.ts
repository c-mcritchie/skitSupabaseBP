import type {Actions, PageServerLoad} from './$types';
import {superValidate} from "sveltekit-superforms/server";
import { signupSchema } from "$lib/validate"
import {fail} from "@sveltejs/kit";

export const load : PageServerLoad = (async () => {
  const form = await superValidate(signupSchema);

  return { form };
});

export const actions : Actions = {
  default: async ({request, fetch}) => {
    const form = await superValidate(request, signupSchema);
    if (!form.valid) return fail(400, {form});

    const {email, password} = form.data;

    await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password})
    });

    return {form};
  }
}
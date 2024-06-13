import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getContact, updateContact } from "../data";

export const action = async ({ params, request }: ActionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/todolists/${params.contactId}`);
};

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const todo = await getContact(params.contactId);
  if (!todo) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ todo });
};

export default function EditContact() {
  const { todo } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form id="contact-form" method="post">
      <label>
        <span>Title</span>
        <input
          defaultValue={todo.title}
          name="title"
          placeholder="RemixでTodoアプリを作る"
          type="text"
        />
      </label>
      <label>
        <span>Description</span>
        <input
          defaultValue={todo.description}
          name="description"
          placeholder="Remixを学ぶため、RemixでTodoアプリを作る"
          type="text"
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)} type="button">
          Cancel
        </button>
      </p>
    </Form>
  );
}

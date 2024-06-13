import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

// import type { ContactRecord } from "../data";
import type { TodoRecord } from "../data";
import { getContact, updateContact } from "../data";

export const action = async ({ params, request }: ActionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  return updateContact(params.contactId, {
    completed: formData.get("completed") === "true",
  });

};

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const todo = await getContact(params.contactId);
  if (!todo) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ todo });
};

export default function Contact() {
  const { todo } = useLoaderData<typeof loader>();

  return (
    <div id="contact">
      <div>
        <h1>
          {todo.title ? (
            <>
              {todo.title}
            </>
          ) : (
            <i>No Card</i>
          )}{" "}
          <Completed todo={todo} />
        </h1>

        {todo.description ? (
          <p>
            {todo.description}
          </p>
        ) : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record.",
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Completed({ todo }: { todo: Pick<TodoRecord, "completed"> }) {
  const fetcher = useFetcher();
  const completed = fetcher.formData
    ? fetcher.formData.get("completed") === "true"
    : todo.completed;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={completed ? "Remove from completed" : "Add to completed"}
        name="completed"
        value={completed ? "false" : "true"}
      >
        {completed ? "☑" : "☐️"}
      </button>
    </fetcher.Form>
  );
}

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export default function AddScript({ apiUrl }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.user?.token);

  const [isSubmitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = useCallback(
    ({ script_name: name }) => {
      (async () => {
        try {
          const resp = await fetch(`${apiUrl}/scripting/create-program`, {
            method: "POST",
            body: JSON.stringify({ name }),
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const body = await resp.json();

          if (resp.status != 200) {
            setErr(body.detail);
          } else {
            console.log(resp);
          }
        } catch (err) {
          console.error("Failed to create script", err);
          setErr("Failed to submit program");
        }
        setSubmitting(false);
      })();

      setSubmitting(true);
      setErr(null);
    },
    [setSubmitting, setErr]
  );

  return token ? (
    <div>
      <b>New Script</b>
      <div>{err}</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label for="script_name">New Script Name: </label>
          <input
            type="text"
            name="script_name"
            {...register("script_name")}
          ></input>
          {errors?.script_name?.type}
        </div>
        <div>
          <input type="submit" disabled={isSubmitting} />
        </div>
      </form>
    </div>
  ) : (
    "Log in plz"
  );
}

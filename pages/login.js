import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

export default function LoginPage({ apiUrl }) {
  const token = useSelector((state) => state?.user?.token);
  const dispatch = useDispatch();

  const [err, setErr] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = useCallback((values) => {
    setSubmitting(true);
    (async () => {
      try {
        const data = new URLSearchParams();
        data.append("username", values.username);
        data.append("password", values.password);
        const response = await fetch(`${apiUrl}/token`, {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          referrerPolicy: "no-referrer",
          body: data,
        });

        const responseBody = await response.json();

        console.debug(responseBody);
        switch (response.status) {
          case 200:
            dispatch({
              type: "USER.SET_TOKEN",
              token: responseBody.access_token,
            });
            break;
          case 400:
            setErr(responseBody.detail);
            break;
          default:
            console.error("Unhandled status code", response);
            setErr("Unhandled error while submitting");
        }
      } catch (err) {
        console.warn("Failed to log in", err);
      }

      setSubmitting(false);
    })();
  });

  if (!token)
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        {err ? err : null}
        <div>
          <label>Username</label>
          <input
            type="text"
            {...register("username", { required: true })}
          ></input>
          {errors.username && touched.username && errors.username}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("password", { required: true })}
          ></input>
          {errors.password && touched.password && errors.password}
        </div>
        <button type="submit" disabled={isSubmitting}>
          Log in
        </button>
      </form>
    );
  else return "Hello user";
}

export async function getStaticProps(context) {
  const { NEXT_CAO_API_URL: apiUrl } = process.env;

  return {
    props: {
      apiUrl,
    },
  };
}
